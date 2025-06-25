import { cookies } from "next/headers";
import { isDomUsable } from "../is/is-dom-usable";
import { TOKEN_KEY } from "./constants";
import type { Nullable } from "../types";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 获取当前应用认证信息
 */
export const tryAuthenticate = async (): Promise<Nullable<string>> => {
  if (isDomUsable()) {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  return (await cookies()).get(TOKEN_KEY)?.value ?? null;
};

/**
 * 中间介
 */
export const middleware = (request: NextRequest) => {
  const isAuthenticated = request.nextUrl.searchParams.has(TOKEN_KEY);

  if (!isAuthenticated) return;

  const _authenticated = request.nextUrl.searchParams.get(TOKEN_KEY);
  const url = new URL(request.url);
  url.searchParams.delete(TOKEN_KEY);
  const response = NextResponse.redirect(url);

  if (_authenticated) {
    response.cookies.set({
      httpOnly: true,
      name: TOKEN_KEY,
      value: _authenticated,
    });
  }

  return response;
};
