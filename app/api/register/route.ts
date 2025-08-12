import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const BodySchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // Accept your Prisma enum roles. Your signup page maps UI roles → DB roles.
  role: z.enum(["EMPLOYER", "EMPLOYEE", "ADMIN", "STAFF"]).default("EMPLOYEE"),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { fullname, email, password, role } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check if email already exists
    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        fullname,
        email: normalizedEmail,
        password: hashed,
        role, // e.g. "EMPLOYEE" | "EMPLOYER" | "ADMIN" | "STAFF"
      },
      select: { id: true, email: true, fullname: true, role: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (e: any) {
    // Unique constraint race condition fallback
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }
    console.error("Register error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
