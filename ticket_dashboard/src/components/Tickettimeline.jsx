import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Timelinemodal from "./Timelinemodal";

const tickets = [
    {
        id: 1,
        time: "Feb 03, 17:24",
        message: "Hi there, I'm sending an email because I'm having a problem setting up your new product. Can you help me troubleshoot? Thanks,",
        title: "Server Down",
        description: "Urgent server issue",
        assignee: "Sakshya P",
        due: "Today",
        status: "Open",
        priority: "High",
        profile: "RN",
        timeline: [
            {
                changes: "Harry changed the status to Working to On Hold  ",
                time: "6 days ago"
            },
            {
                changes: "Harry changed the status to On Hold to Cancelled",
                time: "1 week ago"
            },
            {
                changes: "Harry changed the status to Cancelled to Open",
                time: "1 week ago"
            },
            {
                changes: "Harry changed the status to Open to Closed",
                time: "1 week ago"
            },
            {
                changes: "Harry changed the status to Closed to Open",
                time: "1 week ago"
            }
        ],
        messages: [
            { author: "Sakshya P", time: "Feb 03, 17:24", message: "Hi there, I'm sending an email because I'm having a problem setting up your new product. Can you help me troubleshoot? Thanks," },
            { author: "Rohan K", time: "Feb 03, 17:45", message: "I've got some cool items in my cart on your site, but before I take the plunge, I want to understand how much I'll be paying for shipping. The numbers can be a bit scary when you don't know what they're for. Can you help me understand what all influences the shipping costs? Is there a calculator or formula I can use first?" },
            { author: "Sakshya P", time: "Feb 03, 17:50", message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!" }
        ],
        subtickets: [
            {
                id: 1,
                title: "Subticket 1",
                description: "Subticket 1 description",
                assignee: "Sakshya P",
                status: "Open",
                priority: "High"
            }
        ]
    },
    {
        id: 2,
        time: "Feb 03, 17:45",
        message: "I've got some cool items in my cart on your site, but before I take the plunge, I want to understand how much I'll be paying for shipping. The numbers can be a bit scary when you don't know what they're for. Can you help me understand what all influences the shipping costs? Is there a calculator or formula I can use first?",
        title: "Payment Failure",
        description: "Payment not processed",
        assignee: "Rohan K",
        due: "Tomorrow",
        status: "In Progress",
        priority: "Medium",
        profile: "RK",
        timeline: [
            {
                changes: "Harry changed the status to In Progress to On Hold",
                time: "6 days ago"
            },

        ],
        messages: [
            { author: "Rohan K", time: "Feb 03, 17:45", message: "I've got some cool items in my cart on your site, but before I take the plunge, I want to understand how much I'll be paying for shipping. The numbers can be a bit scary when you don't know what they're for. Can you help me understand what all influences the shipping costs? Is there a calculator or formula I can use first?" },
            { author: "Sakshya P", time: "Feb 03, 17:50", message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!" }
        ],
        subtickets: [
            {
                id: 1,
                title: "Subticket 1",
                description: "Subticket 1 description",
                assignee: "Sakshya P",
                status: "Open",
                priority: "High"
            },
            {
                id: 2,
                title: "Subticket 2",
                description: "Subticket 2 description",
                assignee: "Sakshya P",
                status: "Open",
                priority: "High"
            }
        ]
    },
    {
        id: 3,
        time: "Feb 04, 10:15",
        message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!",
        title: "UI Bug",
        description: "Misalignment in dashboard",
        assignee: "Aditi V",
        due: "Next Week",
        status: "Closed",
        priority: "Low",
        profile: "AV",
        timeline: [
            {
                changes: "Harry changed the status to Closed to Open",
                time: "6 days ago"
            },

        ],
        messages: [
            { author: "Aditi V", time: "Feb 04, 10:15", message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!" }
        ],
        subtickets: []
    }
];

const TicketTimeline = () => {
    const { ticketId } = useParams(); // Get ticketId from URL
    const ticket = tickets.find((t) => t.id === parseInt(ticketId));
    const [showTimeline, setShowTimeline] = useState(false);

    return (
        <div>
            <div className="bg-white p-3 shadow-md rounded-lg w-full">
                <div className="flex justify-between items-center">
                    <p className="text-gray-800 font-semibold text-lg">Ticket Timeline :</p>
                    <span
                        className="text-gray-400 cursor-pointer"
                        onClick={() => setShowTimeline(true)}
                    >
                        ↗
                    </span>
                    {showTimeline && <Timelinemodal onClose={() => setShowTimeline(false)} />}
                </div>



                <div className="mt-3 overflow-y-auto max-h-30 scrollbar-thin" style={{ maxHeight: '120px' }}>
                    {ticket.timeline.length > 0 ? (
                        ticket.timeline.map((entry, index) => {
                            const nextEntryHasChanges = ticket.timeline[index + 1]?.changes; // Check if next entry has changes

                            return (
                                <div key={index} className="flex space-x-3 relative">
                                    {/* Timeline Marker (Bullet & Line) */}
                                    <div className="flex flex-col items-center absolute left-0 top-0 mt-2">
                                        {/* Bullet Point */}
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                                        {/* Vertical Line - Only if next entry has changes */}
                                        {nextEntryHasChanges && (
                                            <div className="w-0.5 h-11 bg-gray-300"></div>
                                        )}
                                    </div>

                                    {/* Timeline Content */}
                                    <div>
                                        {entry.changes && (
                                            <p className="text-gray-500 text-sm p-1">
                                                <span>{entry.changes}.</span> <span className="text-xs text-gray-500">{entry.time}</span>
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
