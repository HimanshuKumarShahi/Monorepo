"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, FileCode, Trash2, Edit2, LogOut, Code, 
  Crown, Sparkles, FolderOpen, Calendar, HelpCircle, ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface FileItem {
  id: string;
  title: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState("");
  const [newFileLanguage, setNewFileLanguage] = useState("javascript");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState("");

  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchFiles();
      
      // Parse query parameters using browser APIs to avoid build-time suspense errors
      const params = new URLSearchParams(window.location.search);
      const checkoutStatus = params.get("checkout");
      if (checkoutStatus === "success" || checkoutStatus === "mock_success") {
        handleActivatePro();
      } else if (checkoutStatus === "cancel") {
        alert("Payment process cancelled.");
        router.replace("/dashboard");
      }
    }
  }, [status]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePro = async () => {
    try {
      const res = await fetch("/api/user/upgrade", {
        method: "POST",
      });

      if (res.ok) {
        alert("Upgrade successful! Welcome to CodeVerse PRO! 🚀");
        await update({ isPro: true });
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Error activating PRO tier:", err);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle.trim()) return;

    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newFileTitle,
          language: newFileLanguage,
          content: `// Welcome to ${newFileTitle}\n\n// Start writing code here...\n`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create file");
      }

      setNewFileTitle("");
      setShowCreateModal(false);
      fetchFiles();
      router.push(`/editor/${data.id}`);
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles(files.filter(file => file.id !== id));
      } else {
        alert("Failed to delete file");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartRename = (file: FileItem) => {
    setRenamingFileId(file.id);
    setRenamingTitle(file.title);
  };

  const handleSaveRename = async (id: string) => {
    if (!renamingTitle.trim()) return;

    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renamingTitle }),
      });

      if (res.ok) {
        setFiles(files.map(file => file.id === id ? { ...file, title: renamingTitle } : file));
        setRenamingFileId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgradeToPro = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Upgrade initialization failed.");
      }
    } catch (err: any) {
      alert(`Stripe error: ${err.message}`);
    } finally {
      setUpgrading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading && files.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-indigo-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="font-semibold tracking-wider animate-pulse">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  const isPro = (session?.user as any)?.isPro;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Code<span className="text-indigo-400">Verse</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-905 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-300 font-semibold">{session?.user?.name || "Developer"}</span>
              {isPro ? (
                <span className="ml-1.5 flex items-center gap-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-indigo-500/30">
                  <Crown className="h-2.5 w-2.5 text-indigo-400" /> PRO
                </span>
              ) : (
                <span className="ml-1.5 bg-zinc-800 text-zinc-400 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-zinc-700">
                  FREE
                </span>
              )}
            </div>

            <Button 
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="ghost" 
              className="text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Pro Banner */}
        {!isPro && (
          <div className="relative p-6 md:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-zinc-900/40 backdrop-blur-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-indigo-950/10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 text-[10px] font-bold tracking-wider text-indigo-300 uppercase">
                <Sparkles className="h-3 w-3" /> Limited Account
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Upgrade to CodeVerse Pro today</h2>
              <p className="text-zinc-450 text-sm md:text-base leading-relaxed">
                You are currently on the Free Plan which limits you to 3 code files. Upgrade to unlock unlimited storage, premium editor themes, and priority code execution.
              </p>
            </div>
            <Button 
              onClick={handleUpgradeToPro}
              disabled={upgrading}
              className="bg-indigo-650 hover:bg-indigo-650 text-white font-bold text-base px-6 py-5 rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all shrink-0 self-start md:self-auto"
            >
              {upgrading ? "Upgrading..." : "Unlock Pro ($10/mo)"}
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border-zinc-900 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold tracking-wider text-zinc-450 uppercase">Total Files</CardTitle>
              <FolderOpen className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">{files.length}</div>
              <p className="text-xs text-zinc-500 mt-1 font-semibold">
                {isPro ? "Unlimited slots available" : `${3 - files.length} free slot(s) remaining`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-900 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold tracking-wider text-zinc-450 uppercase">Subscription Tier</CardTitle>
              <Crown className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">{isPro ? "Pro Plan" : "Free Plan"}</div>
              <p className="text-xs text-zinc-500 mt-1 font-semibold">
                {isPro ? "Billed monthly ($10)" : "Basic tools active"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-900 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold tracking-wider text-zinc-455 uppercase">Session Active</CardTitle>
              <Calendar className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">Online</div>
              <p className="text-xs text-zinc-500 mt-1 font-semibold">Syncing to Docker Postgres</p>
            </CardContent>
          </Card>
        </div>

        {/* Files Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Your Code Files</h2>
            
            <Button 
              onClick={() => {
                if (!isPro && files.length >= 3) {
                  alert("Upgrade to Pro to create more than 3 files!");
                } else {
                  setShowCreateModal(true);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>New File</span>
            </Button>
          </div>

          {files.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-2xl p-16 text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-550">
                <FileCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">No files created yet</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto font-semibold">
                Create a new file to launch the editor workspace. You can choose JavaScript, HTML, Python, and more.
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-zinc-905 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold"
              >
                Create your first file
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card key={file.id} className="border-zinc-850 bg-[#0d1117]/85 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-850">
                          <FileCode className="h-5 w-5 text-indigo-400" />
                        </div>
                        {renamingFileId === file.id ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={renamingTitle}
                              onChange={(e) => setRenamingTitle(e.target.value)}
                              className="h-8 py-1 border-indigo-650 text-sm font-semibold max-w-[150px] bg-zinc-900 text-white focus:ring-1 focus:ring-indigo-500"
                              autoFocus
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveRename(file.id)}
                              className="h-8 bg-indigo-600 hover:bg-indigo-550 px-2.5 font-bold"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-bold text-white text-base tracking-wide group-hover:text-indigo-400 transition-colors">
                              {file.title}
                            </h3>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mt-0.5">
                              {file.language}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-4">
                    <p className="text-zinc-550 text-xs flex items-center gap-1.5 font-semibold">
                      <span>Updated: {new Date(file.updatedAt).toLocaleDateString()}</span>
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-850 pt-4 gap-2">
                      <Link 
                        href={`/editor/${file.id}`}
                        className="flex-1 text-center py-2 bg-zinc-900 hover:bg-indigo-600 border border-zinc-800 hover:border-indigo-650 text-zinc-350 hover:text-white font-bold text-xs rounded-lg transition-all"
                      >
                        Open Editor
                      </Link>

                      <Button 
                        onClick={() => handleStartRename(file)}
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 h-8 w-8"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button 
                        onClick={() => handleDeleteFile(file.id)}
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 h-8 w-8"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* File Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-zinc-800 bg-[#0d1117] shadow-2xl relative">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-indigo-400">Create New File</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Give your file a name and select its main coding language.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">File Name</label>
                  <Input 
                    type="text" 
                    placeholder="index.js, script.py, etc." 
                    className="border-zinc-700 bg-zinc-900 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={newFileTitle}
                    onChange={(e) => setNewFileTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Language</label>
                  <select 
                    className="w-full border border-zinc-700 bg-zinc-900 text-white rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={newFileLanguage}
                    onChange={(e) => setNewFileLanguage(e.target.value)}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="markdown">Markdown</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                {createError && (
                  <p className="text-red-500 text-xs font-semibold">{createError}</p>
                )}

                <div className="flex gap-3 justify-end pt-4">
                  <Button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={creating}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    {creating ? "Creating..." : "Create File"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
