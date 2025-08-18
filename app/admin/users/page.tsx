import React from "react";
import UsersClient, { type UserRow } from "@/components/admin/UsersClient";
import { prisma } from "@/prisma/client";
import { Prisma } from "@/lib/generated/prisma";

export default async function AdminUsersPage() {
  // Use raw SQL to avoid Prisma Client schema mismatch while `is_active` propagates.
  const [users, staff] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        id: string;
        fullname: string;
        email: string;
        role: string;
        created_at: Date;
        is_active: boolean;
      }>
    >(
      Prisma.sql`SELECT id, fullname, email, role, created_at, COALESCE(is_active, true) AS is_active
                 FROM "User"
                 ORDER BY created_at DESC
                 LIMIT 50`
    ),
    prisma.$queryRaw<
      Array<{
        id: string;
        fullname: string;
        email: string;
        role: string;
        created_at: Date;
        is_active: boolean;
      }>
    >(
      Prisma.sql`SELECT id, fullname, email, role, created_at, COALESCE(is_active, true) AS is_active
                 FROM "User"
                 WHERE role = 'STAFF'
                 ORDER BY created_at DESC
                 LIMIT 100`
    ),
  ]);

  return (
    <UsersClient
      initialUsers={users as unknown as UserRow[]}
      initialStaff={staff as unknown as UserRow[]}
    />
  );
}
