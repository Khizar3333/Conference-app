import { NextRequest, NextResponse } from 'next/server';
import supabase from "@/lib/supabase";
import { jsPDF } from 'jspdf';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticketId = searchParams.get('ticketId');

  if (!ticketId) {
    return NextResponse.json({ message: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_id', ticketId)
      .single();

    if (error) throw error;

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Event Ticket', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`Ticket ID: ${ticket.ticket_id}`, 20, 40);
    doc.text(`Name: ${ticket.name}`, 20, 50);
    doc.text(`Email: ${ticket.email}`, 20, 60);
    doc.text(`Ticket Type: ${ticket.ticket_type}`, 20, 70);
    

    const pdfBuffer = doc.output('arraybuffer');

   
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${ticket.ticket_id}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    return NextResponse.json({ message: 'Failed to generate ticket PDF' }, { status: 500 });
  }
}


