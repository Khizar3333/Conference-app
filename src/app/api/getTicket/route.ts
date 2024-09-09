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
    // First, get the user's registration data
    let { data: registration, error: regError } = await supabase
      .from('userinfo')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (regError) {
      throw regError;
    }

    // Check if user already has a ticket
    let { data: existingTicket, error: fetchError } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw fetchError;
    }

    if (!existingTicket) {
      // Generate new ticket
      const ticketId = `TICKET-${Date.now()}`;

      // Generate PDF
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Event Ticket', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.text(`Ticket ID: ${ticketId}`, 20, 40);
      doc.text(`Name: ${registration.firstname} ${registration.lastname}`, 20, 50);
      doc.text(`Email: ${registration.email}`, 20, 60);
      doc.text(`Ticket Type: ${registration.ticket_type}`, 20, 70);
    //   doc.text(`Job Title: ${registration.jobtitle}`, 20, 80);
    //   doc.text(`Company: ${registration.company}`, 20, 90);

      // Save ticket to database
      const { data: newTicket, error: insertError } = await supabase
        .from('tickets')
        .insert({
          user_id: userId,
          ticket_id: ticketId,
          name: `${registration.firstname} ${registration.lastname}`,
          email: registration.email,
          ticket_type: registration.ticket_type,
        //   job_title: registration.jobtitle,
        //   company: registration.company,
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

// import { NextRequest, NextResponse } from 'next/server';
// import supabase from "@/lib/supabase";

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const userId = searchParams.get('userId');

//   if (!userId) {
//     return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
//   }

//   // Check if userId is a valid UUID
// //   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// //   if (!uuidRegex.test(userId)) {
// //     return NextResponse.json({ message: 'Invalid User ID format' }, { status: 400 });
// //   }

//   try {
//     const { data, error } = await supabase
//       .from('tickets')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching tickets:', error);
//       return NextResponse.json({ message: 'Failed to fetch tickets' }, { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
//   }
// }