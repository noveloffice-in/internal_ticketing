import React, { useState } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import Button from "../components/Button";
import { FaFilter, FaSort } from "react-icons/fa";
import Cards from "../components/Cards";
import CreateTicketModal from "../components/CreateTicketModal";
import { useTickets } from '../context/context';
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";


const Home = () => {
  const {tickets, ticketCategories } = useTickets();
  const [selectedStatus, setSelectedStatus] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = selectedStatus === null || ticket.status === selectedStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (

    <div className="w-full">
      {/* Searchbar and Create Ticket Button */}
      <div className="w-full flex">
        <div className="w-1/2">
          <Searchbar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
        </div>
        <div className="w-1/2 flex justify-end">
          <Button text="Create Ticket" onClick={openModal} />
          {isModalOpen && <CreateTicketModal onClick={closeModal} isOpen={isModalOpen} isSubticket={false} />}
        </div>
      </div>

      <div className='flex gap-4 flex flex-row w-full flex-wrap' >
          {ticketCategories.map((category, index) => (
            <div key={index}>
              <Cards ticketInfo={category} onSelect={setSelectedStatus} />
            </div>
          ))}
        </div>

      {/* Ticket List */}
      <div className="p-4 shadow-2xl rounded-lg bg-white mt-3">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-xl font-bold" >{selectedStatus ? `${selectedStatus} Tickets` : "All Tickets"}</h2>
          <div className="flex items-center">
            <button className="mr-2 p-2 border rounded flex items-center">
              <FaFilter className="mr-1" /> Filter
            </button>
            <button className="p-2 border rounded flex items-center">
              <FaSort className="mr-1" /> Sort
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white cursor-pointer overflow-y-auto  flex flex-col gap-1">
          {filteredTickets.length > 0 ? 
            (
              filteredTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`} // Navigates to TicketDetails page
                  className="border-2 border-gray-200 p-4 mb-2 rounded hover:bg-gray-100 flex justify-between items-start"
                >
                  <div className="flex ">
                    {ticket.status === "Open" && <div className="bg-red-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='red'/></div>}
                    {ticket.status === "Working" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleCheck color='green'/></div>}
                    {ticket.status === "Solved" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleCheck color='green'/></div>}
                    {ticket.status === "Sent" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='green'/></div>}
                    {ticket.status === "Unassigned" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='green'/></div>}
                    {ticket.status === "Overdue" && <div className="bg-red-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='red'/></div>}
                    {ticket.status === "Closed" && <div className="bg-red-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='red'/></div>}
                    <div>
                      <h3 className="font-bold text-red-600">{ticket.title}</h3>
                      <p>{ticket.assignee}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600">Due: {ticket.due}</p>
                    <p className="text-gray-500">{ticket.status}</p>
                  </div>
                </Link>
              ))
            )
            :
            (
              <p className="text-gray-500">No tickets found</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
