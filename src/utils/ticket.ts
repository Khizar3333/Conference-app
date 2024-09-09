// utils/generateTicket.ts
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface UserData {
    id: string;
    name: string;
    email: string;
    ticketId: string;
}

export function generateTicket(userData: UserData): string {
    const doc = new PDFDocument();
    const filePath = path.resolve('./public/tickets', `${userData.id}_ticket.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('Conference Ticket', { align: 'center' });
    doc.fontSize(20).text(`Name: ${userData.name}`, { align: 'center' });
    doc.fontSize(16).text(`Email: ${userData.email}`, { align: 'center' });
    doc.fontSize(16).text(`Ticket ID: ${userData.ticketId}`, { align: 'center' });
    // Add more details as needed

    doc.end();
    return filePath;
}
