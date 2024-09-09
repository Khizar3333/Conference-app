
"use client"
import React, { useEffect, useState } from 'react';
import { useMagic } from '@/hooks/MagicProvider';

interface Ticket {
  id: string;
  ticket_id: string;
  name: string;
  email: string;
  ticket_type: string;
  job_title: string;
  company: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { magic } = useMagic();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (magic) {
        try {
          const userData = await magic.user.getMetadata();
          if (userData.issuer) {
            const response = await fetch(`/api/getTicket?userId=${userData.issuer}`);
            if (!response.ok) {
              throw new Error('Failed to fetch ticket');
            }
            const data = await response.json();
            setTicket(data);
          }
        } catch (error) {
          console.error('Error fetching ticket:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTicket();
  }, [magic]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>No ticket found. Please complete the registration form.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Your Ticket</h2>
        <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
        <p><strong>Name:</strong> {ticket.name}</p>
        <p><strong>Email:</strong> {ticket.email}</p>
        <p><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
        {/* <p><strong>Job Title:</strong> {ticket.job_title}</p> */}
        {/* <p><strong>Company:</strong> {ticket.company}</p> */}
        <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
        <button
          onClick={() => window.open(`/api/downloadTicket?ticketId=${ticket.ticket_id}`, '_blank')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default Dashboard;



// "use client"

// import React, { useEffect, useState } from 'react';
// import { useMagic } from '@/hooks/MagicProvider';

// interface Ticket {
//   id: string;
//   ticket_id: string;
//   name: string;
//   email: string;
//   ticket_type: string;
//   created_at: string;
// }

// const Dashboard: React.FC = () => {
//   const { magic } = useMagic();
//   const [ticket, setTicket] = useState<Ticket | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTicket = async () => {
//       if (magic) {
//         try {
//           const userData = await magic.user.getMetadata();
//           if (userData.issuer && userData.email) {
//             const response = await fetch(`/api/getTicket?userId=${userData.issuer}&name=${userData.email}&email=${userData.email}`);
//             if (!response.ok) {
//               throw new Error('Failed to fetch ticket');
//             }
//             const data = await response.json();
//             setTicket(data);
//           }
//         } catch (error) {
//           console.error('Error fetching ticket:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchTicket();
//   }, [magic]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!ticket) {
//     return <div>No ticket found. Please try again later.</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <h2 className="text-xl font-semibold mb-4">Your Ticket</h2>
//         <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
//         <p><strong>Name:</strong> {ticket.name}</p>
//         <p><strong>Email:</strong> {ticket.email}</p>
//         <p><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
//         <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
//         <button
//           onClick={() => window.open(`/api/downloadTicket?ticketId=${ticket.ticket_id}`, '_blank')}
//           className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           Download Ticket
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// "use client";

// import React, { useEffect, useState } from 'react';
// import TicketGenerator, { generatePDF } from '@/components/ticketGenerator/TicketGenerator';
// import { useMagic } from '@/hooks/MagicProvider';

// interface Ticket {
//   id: string;
//   ticket_id: string;
//   name: string;
//   email: string;
//   ticket_type: string;
//   created_at: string;
// }

// const Dashboard: React.FC = () => {
//   const { magic } = useMagic();
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const getUserData = async () => {
//       if (magic) {
//         try {
//           const userData = await magic.user.getMetadata();
//           setUser(userData);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       }
//     };

//     getUserData();
//   }, [magic]);

//   useEffect(() => {
//     if (user) {
//       fetchUserTickets();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       fetchUserTickets();
//     }
//   }, [user]);

//   const fetchUserTickets = async () => {
//     if (!user) {
//       console.error('User is not authenticated');
//       return;
//     }

//     try {
//       const response = await fetch(`/api/getTicket?userId=${user.issuer}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch tickets');
//       }
//       const data = await response.json();
//       setTickets(data);
//     } catch (error) {
//       console.error('Error fetching tickets:', error);
//     }
//   };

//   if (!magic || !user) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
//       <TicketGenerator userId={user.issuer} onTicketGenerated={fetchUserTickets} />
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
//         {tickets.length === 0 ? (
//           <p>You haven't generated any tickets yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {tickets.map((ticket) => (
//               <li key={ticket.id} className="border p-4 rounded-lg">
//                 <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
//                 <p><strong>Name:</strong> {ticket.name}</p>
//                 <p><strong>Email:</strong> {ticket.email}</p>
//                 <p><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
//                 <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
//                 <button
//                   onClick={() => generatePDF({
//                     id: ticket.ticket_id,
//                     name: ticket.name,
//                     email: ticket.email,
//                     ticketType: ticket.ticket_type,
//                     userId: user.issuer,
//                   })}
//                   className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Download Ticket
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;









// "use client"
// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import TicketGenerator from "@/components/ticketGenerator/TicketGenerator";

// interface TicketData {
//   id: string;
//   name: string;
//   email: string;
//   ticketType: string;
// }

// const Dashboard: React.FC = () => {
//   const searchParams = useSearchParams();
//   const [ticketData, setTicketData] = useState<TicketData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (searchParams) {
//       const ticketParam = searchParams.get('ticket');
//       if (ticketParam) {
//         try {
//           const parsedTicket = JSON.parse(decodeURIComponent(ticketParam));
//           setTicketData(parsedTicket);
//         } catch (error) {
//           console.error('Error parsing ticket data:', error);
//         }
//       }
//       setIsLoading(false);
//     }
//   }, [searchParams]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!ticketData) {
//     return <div>No ticket data found. Please try registering again.</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <h2 className="text-2xl font-semibold mb-4">Your Ticket Information</h2>
//         <p><strong>Ticket ID:</strong> {ticketData.id}</p>
//         <p><strong>Name:</strong> {ticketData.name}</p>
//         <p><strong>Email:</strong> {ticketData.email}</p>
//         <p><strong>Ticket Type:</strong> {ticketData.ticketType}</p>
        
//         <div className="mt-6">
//           <TicketGenerator ticketData={ticketData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;