import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import supabase from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const ticketData = await req.json();
  const userId = ticketData.userId; // This is the Magic DID

  try {
    // Generate PDF
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('Event Ticket', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Ticket ID: ${ticketData.id}`, 20, 40);
    doc.text(`Name: ${ticketData.name}`, 20, 50);
    doc.text(`Email: ${ticketData.email}`, 20, 60);
    doc.text(`Ticket Type: ${ticketData.ticketType}`, 20, 70);

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        user_id: userId, 
        ticket_id: ticketData.id,
        name: ticketData.name,
        email: ticketData.email,
        ticket_type: ticketData.ticketType,
      });

    if (error) throw error;

   
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=event_ticket.pdf',
      },
    });
  } catch (error) {
    console.error('Error saving ticket:', error);
    return NextResponse.json({ message: 'Failed to save ticket' }, { status: 500 });
  }
}