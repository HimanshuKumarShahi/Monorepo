import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
      
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-blue-500">📝</span> DocSpace
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition">
              Log in
            </Link>
            <Button className="bg-white text-black hover:bg-zinc-200 text-sm h-9 px-4">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
          Now with Turbo-speed Sync
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
          Your thoughts, organized in a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Modern Workspace</span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Create, edit, and manage your text documents seamlessly. Built for developers and writers who prefer speed, markdown, and zero distractions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base">
            Create New Document
          </Button>
          <Button size="lg" variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 h-12 px-8 text-base">
            View GitHub Repo
          </Button>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 mt-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 text-xl">⚡</div>
            <h3 className="text-lg font-bold mb-2">Blazing Fast</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Powered by Next.js and Turborepo. Experience zero lag whether you are writing or navigating folders.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 text-xl">🔒</div>
            <h3 className="text-lg font-bold mb-2">Secure Storage</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Your data is safely stored in a local PostgreSQL database using robust Docker containers.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 text-xl">📁</div>
            <h3 className="text-lg font-bold mb-2">File Management</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Create nested folders, organize your notes, and find what you need instantly with our smart UI.</p>
          </div>
        </div>
      </section>

    </div>
  );
}