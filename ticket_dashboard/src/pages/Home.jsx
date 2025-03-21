import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import Button from "../components/Button";
import { FaFilter, FaSort } from "react-icons/fa";
import Cards from "../components/Cards";
import CreateTicketModal from "../components/CreateTicketModal";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { useFrappeAuth, useFrappePostCall } from "frappe-react-sdk";
import { BiTimeFive } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import Cookies from "js-cookie";
import { useFrappeEventListener } from "frappe-react-sdk";


const Home = () => {
  const { getUserCookie } = useFrappeAuth();
  const [ticketCreated, setTicketCreated] = useState(0);
  const [ticketCount, setTicketCount] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("All Tickets");
  const { call: call1 } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_count_by_department");
  const { call: call2 } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_list");
  const ticketStatusException = ["Cancelled Tickets"]
  const [activeCard, setActiveCard] = useState("All Tickets");
  const [userDepartment, setUserDepartment] = useState("");

  Cookies.set(getUserCookie);
  const { call: getUserDepartment } = useFrappePostCall("internal_ticketing.ticketing_api.get_user_department");

  useFrappeEventListener("ticket_creation", (ticket_id) => {
    console.log("Ticket Created successfully", ticket_id);
  });

  useEffect(() => {
    // You can add more console logs here
    console.log("Component mounted or dependencies changed");
    
    // You can also log variables
    console.log("Current ticket count:", ticketCount);
    console.log("Current user department:", userDepartment);
    
    // For debugging, you can return a cleanup function
    return () => {
      console.log("Component unmounted or dependencies about to change");
    };
  }, [ticketCount, userDepartment]); // Adding dependencies will make this run when they change

  useEffect(() => {
    getUserDepartment({
      user_id: Cookies.get('user_id')
    }).then((res) => {
      setUserDepartment(res['message']);
      console.log("User Department", userDepartment);
      getTicketCountByDepartment(userDepartment);
      getTicketList(userDepartment);
    }).catch((err) => {
      console.log("Error", err);
    })

  }, [userDepartment]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getTicketCountByDepartment(userDepartment);
    getTicketList(userDepartment);
  };

  const getTicketCountByDepartment = (userDepartment) => {
    call1({
      department: userDepartment,
    })
      .then((res) => {
        setTicketCount(Object.values(res['message']));
      })
      .catch((err) => {
        console.log("Error", err);
      })
  }

  const getTicketList = (userDepartment) => {
    call2({
      department: userDepartment,
    })
      .then((res) => {
        setTicketList(res['message']);
      })
      .catch((err) => {
        console.log("Error", err);
      })
  }


  const handleCardClick = (ticketStatus) => {
    setSelectedTicket(ticketStatus);
    setActiveCard(ticketStatus);
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
          !ticketStatusException.includes(category.ticket_status) && (
            <div key={index}>
              <Cards ticketInfo={category} activeCard={activeCard} onClick={(ticketStatus) => {
                handleCardClick(ticketStatus);
                setActiveCard(ticketStatus);

              }} />
            </div>
          )
        ))}
      </div>

      {/* Ticket List */}
      <div className="p-4 shadow-2xl rounded-lg bg-white mt-3">
        <div className="flex justify-between items-center px-4 my-2">
          <h2 className="text-xl font-bold" >{selectedTicket ? selectedTicket : "All Tickets"}</h2>
        </div>
        <hr className="border-gray-200 mt-4" />
        <div className="p-2 rounded-lg bg-white cursor-pointer overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 flex flex-col gap-1 mt-2">

          {ticketList.length > 0 ?
            (

              (ticketList.map((ticket) => (
                (selectedTicket === "All Tickets" || ticket.ticket_status === selectedTicket) && (
                  searchQuery === "" || ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
                ) && (

                  <Link
                    key={ticket.name}
                    to={`/dashboard/tickets/${ticket.name}`} // Navigates to TicketDetails page
                    className="border-2 border-gray-200 p-4 mb-2 rounded hover:bg-gray-100 flex justify-between items-start rounded-2xl"
                  >
                    <div className="flex ">
                      {ticket.status === "Open" && <div className="bg-red-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='red' /></div>}
                      {ticket.status === "Working" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleCheck color='green' /></div>}
                      {ticket.status === "Solved" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleCheck color='green' /></div>}
                      {ticket.status === "Sent" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='green' /></div>}
                      {ticket.status === "Unassigned" && <div className="bg-green-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='green' /></div>}
                      {ticket.status === "Overdue" && <div className="bg-red-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='red' /></div>}
                      {ticket.status === "Closed" && <div className="bg-red-100  flex items-center justify-center rounded-md w-7 h-7 mr-4 mt-1"><FaCircleExclamation color='red' /></div>}
                      <div>
                        <div className="flex items-center gap-1">
                          {ticket.priority === "High" && <div className="bg-red-100 p-1.5 rounded-full w-7 h-7"><FaCircleExclamation color='red' /></div>}
                          {ticket.priority === "Medium" && <div className="bg-yellow-100 p-1.5 rounded-full w-7 h-7"><FaCircleExclamation color='yellow' /></div>}
                          {ticket.priority === "Low" && <div className="bg-green-100 p-1.5 rounded-full w-7 h-7"><FaCircleExclamation color='green' /></div>}
                          <h3 className="font-bold">{ticket.subject}</h3>
                        </div>
                        <div className="flex flex-col ml-8">
                          <p>{ticket.assigned_to}</p>
                          <p className="text-center w-fit text-sm flex items-center gap-1 mt-2">
                            <BiTimeFive />
                            {(() => {
                              const date = new Date(ticket.creation);
                              const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              });
                              const time = ticket.creation.split(' ')[1].split('.')[0];
                              return `${formattedDate} ${time}`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <p className={`rounded-2xl text-center py-1 px-4 w-fit text-sm ${ticket.ticket_status === "Open" ? "bg-red-100 text-red-600" :
                        ticket.ticket_status === "Working Tickets" ? "bg-green-100 text-green-600" :
                          ticket.ticket_status === "Solved Tickets " ? "bg-green-100 text-green-600" :
                            ticket.ticket_status === "Sent Tickets" ? "bg-purple-100 text-purple-600" :
                              ticket.ticket_status === "Unassigned Tickets" ? "bg-orange-100 text-orange-600" :
                                ticket.ticket_status === "Overdue Tickets" ? "bg-red-100 text-red-600" :
                                  ticket.ticket_status === "Closed Tickets" ? "bg-gray-100 text-gray-600" :
                                    "bg-pink-100 text-pink-600"}`}>
                        {ticket.ticket_status.split(' ')[0]}
                      </p>

                      <div className="text-center w-fit text-sm flex items-center gap-1">
                        <BsCalendar />
                        <p className="text-sm">Due: {new Date(ticket.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} </p>
                      </div>




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
