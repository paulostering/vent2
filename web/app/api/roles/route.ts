import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token");
  
  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}/api/roles`, {
      method: "GET",
      headers: {
        "Cookie": `session-token=${sessionToken.value}`,
        "user-agent": "nextjs-web-app",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch roles" }, 
        { status: response.status }
      );
    }

    const roles = await response.json();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Roles API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token");
  
  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `session-token=${sessionToken.value}`,
        "user-agent": "nextjs-web-app",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const role = await response.json();
    return NextResponse.json(role);
  } catch (error) {
    console.error("Create role API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
