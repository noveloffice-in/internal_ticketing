import React, { useState } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import Button from "../components/Button";
import { FaFilter, FaSort } from "react-icons/fa";
import { CiCircleAlert } from "react-icons/ci";
import Cards from "../components/Cards";
import CreateTicketModal from "../components/CreateTicketModal";

const tickets = [
  { id: 1, title: "Server Down", assignee: "Sakshya P", due: "Today", status: "Open" },
  { id: 2, title: "Payment Failure", assignee: "Rohan K", due: "Tomorrow", status: "Working" },
  { id: 3, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Solved" },
  { id: 4, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Sent" },
  { id: 5, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Unassigned" },
  { id: 6, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Open" },
  { id: 7, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Unassigned" },
  { id: 8, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Closed" },
  { id: 9, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Working" },
  { id: 10, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Open" },
];

const ticketData = [
    { status: "Open Tickets", count: 2 },
    { status: "Working Tickets", count: 2 },
    { status: "Solved Tickets", count: 1 },
    { status: "Sent Tickets", count: 1 },
    { status: "Unassigned Tickets", count: 2 },
    { status: "Overdue Tickets", count: 5 },
  ]

const Home = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log("openModal");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("closeModal");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex">
      <div className="w-full">
        <div className="w-full flex">
          <div className="w-1/2">
            <Searchbar />
          </div>
          <div className="w-1/2 flex justify-end">
             <Button text="Create Ticket" onClick={openModal} />
              {isModalOpen && <CreateTicketModal onClick={closeModal}/>}
          </div>
        </div>
        <div className='flex gap-4 flex flex-row w-full flex-wrap' >
            {ticketData.map((ticket, index) => (
              <Link key={index} to={`/tickets/${ticket.status.replace(" ", "").toLowerCase()}`}>
                <Cards ticketInfo={ticket} />
              </Link>
            ))}
        </div>

        <div className="p-4 shadow-2xl rounded-lg bg-white mt-4">

          <div className="p-4 rounded-lg bg-white cursor-pointer overflow-y-auto  flex flex-col gap-2">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`} // Navigates to TicketDetails page
                className="border p-4 mb-2 rounded hover:bg-gray-100 flex justify-between items-start"
              >
                <div className="flex">
                  <CiCircleAlert className="mr-2 text-red-600 w-16 h-8" />
                  <div>
                    <h3 className="font-bold text-red-600">{ticket.title}</h3>
                    <p>{ticket.assignee}</p>
                    <p className="text-gray-500">
                      Main production server is not responding. Immediate action required.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-600">Due: {ticket.due}</p>
                  <p className="text-gray-500">{ticket.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
