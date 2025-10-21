import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Simple health check for Prisma connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Prisma connection successful' 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Prisma connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
