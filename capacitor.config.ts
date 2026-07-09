import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.socially.app",
  appName: "social-media",
  webDir: "public-capacitor",

  server: {
    url: "https://social-media-app-two-lemon.vercel.app",
    cleartext: false,
  },
};

export default config;
