"use client";

import { getUserTest } from "@/lib/api";
import { getCookie } from "cookies-next/client";

const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export function useApi() {
  const token = getCookie(AUTH_COOKIE_NAME) as string;

  return {
    getUserTest: () => getUserTest(token),
  };
}
