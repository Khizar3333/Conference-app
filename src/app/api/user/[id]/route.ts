import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('User ID is required', { status: 400 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  } else {
    return new Response(JSON.stringify(data));
  }
}
