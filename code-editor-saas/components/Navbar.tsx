"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Code, Crown, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();
  const isPro = (session?.user as any)?.isPro;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-md shadow-indigo-600/30">
            <Code className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Code<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Verse</span>
          </span>
        </Link>

        {/* Action Controls & Dropdown */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              
              {/* Subscription Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-350 font-semibold hidden sm:inline">
                  {session.user?.name || "Developer"}
                </span>
                {isPro ? (
                  <span className="flex items-center gap-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-indigo-500/30">
                    <Crown className="h-2.5 w-2.5" /> PRO
                  </span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-400 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-zinc-700">
                    FREE
                  </span>
                )}
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-xl border border-zinc-850 hover:bg-zinc-900 bg-zinc-950 p-0 overflow-hidden flex items-center justify-center text-zinc-400 hover:text-white">
                    <User className="h-4.5 w-4.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-zinc-850 bg-zinc-900 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-white">{session.user?.name || "Developer"}</p>
                      <p className="text-xs leading-none text-zinc-450 font-semibold">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer w-full">
                      <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-xs font-bold tracking-wide uppercase text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20">
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
