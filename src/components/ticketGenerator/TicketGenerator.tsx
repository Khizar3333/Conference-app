
import React, { useState } from 'react';

interface TicketData {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  userId: string;
}

interface TicketGeneratorProps {
  userId: string;
  onTicketGenerated: () => void;
}

const TicketGenerator: React.FC<TicketGeneratorProps> = ({ userId, onTicketGenerated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketType, setTicketType] = useState('General Admission');

  const generatePDF = async (ticketData: TicketData) => {
    try {
      const response = await fetch('/api/generateTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ticket');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'event_ticket.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      onTicketGenerated(); // Refresh the ticket list after generating a new ticket
    } catch (error) {
      console.error('Error generating ticket:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePDF({
      id: `TICKET-${Date.now()}`, // Generate a unique ID
      name,
      email,
      ticketType,
      userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700">Ticket Type</label>
        <select
          id="ticketType"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="General Admission">General Admission</option>
          <option value="VIP">VIP</option>
          <option value="Early Bird">Early Bird</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Generate New Ticket
      </button>
    </form>
  );
};

export const generatePDF = async (ticketData: TicketData) => {
  try {
    const response = await fetch('/api/generateTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate ticket');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'event_ticket.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating ticket:', error);
    // Handle error (e.g., show an error message to the user)
  }
};

export default TicketGenerator;












// import React from 'react';

// interface TicketData {
//   id: string;
//   name: string;
//   email: string;
//   ticketType: string;
// }

// interface TicketGeneratorProps {
//   ticketData: TicketData;
// }

// const TicketGenerator: React.FC<TicketGeneratorProps> = ({ ticketData }) => {
//   const generatePDF = async () => {
//     try {
//       const response = await fetch('/api/generateTicket', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(ticketData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate ticket');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = 'event_ticket.pdf';
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error generating ticket:', error);
//       // Handle error (e.g., show an error message to the user)
//     }
//   };

//   return (
//     <button
//       onClick={generatePDF}
//       className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//     >
//       Download Ticket PDF
//     </button>
//   );
// };

// export default TicketGenerator;