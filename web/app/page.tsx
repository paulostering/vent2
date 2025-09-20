'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const urlError = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      if (redirect) {
        formData.append("redirect", redirect);
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful login
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          setError("Login successful but redirect failed");
        }
      } else {
        // Handle error response
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
          {redirect && (
            <p className="text-sm text-amber-600">
              Please sign in to continue to your requested page.
            </p>
          )}
        </div>
        <form
          className="space-y-3"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Demo credentials:</p>
          <div className="space-y-1">
            <p><strong>Admin:</strong> admin@example.com / password123</p>
            <p><strong>Customer:</strong> customer@example.com / password123</p>
          </div>
        </div>
      </div>
    </main>
  );
}
