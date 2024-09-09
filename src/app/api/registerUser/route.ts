import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';


export async function POST(request: Request) {
  const { email } = await request.json();

  const { data, error } = await supabase
        .from('users') 
        .upsert({ email: email }, { onConflict: 'email' });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  } else {
    return new Response(JSON.stringify({ success: true }));
  }
}
