// pages/api/submitForm.js

import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';
import { UserInfo } from '@/utils/types';


export async function POST(request: Request) {
  const {
    firstname,
    lastname,
    email,
    jobtitle,
    company,
    website,
    message,
    nextjsexpr,
    ticket_type,
  }:UserInfo = await request.json();

  const { data, error } = await supabase
    .from('userinfo')
    .insert([{
      firstname,
      lastname,
      email,
      jobtitle,
      company,
      website,
      message,
      nextjsexpr,
      ticket_type,
    }]);

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
}
