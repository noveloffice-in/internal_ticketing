import { useParams, Link } from "react-router-dom";
import CreateTicketModal from "./CreateTicketModal";
import { useState } from "react";

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
            },
            {
                id: 2,
                title: "Subticket 2",
                description: "Subticket 2 description",
                assignee: "Sakshya P",
                status: "Open",
                priority: "High"
            },
            {
                id: 3,
                title: "Subticket 3",
                description: "Subticket 3 description",
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

const Subtickets = () => {
    const { ticketId } = useParams(); // Get ticketId from URL
    const ticket = tickets.find((t) => t.id === parseInt(ticketId));

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col items-start p-1 border rounded shadow-md bg-white rounded-md">
                <div className="overflow-y-auto max-h-48 scrollbar-thin w-full p-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-md text-gray-500 font-bold">Subticket</p>
                        </div>
                        <div>
                            <button className="text-2xl text-gray-500" onClick={openModal}>+</button>
                            {isModalOpen && <CreateTicketModal onClick={closeModal} isOpen={isModalOpen} isSubticket={true} />}
                        </div>
                    </div>
                    {ticket.subtickets.map((subticket, index) => (
                        <div key={index} className="flex justify-between items-center mt-2 p-2 border rounded bg-gray-50 w-full">
                            <div>
                                <p className="text-gray-700 font-semibold">{subticket.title}</p>
                                <p className="text-gray-600 mr-2">{subticket.assignee}</p>
                            </div>
                            <div className="flex ">
                                <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">{subticket.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Subtickets;
