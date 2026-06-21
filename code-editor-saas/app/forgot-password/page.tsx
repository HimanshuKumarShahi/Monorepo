"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mockLink, setMockLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setMockLink("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setMessage(data.message);
      if (data.mockLink) {
        setMockLink(data.mockLink);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold text-indigo-400 tracking-wider">
            FORGOT PASSWORD
          </CardTitle>
          <CardDescription className="text-zinc-400 font-medium">
            Apna register email id enter karein jisse password reset link send kiya jaa sake.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Email Address</label>
              <Input
                type="email"
                placeholder="email@example.com"
                className="border-zinc-700 bg-zinc-900/85 text-white focus:border-indigo-500 placeholder:text-zinc-600 focus:ring-1 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {message}
              </div>
            )}

            {mockLink && (
              <div className="rounded-md bg-indigo-500/10 p-3 border border-indigo-500/20 space-y-2">
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Developer Mock Reset Link:</p>
                <Link href={mockLink} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline break-all block">
                  {mockLink}
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 py-6"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            Pehle login try karein?{" "}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
