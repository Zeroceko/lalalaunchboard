import {
  DEFAULT_LOCALE,
  type Locale
} from "@/lib/i18n/config";

const authMessagesByLocale = {
  tr: {
    emailInvalid: "Geçerli bir e-posta adresi girin",
    passwordTooShort: "Şifre en az 8 karakter olmalı",
    passwordsMismatch: "Şifreler eşleşmiyor",
    invalidCredentials: "E-posta veya şifre hatalı",
    duplicateEmail: "Bu e-posta adresi zaten kullanımda",
    captchaRequired: "Lütfen CAPTCHA doğrulamasını tamamlayın",
    captchaUnavailable: "Kayıt için hCaptcha yapılandırması gerekiyor",
    authUnavailable: "Kimlik doğrulama yapılandırması henüz tamamlanmadı",
    genericError: "Bir hata oluştu, lütfen tekrar deneyin"
  },
  en: {
    emailInvalid: "Enter a valid email address",
    passwordTooShort: "Password must be at least 8 characters",
    passwordsMismatch: "Passwords do not match",
    invalidCredentials: "Email or password is incorrect",
    duplicateEmail: "This email address is already in use",
    captchaRequired: "Please complete the CAPTCHA verification",
    captchaUnavailable: "hCaptcha must be configured for sign-up",
    authUnavailable: "Authentication is not configured yet",
    genericError: "Something went wrong. Please try again"
  }
} as const satisfies Record<
  Locale,
  {
    emailInvalid: string;
    passwordTooShort: string;
    passwordsMismatch: string;
    invalidCredentials: string;
    duplicateEmail: string;
    captchaRequired: string;
    captchaUnavailable: string;
    authUnavailable: string;
    genericError: string;
  }
>;

export function getAuthMessages(locale: Locale = DEFAULT_LOCALE) {
  return authMessagesByLocale[locale];
}

export const authMessages = getAuthMessages();
