import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Terminal, Code, Cpu, Sparkles, Cloud, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Premium Developer Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-all duration-350 shadow-lg shadow-indigo-600/30">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Code<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Verse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
            <Link href={session ? "/dashboard" : "/login"} className="hover:text-white transition-colors duration-200">Editor</Link>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-xs font-bold tracking-wide uppercase text-zinc-300 hover:text-white transition-all bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-705 px-4 py-2.5 rounded-lg">
                  Dashboard
                </Link>
                <Link href="/api/auth/signout" className="text-xs font-bold tracking-wide uppercase text-indigo-400 hover:text-indigo-300 transition-colors">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="text-xs font-bold tracking-wide uppercase text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-5 py-2.5 rounded-lg transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.02]">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-sm shadow-inner shadow-indigo-500/10">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>DevCraft Cloud Workspace is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-white">
          Write. Test. Compile. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Directly in the Cloud.
          </span>
        </h1>

        <p className="mt-8 text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
          CodeVerse is a gorgeous, feature-rich cloud IDE built for modern developers. Sync code to Docker PostgreSQL instantly, run scripts in browser sandboxes, and export shared workspaces.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4 z-10">
          <Link href={session ? "/dashboard" : "/register"} className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] flex items-center gap-2">
            <span>Start Coding Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold transition-all">
            Explore Features
          </Link>
        </div>

        {/* Glow behind the editor mockup */}
        <div className="absolute top-[60%] w-[700px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Mockup Editor Window */}
        <div className="mt-20 w-full max-w-5xl rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-2.5 shadow-2xl shadow-indigo-950/20 overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 px-3 text-xs text-zinc-500">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <span className="font-mono text-zinc-400 font-semibold tracking-wide flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5 text-indigo-400" /> main.js
            </span>
            <div className="w-12" />
          </div>
          <div className="p-5 text-left font-mono text-sm overflow-x-auto text-zinc-300">
            <pre className="leading-relaxed">
              <code className="text-zinc-500">// Welcome to CodeVerse Premium Cloud IDE</code>{"\n"}
              <code><span className="text-purple-400 font-bold">import</span> {"{ sandbox }"} <span className="text-purple-400 font-bold">from</span> <span className="text-green-300">"codeverse-runtime"</span>;</code>{"\n\n"}
              <code><span className="text-purple-400 font-bold">const</span> workspace = {"{"}</code>{"\n"}
              <code>  projectName: <span className="text-green-300">"DevCraft SaaS"</span>,</code>{"\n"}
              <code>  dockerDB: <span className="text-green-300">"PostgreSQL 15"</span>,</code>{"\n"}
              <code>  isPremiumActive: <span className="text-amber-400 font-semibold">true</span></code>{"\n"}
              <code>{"};"}</code>{"\n\n"}
              <code><span className="text-purple-400 font-bold">function</span> <span className="text-indigo-400 font-semibold">runExecution</span>() {"{"}</code>{"\n"}
              <code>  console.<span className="text-indigo-400">log</span>(<span className="text-green-300">`Launching ${"workspace.projectName"} workspace... 🚀`</span>);</code>{"\n"}
              <code>{"}"}</code>{"\n\n"}
              <code><span className="text-indigo-400 font-semibold">runExecution</span>();</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 border-t border-zinc-900/60 relative">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Supercharged SaaS Utilities</h2>
          <p className="text-zinc-400 text-base md:text-lg">Write, compile, and run code instantly in a fully functional developer environment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800/80 hover:bg-zinc-900/35 transition-all duration-300 group relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-12 w-12 rounded-xl bg-indigo-550/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Live Monaco Workspace</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Powered by VS Code's editor engine. Includes auto-completion, multi-cursor presets, bracket pairing, and custom theme layouts.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800/80 hover:bg-zinc-900/35 transition-all duration-300 group relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-12 w-12 rounded-xl bg-purple-550/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Client Code Sandbox</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Execute JavaScript instantly inside a secure browser sandboxed environment. Capture and output clean terminal console logs.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800/80 hover:bg-zinc-900/35 transition-all duration-300 group relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-12 w-12 rounded-xl bg-indigo-550/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Cloud className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Secure PostgreSQL Sync</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every save action updates your workspace database records securely inside your Docker PostgreSQL database.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-28 border-t border-zinc-900/65 relative">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Developer-Friendly Subscriptions</h2>
          <p className="text-zinc-400 text-base md:text-lg">Get started free, upgrade to unlock advanced cloud sharing and unlimited workspaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto z-10 relative">
          
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 relative group">
            <div>
              <span className="text-zinc-450 font-bold uppercase tracking-wider text-xs">Starter plan</span>
              <h3 className="text-2xl font-bold mt-2">Free Tier</h3>
              <p className="mt-4 text-zinc-400 text-sm">Perfect for experimenting or learning to code online.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-zinc-550 text-sm ml-2">/ month</span>
              </div>
              <ul className="mt-8 space-y-4.5 text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Up to 3 Active Files</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Monaco Editor Workspace</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>JavaScript Sandbox Runtime</span>
                </li>
              </ul>
            </div>
            <Link href={session ? "/dashboard" : "/register"} className="mt-10 w-full text-center py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-white font-bold rounded-xl transition-all">
              {session ? "Go to Dashboard" : "Sign Up Free"}
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex flex-col justify-between relative shadow-xl shadow-indigo-950/20 hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
              Most Popular
            </div>
            <div>
              <span className="text-indigo-400 font-bold uppercase tracking-wider text-xs">Premium Plan</span>
              <h3 className="text-2xl font-bold mt-2">Pro Tier</h3>
              <p className="mt-4 text-zinc-400 text-sm font-medium">Unlock full capabilities with cloud storage and workspace tools.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold">$10</span>
                <span className="text-indigo-400/80 text-sm ml-2">/ month</span>
              </div>
              <ul className="mt-8 space-y-4.5 text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited Code Files</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Advanced Themes & Custom Styles</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Cloud Shared Workspace Links</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Priority Run Engine Execution</span>
                </li>
              </ul>
            </div>
            <Link href={session ? "/dashboard" : "/register"} className="mt-10 w-full text-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-550 text-white font-extrabold rounded-xl transition-all shadow-md shadow-indigo-600/35 hover:scale-[1.01]">
              Upgrade Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-550 text-xs font-semibold">
          <span>&copy; {new Date().getFullYear()} CodeVerse SaaS Platform. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-350 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-350 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}