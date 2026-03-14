import type { App } from "@/types";

import { getCountdownState } from "@/lib/progress";

export function formatPlatformLabel(platform: App["platform"]) {
  switch (platform) {
    case "ios":
      return "iOS";
    case "android":
      return "Android";
    case "web":
      return "Web";
    default:
      return platform;
  }
}

export function formatLaunchDate(launchDate: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long"
  }).format(new Date(`${launchDate}T00:00:00.000Z`));
}

export function getLaunchCountdown(launchDate: string) {
  return getCountdownState(launchDate).label;
}
