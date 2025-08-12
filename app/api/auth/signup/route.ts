import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/prisma/client";

export async function POST(request: Request) {
  try {
    const { fullname, email, password, role } = await request.json();
    if (!fullname || !email || !password || !role) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { fullname, email, password: hashed, role },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
