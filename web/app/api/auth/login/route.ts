import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const redirect = String(form.get("redirect") || "");

  const apiUrl = process.env.API_URL ?? "http://localhost:4000";

  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { 
        "content-type": "application/json",
        "user-agent": "nextjs-web-app",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      // Return JSON error instead of redirect for better UX
      const errorData = await response.json().catch(() => ({ message: "Authentication failed" }));
      return NextResponse.json(
        { 
          error: response.status === 401 ? "Invalid email or password" : errorData.message || "Authentication failed",
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Determine redirect location
    let redirectLocation: string;
    
    if (redirect) {
      // Use the redirect parameter if provided
      redirectLocation = redirect;
    } else {
      // Default redirect based on user role
      redirectLocation = data.user?.type === "employee" ? "/admin" : "/customer";
    }

    // For successful login, return JSON with redirect info
    const res = NextResponse.json({
      success: true,
      user: data.user,
      redirectUrl: redirectLocation,
      message: "Login successful"
    });

    // Forward Set-Cookie header if present
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        error: "Server error. Please try again.",
        status: 500 
      },
      { status: 500 }
    );
  }
}
