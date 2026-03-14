import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

const url = SUPABASE_URL;
const publishableKey = SUPABASE_PUBLISHABLE_KEY ?? SUPABASE_ANON_KEY;
const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY;
const password = "Passw0rd!";

if (!url || !publishableKey || !serviceRoleKey) {
  console.error(
    "Missing SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY/SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const publicClient = createClient(url, publishableKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function uniqueEmail(label) {
  return `smoke+${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

function asUser(accessToken) {
  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

async function signUp(label) {
  const email = uniqueEmail(label);
  const { data, error } = await publicClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`signUp failed for ${label}: ${error.message}`);
  }

  assert(data.user?.id, `No user id returned for ${label}.`);
  assert(data.session?.access_token, `No session returned for ${label}.`);

  return {
    id: data.user.id,
    email,
    accessToken: data.session.access_token,
  };
}

async function waitForProfile(userId) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data, error } = await admin
      .from("users")
      .select("id, email, plan")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Profile lookup failed: ${error.message}`);
    }

    if (data) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for public.users row for ${userId}.`);
}

async function cleanupUser(userId) {
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.warn(`Cleanup warning for ${userId}: ${error.message}`);
  }
}

const createdUserIds = [];

try {
  const alice = await signUp("alice");
  createdUserIds.push(alice.id);
  const aliceProfile = await waitForProfile(alice.id);
  assert(aliceProfile.email === alice.email, "Auth -> public.users sync email mismatch.");
  assert(aliceProfile.plan === "free", "New users should default to the free plan.");

  const aliceClient = asUser(alice.accessToken);
  const { data: visibleProfiles, error: visibleProfilesError } = await aliceClient
    .from("users")
    .select("id, email, plan");

  if (visibleProfilesError) {
    throw new Error(`Own profile select failed: ${visibleProfilesError.message}`);
  }

  assert(visibleProfiles.length === 1, "RLS should only expose the signed-in user's profile.");
  assert(visibleProfiles[0].id === alice.id, "RLS returned the wrong profile.");

  await aliceClient
    .from("users")
    .update({ plan: "pro" })
    .eq("id", alice.id);
  const lockedProfile = await waitForProfile(alice.id);
  assert(lockedProfile.plan === "free", "Users should not be able to update their own plan.");

  const { data: app, error: appError } = await aliceClient
    .from("apps")
    .insert({
      user_id: alice.id,
      name: "Smoke Test App",
      platform: "web",
      launch_date: "2026-04-01",
    })
    .select("id, user_id")
    .single();

  if (appError) {
    throw new Error(`App insert failed: ${appError.message}`);
  }

  const { data: checklistStatus, error: checklistError } = await aliceClient
    .from("checklist_item_statuses")
    .insert({
      app_id: app.id,
      cms_item_id: "cms-checklist-1",
      completed: true,
    })
    .select("completed, completed_at")
    .single();

  if (checklistError) {
    throw new Error(`Checklist insert failed: ${checklistError.message}`);
  }

  assert(
    checklistStatus.completed && checklistStatus.completed_at,
    "Checklist trigger should stamp completed_at when completed is true.",
  );

  const { error: deliverableError } = await aliceClient.from("deliverables").insert({
    app_id: app.id,
    cms_item_id: "cms-deliverable-1",
    type: "link",
    content: "https://example.com/preview",
  });

  if (deliverableError) {
    throw new Error(`Deliverable insert failed: ${deliverableError.message}`);
  }

  const { error: routineError } = await aliceClient.from("routine_logs").insert({
    app_id: app.id,
    cms_task_id: "cms-routine-1",
    week_number: 11,
    completed: true,
  });

  if (routineError) {
    throw new Error(`Routine log insert failed: ${routineError.message}`);
  }

  const { error: duplicateRoutineError } = await aliceClient.from("routine_logs").insert({
    app_id: app.id,
    cms_task_id: "cms-routine-1",
    week_number: 11,
    completed: true,
  });

  assert(
    duplicateRoutineError,
    "Routine logs should reject duplicate entries for the same app, task, and week.",
  );

  const bob = await signUp("bob");
  createdUserIds.push(bob.id);
  const bobClient = asUser(bob.accessToken);

  const { data: hiddenAppRows, error: hiddenAppError } = await bobClient
    .from("apps")
    .select("id")
    .eq("id", app.id);

  if (hiddenAppError) {
    throw new Error(`Cross-user app select failed unexpectedly: ${hiddenAppError.message}`);
  }

  assert(hiddenAppRows.length === 0, "RLS should hide apps owned by another user.");

  const { error: foreignChecklistError } = await bobClient.from("checklist_item_statuses").insert({
    app_id: app.id,
    cms_item_id: "cms-checklist-2",
    completed: true,
  });

  assert(
    foreignChecklistError,
    "RLS should block writing checklist statuses for another user's app.",
  );

  console.log("Local Supabase smoke test passed.");
} catch (error) {
  console.error("Local Supabase smoke test failed.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await Promise.allSettled(createdUserIds.map(cleanupUser));
}
