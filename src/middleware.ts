import { NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/constants";
import type { NextRequest } from "next/server";

function getLocale(request: NextRequest) {
  const cookie = request.cookies.get("locale")?.value;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) return cookie;
  const accept = request.headers.get("accept-language") || "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if ((LOCALES as readonly string[]).includes(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
