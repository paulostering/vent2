import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SUB = "admin.";
const CUSTOMER_SUB = "customer.";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const sessionToken = req.cookies.get("session-token");

  // Allow root login page to pass through
  if (url.pathname === "/") return NextResponse.next();

  // Allow API routes to pass through (they handle their own auth)
  if (url.pathname.startsWith("/api")) return NextResponse.next();

  // Check if accessing protected routes
  const isAdminRoute = url.pathname.startsWith("/admin") || host.startsWith(ADMIN_SUB);
  const isCustomerRoute = url.pathname.startsWith("/customer") || host.startsWith(CUSTOMER_SUB);
  
  // If accessing protected routes without session token, redirect to login
  if ((isAdminRoute || isCustomerRoute) && !sessionToken) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("redirect", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rewrite admin subdomain to /admin routes
  if (host.startsWith(ADMIN_SUB) && !url.pathname.startsWith("/admin")) {
    const newUrl = new URL(req.url);
    newUrl.pathname = "/admin" + url.pathname;
    return NextResponse.rewrite(newUrl);
  }

  // Rewrite customer subdomain to /customer routes
  if (host.startsWith(CUSTOMER_SUB) && !url.pathname.startsWith("/customer")) {
    const newUrl = new URL(req.url);
    newUrl.pathname = "/customer" + url.pathname;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|api).*)"],
};
