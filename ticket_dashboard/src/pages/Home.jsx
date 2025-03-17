import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import Button from "../components/Button";
import { FaFilter, FaSort } from "react-icons/fa";
import Cards from "../components/Cards";
import CreateTicketModal from "../components/CreateTicketModal";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { useFrappePostCall } from "frappe-react-sdk";


const Home = ( ) => {
  const [ticketCount, setTicketCount] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("All Tickets");
  const { call: call1 } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_count_by_department");
  const { call: call2 } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_list");

  useEffect(()=>{
    getTicketCountByDepartment();
    getTicketList();
  },[])

  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    getTicketCountByDepartment();
    getTicketList();
  };

  const getTicketCountByDepartment = ()=>{
    call1({
      department: "Software",
    })
    .then((res)=>{
      setTicketCount(Object.values(res['message']));
    })
    .catch((err)=>{
      console.log("Error", err);
    })
  }

  const getTicketList = ()=>{
    call2({
      department: "Software",
    })
    .then((res)=>{
      setTicketList(res['message']);
    })
    .catch((err)=>{
      console.log("Error", err);
    })
  }
  

  const handleCardClick = (ticketStatus) => {
    setSelectedTicket(ticketStatus);
  }


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
      
      {/* Ticket Cards */}
      <div className='flex gap-4 flex flex-row w-full flex-wrap' >
          {ticketCount.map((category, index) => (
            <div key={index}>
              <Cards ticketInfo={category} onClick={(ticketStatus) => {
                handleCardClick(ticketStatus);
                console.log("ticketStatus:", ticketStatus);
              }}/>
            </div>
          ))}
        </div>

      {/* Ticket List */}
      <div className="p-4 shadow-2xl rounded-lg bg-white mt-3">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-xl font-bold" >{selectedTicket ? selectedTicket : "All Tickets"}</h2>
          {/* <div className="flex items-center">
            <button className="mr-2 p-2 border rounded flex items-center">
              <FaFilter className="mr-1" /> Filter
            </button>
            <button className="p-2 border rounded flex items-center">
              <FaSort className="mr-1" /> Sort
            </button>
          </div> */}
        </div>

        <div className="p-4 rounded-lg bg-white cursor-pointer overflow-y-auto  flex flex-col gap-1">
          {ticketList.length > 0 ? 
            (
              
              (ticketList.map((ticket) => (
                (selectedTicket === "All Tickets" || ticket.ticket_status === selectedTicket) && (
                  
                <Link
                  key={ticket.name}
                  to={`/dashboard/tickets/${ticket.name}`} // Navigates to TicketDetails page
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
                      <h3 className="font-bold text-red-600">{ticket.subject}</h3>
                      <p>{ticket.assigned_to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600">Due: {new Date(ticket.due_date).toLocaleDateString('en-GB')}</p>
                    <p className="text-gray-500">{ticket.ticket_status}</p>
                  </div>
                </Link>


                )
              )))
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
