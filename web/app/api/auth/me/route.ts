import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token");
  
  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const apiUrl = process.env.API_URL ?? "http://localhost:4000";

  try {
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        "Cookie": `session-token=${sessionToken.value}`,
        "user-agent": "nextjs-web-app",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Authentication failed" }, { status: response.status });
    }

    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
