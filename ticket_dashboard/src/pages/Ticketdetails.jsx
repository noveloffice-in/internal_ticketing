import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import TicketMessages from "../components/Ticketmessages";
import TicketSubDetails from "../components/Ticketsubdetails";
import Subtickets from "../components/Subtickets";
import TicketTimeline from "../components/Tickettimeline";
import TextEditor from "../components/Texteditor";
import Ticketbuttons from "../components/Ticketbuttons";


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


const TicketDetails = () => {
  const { ticketId } = useParams(); // Get ticketId from URL
  const ticket = tickets.find((t) => t.id === parseInt(ticketId));

  if (!ticket) return <p className="text-center text-red-600">Ticket not found</p>;

  return (
    <div>
      <Link to="/" className="mt-4 inline-block">
        <FaArrowLeft className="mr-2" />
      </Link>


      <div className="flex">

        <div className="w-3/4 p-2 mt-2">
          <TicketMessages />
          <TextEditor />
        </div>

        <div className="w-1/4 p-1 flex flex-col gap-2 mt-3">
          <TicketSubDetails />

          < Subtickets />

          <TicketTimeline />
          <Ticketbuttons />


        </div>

      </div>
    </div>

  );
};

export default TicketDetails;
