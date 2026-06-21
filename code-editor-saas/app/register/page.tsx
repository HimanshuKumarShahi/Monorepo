"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration fail ho gaya!");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
      <Card className="w-full max-w-md border-zinc-800 bg-[#0d1117] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-indigo-500 tracking-widest">
            REGISTER
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Naya account banao aur code likhna shuru karo.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Naam</label>
              <Input 
                type="text" 
                placeholder="Tera naam..." 
                className="border-zinc-700 bg-zinc-900 text-white focus:border-indigo-500"
                value={formData.name}
                // TypeScript fix: e ka type explicitly bataya
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <Input 
                type="email" 
                placeholder="hacker@example.com" 
                className="border-zinc-700 bg-zinc-900 text-white focus:border-indigo-500"
                value={formData.email}
                // TypeScript fix
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="border-zinc-700 bg-zinc-900 text-white focus:border-indigo-500"
                value={formData.password}
                // TypeScript fix
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all" 
              disabled={loading}
            >
              {loading ? "Account ban raha hai..." : "Submit Karo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}