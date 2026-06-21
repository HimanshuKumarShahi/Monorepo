import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Saari fields zaroori hain!" }, { status: 400 });
    }

    // Check karo ki user pehle se exist toh nahi karta
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email pehle se registered hai!" }, { status: 400 });
    }

    // Password ko hash karo (Security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database mein naya user create karo
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User successfully register ho gaya!", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Server mein kuch gadbad hai" }, { status: 500 });
  }
}