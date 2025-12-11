import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  try {
    const sqlPath = path.join(process.cwd(), 'migrations', 'masterfabric-remote-setup.sql');
    const sql = await readFile(sqlPath, 'utf8');

    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to load setup SQL script' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
