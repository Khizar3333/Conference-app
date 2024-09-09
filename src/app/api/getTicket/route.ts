import { NextRequest, NextResponse } from 'next/server';
import supabase from "@/lib/supabase";
import { jsPDF } from 'jspdf';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    let { data: registration, error: regError } = await supabase
      .from('userinfo')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (regError) {
      throw regError;
    }

    let { data: existingTicket, error: fetchError } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { 
      throw fetchError;
    }

    if (!existingTicket) {
      const ticketId = `TICKET-${Date.now()}`;

      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Event Ticket', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.text(`Ticket ID: ${ticketId}`, 20, 40);
      doc.text(`Name: ${registration.firstname} ${registration.lastname}`, 20, 50);
      doc.text(`Email: ${registration.email}`, 20, 60);
      doc.text(`Ticket Type: ${registration.ticket_type}`, 20, 70);
    
      const { data: newTicket, error: insertError } = await supabase
        .from('tickets')
        .insert({
          user_id: userId,
          ticket_id: ticketId,
          name: `${registration.firstname} ${registration.lastname}`,
          email: registration.email,
          ticket_type: registration.ticket_type,
        
        })
        .select()
        .single();

      if (insertError) throw insertError;

      existingTicket = newTicket;
    }

    return NextResponse.json(existingTicket);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

