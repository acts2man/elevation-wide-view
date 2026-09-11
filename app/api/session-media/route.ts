import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/** Public, read-only: every visitor needs this to see admin-set session graphics, descriptions, video links, and audio. */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin().from('session_media').select('*');
    if (error) throw error;
    return NextResponse.json({ ok: true, rows: data ?? [] });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), rows: [] }, { status: 200 });
  }
}
