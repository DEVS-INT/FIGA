import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/prisma/client";

export async function POST(req: Request) {
  try {
    const { fullname, email, password, role } = await req.json();
    if (!fullname || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Sign up error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
