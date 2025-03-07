import { useParams, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

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

const TicketSubDetails = () => {
    const { ticketId } = useParams(); // Get ticketId from URL
    const ticket = tickets.find((t) => t.id === parseInt(ticketId));

    return (
        <div>
            <div className="flex flex-col items-start p-4 border rounded shadow-md bg-white rounded-md">
                {["assignee", "due", "status", "priority"].map((field, index) => (
                    <div key={index} className="mb-2">
                        {field === "assignee" && (
                            <div className="flex items-center mb-4">
                                <FaUserCircle className="text-4xl mr-2" />
                                <div>
                                    <p className="font-bold">{ticket.assignee}</p>
                                    <p className="text-sm text-gray-500">Business Development Manager</p>
                                </div>
                            </div>
                        )}
                        {field === "due" && <p><strong>Due Date:</strong> {ticket.due}</p>}
                        {field === "status" && (
                            <p className={`text-${ticket.status === "On Hold" ? "red" : "green"}-600`}>
                                <strong>Status:</strong> {ticket.status}
                            </p>
                        )}
                        {field === "priority" && (
                            <p className={`text-${ticket.priority === "High" ? "red" : "green"}-600`}>
                                <strong>Priority:</strong> {ticket.priority} Priority
                            </p>
                        )}
                    </div>
                ))}
                <p><strong>Ticket Created:</strong> Sat 09-11-2024 12:16 PM</p>
            </div>
        </div>
    )
}

export default TicketSubDetails;
