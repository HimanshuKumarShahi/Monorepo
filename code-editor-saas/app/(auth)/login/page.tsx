"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error(res.error || "Login fail ho gaya!");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error(err);
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
            LOGIN
          </CardTitle>
          <CardDescription className="text-zinc-400 font-medium">
            Apne account mein login karein aur code editor load karein.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Social Sign-In */}
          <Button
            onClick={handleGithubLogin}
            disabled={githubLoading}
            type="button"
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-600 transition-all py-5"
          >
            <GithubIcon className="h-4 w-4" />
            <span>{githubLoading ? "Redirecting to GitHub..." : "Sign In with GitHub"}</span>
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-550 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-350 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-500" /> Email
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                className="border-zinc-700 bg-zinc-900/85 text-white focus:border-indigo-500 placeholder:text-zinc-600 focus:ring-1 focus:ring-indigo-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-350 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-zinc-500" /> Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="border-zinc-700 bg-zinc-900/85 text-white focus:border-indigo-500 placeholder:text-zinc-600 focus:ring-1 focus:ring-indigo-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 py-6"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            Account nahi hai?{" "}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
              Naya account banao
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
