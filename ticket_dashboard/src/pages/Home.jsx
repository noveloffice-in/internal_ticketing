import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import Button from "../components/Button";
import Cards from "../components/Cards";
import { Toaster, toast } from 'react-hot-toast';
import CreateTicketModal from "../components/CreateTicketModal";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { useFrappeAuth, useFrappePostCall } from "frappe-react-sdk";
import { BiTimeFive } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import TicketCreation from "../components/TicketCreation";
import CarouselSpacing from "../components/SlidingCard";


const Home = () => {
  const { getUserCookie } = useFrappeAuth();
  const [ticketCount, setTicketCount] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("All Tickets");
  const { call: get_ticket_count_by_department } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_count_by_department");
  const { call: get_ticket_list } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_list");
  const ticketStatusException = ["Cancelled Tickets"]
  const [activeCard, setActiveCard] = useState("All Tickets");
  const [userDepartment, setUserDepartment] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userPermissionType, setUserPermissionType] = useState("");
  const [messages, setMessages] = useState([]);
  const { ticketId } = useParams();
  Cookies.set(getUserCookie);
  const { call: getUserDepartment } = useFrappePostCall("internal_ticketing.ticketing_api.get_user_department");
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const socket = useMemo(() => io(apiUrl), []);


  socket.on("ticket_updated", (updatedTicket) => {
    console.log("🔄 Ticket update received from Node:", updatedTicket);
    if (userDepartment && userLocation && userPermissionType) {
      getTicketCountByDepartment(userDepartment, userLocation, userPermissionType, Cookies.get('user_id'));
      getTicketList(userDepartment, userLocation, userPermissionType, Cookies.get('user_id'));
    }
  });

  socket.on("new_ticket", (newTicket) => {
    console.log("🔄 New ticket received from Node:", newTicket);
    if (userDepartment && userLocation && userPermissionType) {
      getTicketCountByDepartment(userDepartment, userLocation, userPermissionType, Cookies.get('user_id'));
      getTicketList(userDepartment, userLocation, userPermissionType, Cookies.get('user_id'));
    }
  });



  const audio = new Audio("../../public/notification.mp3");

  useEffect(() => {
    const userId = Cookies.get("user_id");

    socket.on("connect", () => {
      const userId = Cookies.get("user_id");
      if (userId) {
        socket.emit("register", userId);
        console.log("🔗 Registered user:", userId);
      }
    });

    socket.on("ticket_notification", (ticketNotification) => {
      console.log("🔄 Ticket notification received from Node:", ticketNotification['target_users']);
      ticketNotification['target_users'].forEach(user => {
        if (user === userId) {
          toast.success(`A new ticket was created by ${user}`);
          audio.play().catch(error => {
            console.error("Error playing audio:", error);
          });
        }
      });
    });
  }, [])


  useEffect(() => {
    getUserDepartment({
      user_id: Cookies.get('user_id')
    }).then((res) => {
      setUserDepartment(res['message'][0]['department']);
      setUserLocation(res['message'][0]['user_location']);
      setUserPermissionType(res['message'][0]['user_permission_type']);
      getTicketCountByDepartment(userDepartment, userLocation, userPermissionType, Cookies.get('user_id'));
      getTicketList(userDepartment, userLocation, userPermissionType, Cookies.get('user_id'));
    }).catch((err) => {
      console.log("Error", err);
    })
  }, [userDepartment]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getTicketCountByDepartment = (userDepartment, userLocation, userPermissionType, userId) => {
    get_ticket_count_by_department({
      department: userDepartment,
      user_location: userLocation,
      user_permission_type: userPermissionType,
      user_id: userId
    })
      .then((res) => {
        setTicketCount(Object.values(res['message']));
      })
      .catch((err) => {
        console.log("Error", err);
      })
  }

  const getTicketList = (userDepartment, userLocation, userPermissionType, userId) => {
    get_ticket_list({
      department: userDepartment,
      user_location: userLocation,
      user_permission_type: userPermissionType,
      user_id: userId
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
      {/* Desktop View */}
      <div className="hidden md:block">

        {/* <Toaster position="top-right" /> */}
        <div className="w-full flex">
          <div className="w-1/2">
            <Searchbar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
          </div>
          <div className="w-1/2 flex justify-end gap-2">
            <Button text="Create Ticket" onClick={openModal} className="bg-[rgb(24,161,161)] text-white p-4 flex items-center justify-center shadow-lg rounded-2xl" />
            {isModalOpen && <CreateTicketModal onClick={closeModal} isOpen={isModalOpen} isSubticket={false} />}
          </div>
        </div>

        {/* Ticket Cards */}
        <div className='flex gap-4 w-full flex-wrap'>
          {ticketCount.map((category, index) => (
            !ticketStatusException.includes(category.ticket_status) && (
              <div key={index} >
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
            <h2 className="text-xl font-bold" >{selectedTicket ? selectedTicket : "All Tickets List"}</h2>
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
                      className="border-2 border-gray-200 p-4 mb-2 rounded hover:bg-[rgb(177,216,216)] flex justify-between items-start rounded-2xl"
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
                        <p className={`rounded-2xl text-center py-1 px-4 w-fit text-sm 
                      ${ticket.ticket_status === "Open" ? "bg-blue-200 text-red-600" :
                            ticket.ticket_status === "Working Tickets" ? "bg-pink-100 text-green-600" :
                              ticket.ticket_status === "Solved Tickets " ? "bg-green-100 text-green-600" :
                                ticket.ticket_status === "Sent Tickets" ? "bg-purple-100 text-purple-600" :
                                  ticket.ticket_status === "Unassigned Tickets" ? "bg-orange-100 text-orange-600" :
                                    ticket.ticket_status === "Overdue Tickets" ? "bg-red-100 text-red-600" :
                                      ticket.ticket_status === "Closed Tickets" ? "bg-purple-100 text-gray-600" :
                                        ticket.ticket_status === "On-Hold Tickets" ? "bg-gray-100 text-gray-600" :
                                          ticket.ticket_status === "Needs Verification" ? "bg-purple-100 text-purple-600" :
                                            "bg-pink-100 text-pink-600"}`}>
                          {ticket.ticket_status.split('Tickets')[0]}
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

      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="w-full overflow-auto h-[calc(100vh+2rem)]">
          <div className="w-full flex">
            <div className="w-full">
              <Searchbar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
            </div>
          </div>

          <div className="w-full flex justify-center items-center mt-4">
            <CarouselSpacing ticketInfo={ticketCount} onClick={(ticketStatus) => {
              handleCardClick(ticketStatus);
              setActiveCard(ticketStatus);
            }} />
          </div>

          {/* Ticket Cards */}
          {/* <div className='flex gap-4 flex-col w-full flex-wrap'>
            {ticketCount.map((category, index) => (
              !ticketStatusException.includes(category.ticket_status) && (
                <div key={index} className="w-full">
                  <Cards ticketInfo={category} activeCard={activeCard} onClick={(ticketStatus) => {
                    handleCardClick(ticketStatus);
                    setActiveCard(ticketStatus);
                  }} />
                </div>
              )
            ))}
          </div> */}

          {/* Ticket List */}
          <div className="p-4 shadow-2xl rounded-lg bg-white mt-4">
            <div className="flex justify-between items-center px-4 my-2">
              <h2 className="text-xl font-bold" >{selectedTicket ? selectedTicket : "All Tickets List"}</h2>
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
                        className="border-2 border-gray-200 p-4 mb-2 rounded hover:bg-[rgb(177,216,216)] flex justify-between items-start rounded-2xl"
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
                          <p className={`rounded-2xl text-center py-1 px-4 w-fit text-sm 
                      ${ticket.ticket_status === "Open" ? "bg-blue-200 text-red-600" :
                              ticket.ticket_status === "Working Tickets" ? "bg-pink-100 text-green-600" :
                                ticket.ticket_status === "Solved Tickets " ? "bg-green-100 text-green-600" :
                                  ticket.ticket_status === "Sent Tickets" ? "bg-purple-100 text-purple-600" :
                                    ticket.ticket_status === "Unassigned Tickets" ? "bg-orange-100 text-orange-600" :
                                      ticket.ticket_status === "Overdue Tickets" ? "bg-red-100 text-red-600" :
                                        ticket.ticket_status === "Closed Tickets" ? "bg-purple-100 text-gray-600" :
                                          ticket.ticket_status === "On-Hold Tickets" ? "bg-gray-100 text-gray-600" :
                                            ticket.ticket_status === "Needs Verification" ? "bg-purple-100 text-purple-600" :
                                              "bg-pink-100 text-pink-600"}`}>
                            {ticket.ticket_status.split('Tickets')[0]}
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

          {/* Floating Action Button for Mobile */}
          <div className="fixed bottom-20 right-5">
            <Button
              onClick={openModal}
              className="bg-[rgb(24,161,161)] text-white w-14 h-14 flex items-center justify-center shadow-lg mr-0 !important"
            />
          </div>
          {isModalOpen && <TicketCreation onClick={closeModal} isOpen={isModalOpen} isSubticket={false} />}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
