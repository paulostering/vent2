import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionToken = request.cookies.get("session-token");
  
  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/roles/${params.id}`, {
      method: "PATCH",
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
    console.error("Update role API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionToken = request.cookies.get("session-token");
  
  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}/api/roles/${params.id}`, {
      method: "DELETE",
      headers: {
        "Cookie": `session-token=${sessionToken.value}`,
        "user-agent": "nextjs-web-app",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete role API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
