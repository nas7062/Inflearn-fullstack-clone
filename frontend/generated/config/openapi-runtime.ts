import { CreateClientConfig } from "../openapi-client/client";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseURL: API_URL,

  async auth() {
    return getCookie(AUTH_COOKIE_NAME, { cookies });
  },
});
