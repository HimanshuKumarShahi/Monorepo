import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { id } = await params;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ message: "File not found!" }, { status: 404 });
    }

    if (file.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized file access!" }, { status: 403 });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error("Fetch single file error:", error);
    return NextResponse.json({ message: "Server error while fetching file" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, language } = body;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ message: "File not found!" }, { status: 404 });
    }

    if (file.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized file write!" }, { status: 403 });
    }

    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(language && { language }),
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("Update file error:", error);
    return NextResponse.json({ message: "Server error while updating file" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { id } = await params;

    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ message: "File not found!" }, { status: 404 });
    }

    if (file.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized file delete!" }, { status: 403 });
    }

    await prisma.file.delete({
      where: { id },
    });

    return NextResponse.json({ message: "File deleted successfully!" });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json({ message: "Server error while deleting file" }, { status: 500 });
  }
}
