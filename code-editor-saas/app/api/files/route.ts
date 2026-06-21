import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const files = await prisma.file.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("Fetch files error:", error);
    return NextResponse.json({ message: "Server error while fetching files" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const body = await req.json();
    const { title, language, content } = body;

    if (!title) {
      return NextResponse.json({ message: "File name is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    // Get fresh user detail from DB to check current pro status
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    // Limit files for non-pro users to 3
    if (!user.isPro) {
      const fileCount = await prisma.file.count({
        where: { userId },
      });

      if (fileCount >= 3) {
        return NextResponse.json({
          message: "Free tier limit reached! Maximum 3 files allowed. Upgrade to Pro for unlimited files.",
          limitReached: true
        }, { status: 403 });
      }
    }

    const newFile = await prisma.file.create({
      data: {
        title,
        language: language || "javascript",
        content: content || "",
        userId,
      },
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error("Create file error:", error);
    return NextResponse.json({ message: "Server error while creating file" }, { status: 500 });
  }
}
