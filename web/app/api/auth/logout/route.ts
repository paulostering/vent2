import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL ?? "http://localhost:4000";

  try {
    // Call the NestJS logout endpoint
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      headers: { 
        "user-agent": "nextjs-web-app",
      },
      credentials: "include",
    });

    // Create response and clear the session cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("session-token");
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Even if the API call fails, clear the cookie and redirect
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("session-token");
    return response;
  }
}

export async function GET(request: Request) {
  // Allow GET requests for easier logout links
  return POST(request);
}
