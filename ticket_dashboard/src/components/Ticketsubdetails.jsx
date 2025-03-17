import { useParams, Link } from "react-router-dom";
import { FaUserCircle, FaEdit } from "react-icons/fa";
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
        creation: "Sat 09-11-2024 12:16 PM",
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
        creation: "Sat 09-11-2024 12:16 PM",
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
        creation: "Sat 09-11-2024 12:16 PM",
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

const users = [
    {
        name: "Rajeshwari N",
        username: "rajeshwari.n@noveloffice.com",
    },
    {
        name: "Sakshya P",
        username: "sakshya.p@noveloffice.com",
    },
    {
        name: "Rohan K",
        username: "rohan.k@noveloffice.com",
    },
    {
        name: "Aditi V",
        username: "aditi.v@noveloffice.com",
    },
];

const TicketSubDetails = ({ ticketSubDetails }) => {

    const [dueDate, setDueDate] = useState();
    const [selectedDate, setSelectedDate] = useState("");

    const [showStatus, setShowStatus] = useState(false);
    const [ticketStatus, setTicketStatus] = useState(ticketSubDetails.ticket_status);

    const [showPriority, setShowPriority] = useState(false);
    const [ticketPriority, setTicketPriority] = useState(ticketSubDetails.priority);

    const [showAssignee, setShowAssignee] = useState(false);
    const [ticketAssignee, setTicketAssignee] = useState(ticketSubDetails.assigned_to);

    const handleStatusChange = (status) => {
        setTicketStatus(status);
    }

    const handlePriorityChange = (priority) => {
        setTicketPriority(priority);
    }

    const handleAssigneeChange = (assignee) => {
        setTicketAssignee(assignee);
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };



    return (
        <div className="flex flex-col items-start p-4 border rounded shadow-md bg-white w-full overflow-hidden">
            {ticketSubDetails.map((subdetails, index) => (
                <div key={index} className="mb-2 w-full">

                    <div className="flex items-center mb-4 flex-wrap w-full">
                        <FaUserCircle className="text-4xl mr-2" />
                        <div>
                            <p className="font-bold">{subdetails.full_name}</p>
                            <p className="text-sm text-gray-500">{subdetails.designation}</p>
                        </div>
                    </div>

                    <div className="text-gray-500 flex items-center w-full">
                        <strong className="mr-2 text-sm">Assigned To: </strong> {subdetails.full_name}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <FaEdit onClick={() => setShowAssignee(!showAssignee)} />
                            {showAssignee && (
                                <div className="flex relative">
                                    {/* <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-60">
                                        {subdetails.assigned_to.map((user, index) => (
                                            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                                handleAssigneeChange(user);
                                                setShowAssignee(false);
                                            }}>
                                                {user.username}
                                            </li>
                                        ))}
                                    </ul> */}
                                </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center flex-wrap w-full">
                        <strong className="mr-2 text-sm">Due Date: </strong>
                        {subdetails.due_date ?
                            <>
                                <span>{new Date(subdetails.due_date).toLocaleDateString('en-GB')}</span>
                                <input type="date" value={selectedDate} onChange={(e) => handleDateChange(e)} className="ml-2" />
                            </> :
                            (selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB') :
                                <input type="date" value={selectedDate} onChange={(e) => handleDateChange(e)} />
                            )
                        }
                    </div>

                    <div className={`text-${subdetails.ticket_status === "On Hold" ? "red" : "green"}-600 text-gray-500 flex items-center w-full`}>
                        <strong className="mr-2 text-sm">Status: </strong> {subdetails.ticket_status}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <FaEdit onClick={() => setShowStatus(!showStatus)} />
                            {showStatus && (
                                <div className="flex relative">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {['Open', 'In Progress', 'Closed', 'On Hold'].map((status, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    handleStatusChange(status);
                                                    setShowStatus(false);
                                                }}
                                            >
                                                {status}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center flex-wrap w-full">
                        <strong className="mr-2 text-sm">Priority: </strong> {subdetails.priority}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <FaEdit onClick={() => setShowPriority(!showPriority)} />
                            {showPriority && (
                                <div className="flex relative">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {['High', 'Medium', 'Low'].map((priority, index) => (
                                            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                                handlePriorityChange(priority);
                                                setShowPriority(false);
                                            }}>
                                                {priority}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center text-xs mt-2 w-full">
                        <strong className="mr-2 text-sm">Ticket Creation: </strong> {subdetails.creation}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default TicketSubDetails;
