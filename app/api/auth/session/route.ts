import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/server-session';

export async function GET() {
  const sessionData = await getServerSession();
  return NextResponse.json(sessionData);
}