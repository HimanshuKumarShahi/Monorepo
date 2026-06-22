"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import EditorWorkspace from "@/components/EditorWorkspace";

export default function EditorRoutePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="h-screen w-screen bg-zinc-950 flex flex-col overflow-hidden text-white selection:bg-indigo-500/30 selection:text-indigo-205">
      <Navbar />
      <EditorWorkspace fileId={id} />
    </div>
  );
}
