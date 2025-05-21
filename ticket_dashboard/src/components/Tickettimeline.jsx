import { useState, useEffect, useMemo } from "react";
import Timelinemodal from "./Timelinemodal";
import io from "socket.io-client";
import { useFrappePostCall } from "frappe-react-sdk";

// const getTimeline = (date) => {
//     const today = new Date();
//     const entryDate = new Date(date);
//     const timeDiff = today - entryDate;
//     const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//     if (daysDiff === 0) {
//         return "Today";
//     } else if (daysDiff === 1) {
//         return "Yesterday";
//     } else {
//         return `${daysDiff} days ago`;
//     }
// }


const TicketTimeline = ({ ticketID }) => {
    const [showTimeline, setShowTimeline] = useState(false);
    const [ticketTimeline, setTicketTimeline] = useState([]);
    const { call: getTicketTimeline } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_timeline");
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const socket = useMemo(() => io(apiUrl), []);

    useEffect(() => {
        getTicketTimeline({ ticket_id: ticketID }).then((response) => {
            setTicketTimeline(response.message);
        });
    }, [ticketID]);

    socket.on("ticket_updated", (updatedTicket) => {
        getTicketTimeline({ ticket_id: ticketID }).then((response) => {
            setTicketTimeline(response.message);
        });
    });
    
    return (
        <div>
            <div className="bg-white p-3 shadow-md rounded-2xl w-full">
                <div className="flex justify-between items-center">
                    <p className="text-md text-gray-500 font-bold">Ticket Timeline</p>
                    <span
                        className="text-gray-400 cursor-pointer"
                        onClick={() => setShowTimeline(true)}
                    >
                        ↗
                    </span>
                    {showTimeline && <Timelinemodal onClose={() => setShowTimeline(false)} ticketTimeline={ticketTimeline} />}
                </div>

                <div className="mt-3 overflow-y-auto max-h-30 scrollbar-thin" style={{ maxHeight: '100px' }}>
                    {ticketTimeline.length > 0 ? (
                        ticketTimeline.map((entry, index) => {
                            return (
                                <div key={index} className="flex space-x-3 relative">
                                    {/* Timeline Marker (Bullet & Line) */}
                                    <div className="flex flex-col items-center relative mt-3">
                                        {/* Bullet Point */}
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>

                                        {/* Connecting Line */}
                                        {index < ticketTimeline.length - 1 && (
                                            <div className="w-px flex-grow bg-gray-400 absolute top-0" style={{ height: 'calc(100% + 0.8rem)' }}></div>
                                        )}
                                    </div>

                                    {/* Timeline Content */}
                                    <div>
                                        {entry && (
                                            <p className="text-gray-500 text-sm mt-2">
                                                {entry.pre_status == null && entry.post_status == null ? 
                                                <span>{entry.user} has created the ticket on {new Date(entry.date_of_change).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{', '}{new Date(entry.date_of_change).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.</span> : 
                                                <span>{entry.user} has changed {entry.pre_status} to {entry.post_status} on {new Date(entry.date_of_change).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{', '}{new Date(entry.date_of_change).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.</span> 
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-sm">No timeline updates yet.</p>
                    )}
                </div>


            </div>
        </div>
    )
}

export default TicketTimeline;
