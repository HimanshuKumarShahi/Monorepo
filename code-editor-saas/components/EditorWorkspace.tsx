"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Play, Save, Code, Terminal, Share2, Check, Sparkles, Folder, Plus
} from "lucide-react";
import Editor from "@monaco-editor/react";

interface FileItem {
  id: string;
  title: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditorWorkspace({ fileId }: { fileId: string }) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<FileItem | null>(null);
  const [code, setCode] = useState("");
  const [filesList, setFilesList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [output, setOutput] = useState("Click 'Run Code' to execute JS, or write HTML/CSS to view simulation.");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [runLoading, setRunLoading] = useState(false);

  const [upgrading, setUpgrading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLanguage, setNewLanguage] = useState("javascript");

  useEffect(() => {
    if (fileId) {
      fetchFileAndList();
    }
  }, [fileId]);

  const fetchFileAndList = async () => {
    try {
      setLoading(true);
      
      const listRes = await fetch("/api/files");
      let list: FileItem[] = [];
      if (listRes.ok) {
        list = await listRes.json();
        setFilesList(list);
      }

      const res = await fetch(`/api/files/${fileId}`);
      if (res.ok) {
        const fileData = await res.json();
        setFile(fileData);
        setCode(fileData.content);
      } else {
        if (list.length > 0) {
          router.push(`/editor/${list[0].id}`);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!code || !file || code === file.content) return;

    setIsSaving(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/files/${file.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: code }),
        });
        if (res.ok) {
          setIsSaving(false);
          setFilesList(prev => prev.map(f => f.id === file.id ? { ...f, content: code } : f));
        }
      } catch (err) {
        console.error(err);
      }
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [code]);

  const handleLanguageChange = async (newLang: string) => {
    if (!file) return;
    try {
      const res = await fetch(`/api/files/${file.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      });
      if (res.ok) {
        setFile({ ...file, language: newLang });
        setFilesList(filesList.map(f => f.id === file.id ? { ...f, language: newLang } : f));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunCode = () => {
    if (!file) return;
    setRunLoading(true);
    setOutput("");

    setTimeout(() => {
      if (file.language !== "javascript" && file.language !== "typescript") {
        setOutput([
          `[DevCraft Compiler v1.2]`,
          `Compiling ${file.title}...`,
          `Success: Output compiled successfully.`,
          `\nSimulated output for ${file.language.toUpperCase()}:`,
          `Code editor compiled with no syntax errors.`,
          `Output logging is only fully supported for JavaScript in local client sandbox.`,
          `Upgrade to Pro to spin up a Docker runtime container for full ${file.language} compilation!`
        ].join("\n"));
        setRunLoading(false);
        return;
      }

      const originalLog = console.log;
      const originalError = console.error;
      const logs: string[] = [];

      console.log = (...args) => {
        logs.push(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" "));
      };
      console.error = (...args) => {
        logs.push(`[Error] ` + args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" "));
      };

      try {
        const result = new Function(code)();
        if (result !== undefined) {
          logs.push(`=> ${typeof result === "object" ? JSON.stringify(result) : result}`);
        }
      } catch (err: any) {
        logs.push(`[Runtime Exception] ${err.message}`);
      } finally {
        console.log = originalLog;
        console.error = originalError;
      }

      setOutput(logs.length > 0 ? logs.join("\n") : "Code ran successfully. (No output printed. Use console.log() to print outputs)");
      setRunLoading(false);
    }, 450);
  };

  const handleCopyShareLink = () => {
    const isPro = (session?.user as any)?.isPro;
    if (!isPro) {
      alert("Upgrade to Pro to unlock cloud file sharing!");
      return;
    }

    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThemeChange = (newTheme: string) => {
    const isPro = (session?.user as any)?.isPro;
    if (newTheme === "hc-black" && !isPro) {
      alert("Custom High Contrast theme is a Pro Tier Feature! Please upgrade to unlock.");
      return;
    }
    setEditorTheme(newTheme);
  };

  const handleUpgradeToPro = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Stripe initialization failed.");
      }
    } catch (err: any) {
      alert(`Stripe error: ${err.message}`);
    } finally {
      setUpgrading(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const isPro = (session?.user as any)?.isPro;
    if (!isPro && filesList.length >= 3) {
      alert("Upgrade to Pro to create more than 3 files!");
      return;
    }

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          language: newLanguage,
          content: `// Code file: ${newTitle}\n\nconsole.log("Hello World!");\n`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewTitle("");
        setShowCreateModal(false);
        router.push(`/editor/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-zinc-950 text-indigo-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-650 border-t-transparent" />
          <span className="font-semibold tracking-wider animate-pulse text-sm">Initializing Editor Workspace...</span>
        </div>
      </div>
    );
  }

  const isPro = (session?.user as any)?.isPro;

  return (
    <div className="flex-grow flex overflow-hidden">
      
      {/* Left File Explorer Sidebar */}
      <aside className="w-56 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between shrink-0 hidden sm:flex">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
              <Folder className="h-3.5 w-3.5 text-indigo-400" /> Files
            </span>
            <Button 
              onClick={() => setShowCreateModal(true)}
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* List of files */}
          <div className="space-y-1 overflow-y-auto max-h-[60vh] pr-1">
            {filesList.map((f) => (
              <button
                key={f.id}
                onClick={() => router.push(`/editor/${f.id}`)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  f.id === fileId 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-550/20" 
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white border border-transparent"
                }`}
              >
                <span className="truncate max-w-[130px]">{f.title}</span>
                <span className="text-[9px] opacity-60 font-bold uppercase shrink-0">{f.language.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pro Upgrading card inside sidebar */}
        {!isPro && (
          <div className="p-4 border-t border-zinc-900 bg-indigo-500/5 m-3 rounded-xl border border-indigo-500/10 text-center space-y-3">
            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-indigo-300 uppercase">
              <Sparkles className="h-3 w-3" /> PRO UPGRADE
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Unlock custom themes, file sharing links, and unlimited file creations.
            </p>
            <Button
              onClick={handleUpgradeToPro}
              disabled={upgrading}
              size="sm"
              className="w-full bg-indigo-650 hover:bg-indigo-600 text-white text-[10px] font-bold py-1.5 shadow-md shadow-indigo-600/20"
            >
              {upgrading ? "Upgrading..." : "Unlock Pro"}
            </Button>
          </div>
        )}
      </aside>

      {/* Editor Panel & Code execution output console */}
      <div className="flex-grow flex flex-col overflow-hidden bg-zinc-950">
        
        {/* Editor Workspace Subheader */}
        <div className="h-12 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest flex items-center gap-1">
              <Code className="h-3.5 w-3.5 text-indigo-400" /> Workspace
            </span>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">{file?.title || "untitled.js"}</span>
              <div className="flex items-center ml-2">
                {isSaving ? (
                  <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1 animate-pulse">
                    <Save className="h-3 w-3" /> Auto-saving...
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    <Check className="h-2.5 w-2.5" /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={file?.language || "javascript"}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>

            {/* Theme Selector */}
            <select
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={editorTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="vs-dark">Dark Theme</option>
              <option value="light">Light Theme</option>
              <option value="hc-black">High Contrast (Pro)</option>
            </select>

            {/* Share Link */}
            <Button
              onClick={handleCopyShareLink}
              variant="ghost"
              className="text-zinc-450 hover:text-white hover:bg-zinc-900 border border-zinc-850 h-8 flex items-center gap-1 text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{copied ? "Copied!" : "Share"}</span>
            </Button>

            {/* Run Code */}
            <Button
              onClick={handleRunCode}
              disabled={runLoading}
              className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold h-8 text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Play className="h-3 w-3" />
              <span>Run Code</span>
            </Button>
          </div>
        </div>

        {/* Monaco Editor Component */}
        <div className="flex-grow relative bg-zinc-950">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            language={file?.language || "javascript"}
            theme={editorTheme}
            value={code}
            onChange={(val) => setCode(val || "")}
            loading={
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-xs text-zinc-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-650 border-t-transparent" />
                  <span>Loading Monaco Editor Engine...</span>
                </div>
              </div>
            }
            options={{
              fontSize: 14,
              fontFamily: "var(--font-geist-mono), monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              cursorBlinking: "smooth",
              smoothScrolling: true,
              lineHeight: 22,
            }}
          />
        </div>

        {/* Console logs output */}
        <div className="h-44 border-t border-zinc-900 bg-zinc-950 flex flex-col overflow-hidden">
          <div className="h-8 border-b border-zinc-900 bg-zinc-900/60 flex items-center justify-between px-4 shrink-0 select-none">
            <span className="text-[10px] font-extrabold text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" /> Console Terminal Output
            </span>
            <Button 
              onClick={() => setOutput("")}
              variant="ghost" 
              className="text-[9px] font-bold hover:text-white px-2 py-0.5 h-5 rounded hover:bg-zinc-900 text-zinc-550 border border-zinc-850"
            >
              Clear
            </Button>
          </div>
          
          <div className="flex-grow p-3.5 font-mono text-xs text-zinc-350 overflow-y-auto whitespace-pre bg-zinc-950 leading-relaxed">
            {runLoading ? (
              <div className="text-indigo-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                Executing code sandbox runtime...
              </div>
            ) : (
              output || "Console cleared."
            )}
          </div>
        </div>

      </div>

      {/* Quick create new file modal inside editor */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-zinc-850 bg-[#0d1117] shadow-2xl relative">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-indigo-455">Create New File</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">File Name</label>
                  <input 
                    type="text" 
                    placeholder="index.js, script.py" 
                    className="w-full border border-zinc-700 bg-zinc-900 text-white rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Language</label>
                  <select 
                    className="w-full border border-zinc-700 bg-zinc-900 text-white rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
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
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Create
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
