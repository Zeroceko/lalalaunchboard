import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const result = {};

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    result[key] = value;
  }

  return result;
}

function isTruthy(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getSupabasePublicKey(env) {
  return (
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

function formatStatus(ok, label, detail) {
  return `${ok ? "[ok]" : "[missing]"} ${label}${detail ? ` - ${detail}` : ""}`;
}

function isLocalUrl(value) {
  if (!isTruthy(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return true;
  }
}

const fileEnv = loadEnvFile(envPath);
const env = {
  ...fileEnv,
  ...process.env,
};

const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabasePublicKey = getSupabasePublicKey(env);
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || "";
const accessToken = env.SUPABASE_ACCESS_TOKEN || "";
const hcaptchaSiteKey = env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "";
const hcaptchaSecretKey = env.HCAPTCHA_SECRET_KEY || "";
const contentfulSpaceId = env.CONTENTFUL_SPACE_ID || "";
const contentfulDeliveryToken = env.CONTENTFUL_DELIVERY_TOKEN || "";
const contentfulEnvironment = env.CONTENTFUL_ENVIRONMENT || "master";

const hostedCutoverReady =
  isTruthy(accessToken) && isTruthy(supabaseUrl) && isTruthy(supabasePublicKey);
const hostedSmokeReady = hostedCutoverReady && isTruthy(serviceRoleKey);
const publicLaunchReady =
  hostedCutoverReady &&
  hostedSmokeReady &&
  !isLocalUrl(appUrl) &&
  isTruthy(hcaptchaSiteKey) &&
  isTruthy(hcaptchaSecretKey);

console.log("Lalalaunchboard go-live readiness");
console.log("");
console.log(`Env file: ${fs.existsSync(envPath) ? envPath : "missing .env.local"}`);
console.log(
  `Supabase target: ${
    isTruthy(supabaseUrl) ? supabaseUrl : "missing NEXT_PUBLIC_SUPABASE_URL"
  }`,
);
console.log(`App URL: ${appUrl}`);
console.log("");

console.log("Hosted DB cutover");
console.log(
  formatStatus(isTruthy(accessToken), "SUPABASE_ACCESS_TOKEN", "required for supabase link/db push"),
);
console.log(formatStatus(isTruthy(supabaseUrl), "NEXT_PUBLIC_SUPABASE_URL"));
console.log(
  formatStatus(
    isTruthy(supabasePublicKey),
    "Supabase public key",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or DEFAULT or ANON",
  ),
);
console.log(
  formatStatus(
    hostedCutoverReady,
    "Hosted cutover ready",
    hostedCutoverReady
      ? "link + db push can be attempted"
      : "set the missing values above first",
  ),
);
console.log("");

console.log("Hosted smoke");
console.log(
  formatStatus(
    isTruthy(serviceRoleKey),
    "SUPABASE_SERVICE_ROLE_KEY",
    "required for npm run smoke:db:hosted",
  ),
);
console.log(
  formatStatus(
    hostedSmokeReady,
    "Hosted smoke ready",
    hostedSmokeReady
      ? "smoke script can run against the hosted project"
      : "service role key is still missing",
  ),
);
console.log("");

console.log("Public launch");
console.log(
  formatStatus(
    !isLocalUrl(appUrl),
    "NEXT_PUBLIC_APP_URL",
    !isLocalUrl(appUrl) ? "external URL looks good" : "still points to localhost",
  ),
);
console.log(
  formatStatus(isTruthy(hcaptchaSiteKey), "NEXT_PUBLIC_HCAPTCHA_SITE_KEY", "required for signup UI"),
);
console.log(
  formatStatus(isTruthy(hcaptchaSecretKey), "HCAPTCHA_SECRET_KEY", "required for signup API"),
);
console.log(
  formatStatus(
    publicLaunchReady,
    "Public launch ready",
    publicLaunchReady
      ? "hosted DB, smoke, and signup prerequisites are all present"
      : "hosted cutover, app URL, or hCaptcha setup is still incomplete",
  ),
);
console.log("");

console.log("Live CMS (optional)");
console.log(
  formatStatus(
    isTruthy(contentfulSpaceId),
    "CONTENTFUL_SPACE_ID",
    isTruthy(contentfulSpaceId) ? `environment ${contentfulEnvironment}` : "fallback content remains active",
  ),
);
console.log(
  formatStatus(
    isTruthy(contentfulDeliveryToken),
    "CONTENTFUL_DELIVERY_TOKEN",
    isTruthy(contentfulDeliveryToken) ? "live CMS can be queried" : "fallback content remains active",
  ),
);
console.log("");

console.log("Suggested sequence");
console.log("1. Add SUPABASE_ACCESS_TOKEN or run `npx supabase login`.");
console.log("2. Run `npx supabase link --project-ref ivklsffslobgjiicziuj`.");
console.log("3. Run `npx supabase db push`.");
console.log("4. Export hosted smoke env vars and run `npm run smoke:db:hosted`.");
console.log("5. Set NEXT_PUBLIC_APP_URL to the real domain and add hCaptcha keys.");

if (!publicLaunchReady) {
  process.exitCode = 1;
}
