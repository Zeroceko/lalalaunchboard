import { z } from "zod";

const appUrlSchema = z.string().url().default("http://localhost:3000");

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional()
});

function getSupabasePublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const contentfulEnvSchema = z.object({
  CONTENTFUL_SPACE_ID: z.string().min(1),
  CONTENTFUL_DELIVERY_TOKEN: z.string().min(1),
  CONTENTFUL_PREVIEW_TOKEN: z.string().min(1).optional(),
  CONTENTFUL_ENVIRONMENT: z.string().default("master"),
  CONTENTFUL_REVALIDATE_SECRET: z.string().min(1).optional()
});

export function getAppUrl() {
  return appUrlSchema.parse(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  );
}

export function getSupabaseBrowserEnv() {
  return supabaseEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_KEY: getSupabasePublicKey()
  });
}

export function getSupabaseServerEnv() {
  return supabaseEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_KEY: getSupabasePublicKey(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
  });
}

export function getContentfulEnv() {
  return contentfulEnvSchema.parse({
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_TOKEN: process.env.CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.CONTENTFUL_PREVIEW_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
    CONTENTFUL_REVALIDATE_SECRET: process.env.CONTENTFUL_REVALIDATE_SECRET
  });
}

export function hasContentfulEnv() {
  return Boolean(
    process.env.CONTENTFUL_SPACE_ID &&
      process.env.CONTENTFUL_DELIVERY_TOKEN
  );
}

export function getContentfulRevalidateSecret() {
  return process.env.CONTENTFUL_REVALIDATE_SECRET?.trim() || null;
}

export function getHcaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim() || null;
}

export function getHcaptchaSecretKey() {
  return process.env.HCAPTCHA_SECRET_KEY?.trim() || null;
}

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      getSupabasePublicKey()
  );
}

export function hasSignupCaptchaEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && process.env.HCAPTCHA_SECRET_KEY
  );
}
