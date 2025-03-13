import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
      { author: "Sakshya P", time: "Feb 03, 17:50", message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!" },
      { author: "Rohan K", time: "Feb 03, 17:50", message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!" },
      { author: "Sakshya P", time: "Feb 03, 17:50", message: "I'm having trouble with the new feature on your site. It's not working as expected and I'm not sure how to fix it. Can you help me troubleshoot? Thanks!" },
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


const TicketMessages = ({ finalMessage }) => {
  const { ticketId } = useParams();
  const ticket = tickets.find((t) => t.id === parseInt(ticketId));
  const [messagesArray, setMessagesArray] = useState([]);

  useEffect(() => {
    if (finalMessage) {
      setMessagesArray((prevMessages) => [...prevMessages, finalMessage]);
    }
  }, [finalMessage]);

  return (
    <div>
      <div className="bg-white pt-4 pl-4 rounded-lg shadow-md overflow-y-auto" style={{ maxHeight: '400px', minHeight: '500px' }}>
        <p className="text-sm text-gray-400">Subject:</p>
        <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
        <hr></hr>
        <div>

          {ticket.messages.length === 0 ? (
            <div className="p-2 rounded" style={{ height: '100%' }}></div>
          ) : (
            ticket.messages.map((msg, index) => (
              <div key={index} className="p-2 rounded" style={{ minHeight: '100px' }}>
                <div className="flex items-center mb-2">
                  {msg.author === ticket.assignee ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2 mt-2 text-white bg-[rgb(138,89,226,0.28)]">
                      {ticket.profile}
                    </div>) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2 mt-2 text-white bg-gray-300">
                      {ticket.profile}
                    </div>
                  )}
                  <p className="font-bold text-gray-800">{msg.author}</p>
                  <p className="text-sm text-gray-500 ml-2">{msg.time}</p>
                </div>
                <div className={`p-3 rounded m-2 ml-10 rounded-b-lg ${msg.author === ticket.assignee ? 'bg-[rgb(138,89,226,0.28)]' : 'bg-gray-100'}`}>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              </div>
            ))
          )}


          {messagesArray.map((msg, index) => (
            <div key={index} className="p-2 rounded" style={{ minHeight: '100px' }}>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2 mt-2 text-white bg-[rgb(138,89,226,0.28)]">
                  {ticket.profile}
                </div>
                <p className="font-bold text-gray-800">{msg.status}</p>
                <p className="text-sm text-gray-500 ml-2">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="p-3 rounded m-2 ml-10 rounded-b-lg bg-[rgb(138,89,226,0.28)]">
                <p className="text-gray-700">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default TicketMessages;

