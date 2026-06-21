import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isPro: true },
    });

    return NextResponse.json({
      message: "Congratulations! You have upgraded to CodeVerse Pro.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPro: updatedUser.isPro,
      }
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.json({ message: "Server error during upgrade" }, { status: 500 });
  }
}
