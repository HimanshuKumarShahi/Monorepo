import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email represents a required field!" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Email sent (if account exists)." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `${req.headers.get("origin")}/reset-password?token=${token}`;
    console.log("\n==================================================");
    console.log(`[MAILER MOCK] Password reset request for: ${email}`);
    console.log(`[MAILER MOCK] Reset Link: ${resetUrl}`);
    console.log("==================================================\n");

    return NextResponse.json({ 
      message: "Reset link generated! Mock link printed to developer logs.",
      mockLink: resetUrl
    }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Server error during password reset request" }, { status: 500 });
  }
}
