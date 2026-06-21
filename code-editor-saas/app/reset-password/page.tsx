"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!token) {
      setError("Reset token is missing from the URL!");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-extrabold text-indigo-400 tracking-wider">
          RESET PASSWORD
        </CardTitle>
        <CardDescription className="text-zinc-400 font-medium">
          Naya password enter karein jisse account secure kiya jaa sake.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!token ? (
          <div className="rounded-md bg-red-500/10 p-4 text-sm font-semibold text-red-400 border border-red-500/20 text-center">
            Invalid reset request: Token missing. Please check your reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="border-zinc-700 bg-zinc-900/85 text-white focus:border-indigo-500 placeholder:text-zinc-650 focus:ring-1 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="border-zinc-700 bg-zinc-900/85 text-white focus:border-indigo-500 placeholder:text-zinc-650 focus:ring-1 focus:ring-indigo-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-md bg-emerald-500/10 p-3 text-sm font-medium text-emerald-400 border border-emerald-500/20">
                {message} Redirecting to login...
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 py-6"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />

      <Suspense fallback={
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="font-semibold tracking-wider">Loading reset workspace...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
