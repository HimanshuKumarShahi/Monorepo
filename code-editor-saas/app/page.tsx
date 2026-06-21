import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Terminal, Code, Cpu, Sparkles, Cloud, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-105 transition-all shadow-md shadow-indigo-600/30">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Code<span className="text-indigo-400">Verse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href={session ? "/dashboard" : "/login"} className="hover:text-white transition-colors">Editor</Link>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-zinc-300 hover:text-white transition-all bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-800">
                  Dashboard
                </Link>
                <Link href="/api/auth/signout" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-sm">
          <Sparkles className="h-3 w-3" />
          <span>CodeVerse - Next-Gen Online IDE is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Write. Test. Execute. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            All in your Browser.
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          CodeVerse is a gorgeous, ultra-fast online code editor built for developers. Save files securely in the cloud, run scripts instantly, and work in a beautiful modern IDE.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={session ? "/dashboard" : "/register"} className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-600/20 hover:scale-[1.02]">
            Start Coding Free
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-350 hover:text-white font-semibold transition-all">
            See Features
          </Link>
        </div>

        {/* Mockup Editor Window */}
        <div className="mt-16 w-full max-w-5xl rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-2 shadow-2xl shadow-indigo-600/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 px-3 text-xs text-zinc-500">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-zinc-400">welcome.js</span>
            <div className="w-12" />
          </div>
          <div className="p-4 text-left font-mono text-sm overflow-x-auto text-zinc-300">
            <pre>
              <code className="text-zinc-500">// Welcome to CodeVerse Editor</code>{"\n"}
              <code><span className="text-purple-400">const</span> developer = {"{"}</code>{"\n"}
              <code>  name: <span className="text-green-300">"Hacker"</span>,</code>{"\n"}
              <code>  skills: [<span className="text-green-300">"Next.js"</span>, <span className="text-green-300">"Prisma"</span>, <span className="text-green-300">"PostgreSQL"</span>],</code>{"\n"}
              <code>  isProductive: <span className="text-amber-400">true</span></code>{"\n"}
              <code>{"};"}</code>{"\n\n"}
              <code><span className="text-purple-400">function</span> <span className="text-indigo-400">code</span>() {"{"}</code>{"\n"}
              <code>  console.<span className="text-indigo-400">log</span>(<span className="text-green-300">`Coding in ${"developer.name"}... 🚀`</span>);</code>{"\n"}
              <code>{"}"}</code>{"\n\n"}
              <code><span className="text-indigo-400">code</span>();</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Supercharged features for creators</h2>
          <p className="mt-4 text-zinc-400">Everything you need to write and test code securely without any local environment setup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Live Monaco Editor</h3>
            <p className="text-zinc-400 leading-relaxed">Powered by VS Code's editor engine, featuring auto-complete, multi-cursor editing, and rich syntax highlights.</p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Instant Execution</h3>
            <p className="text-zinc-400 leading-relaxed">Run your scripts inside a client-side execution sandbox and view clean terminal log outputs instantly.</p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Cloud className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Docker DB Connection</h3>
            <p className="text-zinc-400 leading-relaxed">All code documents and workspace configurations are pushed securely to your dockerized PostgreSQL instance.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Simple, Developer-Friendly Pricing</h2>
          <p className="mt-4 text-zinc-400">Start free and upgrade as your projects scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col justify-between">
            <div>
              <span className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Starter Tier</span>
              <h3 className="text-2xl font-bold mt-2">Free Plan</h3>
              <p className="mt-4 text-zinc-400 text-sm">Perfect for hobbyists learning to code or experimenting with new projects.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-zinc-500 text-sm ml-2">/ forever</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Up to 3 Active Code Files</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Monaco Editor Workspace</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Javascript Sandboxed Execution</span>
                </li>
              </ul>
            </div>
            <Link href={session ? "/dashboard" : "/register"} className="mt-8 w-full text-center py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all">
              {session ? "Go to Dashboard" : "Sign Up Free"}
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex flex-col justify-between relative shadow-xl shadow-indigo-500/5">
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
              Popular
            </div>
            <div>
              <span className="text-indigo-400 font-bold uppercase tracking-wider text-xs">Premium Tier</span>
              <h3 className="text-2xl font-bold mt-2">Pro Plan</h3>
              <p className="mt-4 text-zinc-400 text-sm">Unlock the full power of CodeVerse with unlimited capabilities and tools.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold">$10</span>
                <span className="text-zinc-500 text-sm ml-2">/ month</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited Code Files</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Advanced Editor Themes & Customizations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Cloud Data Export & Sharing Link</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Priority Sandbox Compute Support</span>
                </li>
              </ul>
            </div>
            <Link href={session ? "/dashboard" : "/register"} className="mt-8 w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30">
              Upgrade Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-550 text-xs">
          <span>&copy; {new Date().getFullYear()} CodeVerse SaaS. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}