import { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to Node.js WebSocket server
const socket = io("http://10.80.4.63:9001");

function Test() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        // Listen for real-time updates
        socket.on("ticket_updated", (updatedTicket) => {
            console.log("🔄 Ticket update received:", updatedTicket);
            
            setTickets((prevTickets) => {
                const index = prevTickets.findIndex(ticket => ticket.name === updatedTicket.name);
                
                if (index !== -1) {
                    const newTickets = [...prevTickets];
                    newTickets[index] = updatedTicket;
                    return newTickets;
                } else {
                    return [...prevTickets, updatedTicket];
                }
            });
        });

        return () => {
            socket.off("ticket_updated");
        };
    }, []);

    
    return (
        <div>
            <h2>Tickets</h2>
            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket.name} className="flex items-center gap-2">
                        <div className="flex items-center">
                            <span>{ticket.subject}</span>
                        </div>
                        <span> - {ticket.ticket_status} - {ticket.priority} - {ticket.assigned_to} - {ticket.due_date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Test;
