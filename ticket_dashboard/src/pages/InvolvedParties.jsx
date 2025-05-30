import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import { useFrappeAuth, useFrappePostCall } from "frappe-react-sdk";
import { BiTimeFive } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const SentTicket = () => {
    const { getUserCookie } = useFrappeAuth();
    const [ticketList, setTicketList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketCount, setTicketCount] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState("All Tickets");
    const { call: get_ticket_count_by_department } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_count_by_department");
    const { call: get_ticket_list } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_list");
    const ticketStatusException = ["Cancelled Tickets"]
    const [involvedTicketList, setInvolvedTicketList] = useState([]);
    const [activeCard, setActiveCard] = useState("All Tickets");
    const [userDepartment, setUserDepartment] = useState("");
    const [userPermissionType, setUserPermissionType] = useState("");
    const [messages, setMessages] = useState([]);
    const { ticketId } = useParams();
    const [userLocation, setUserLocation] = useState("");
    Cookies.set(getUserCookie);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const { call: getUserDepartment } = useFrappePostCall("internal_ticketing.ticketing_api.get_user_department");

    const socket = useMemo(() => io(apiUrl), []);

    socket.on("ticket_updated", (updatedTicket) => {
        console.log("🔄 Ticket update received from Node:", updatedTicket);

    });

    socket.on("new_ticket", (newTicket) => {
        console.log("🔄 New ticket received from Node:", newTicket);
    });


    const handleCardClick = (ticketStatus) => {
        setSelectedTicket(ticketStatus);
        setActiveCard(ticketStatus);
    }

    useEffect(() => {
        getUserDepartment({
            user_id: Cookies.get('user_id')
        }).then((res) => {
            setUserDepartment(res['message'][0]['department']);
            setUserPermissionType(res['message'][0]['user_permission_type']);
            getTicketCountByDepartment(userDepartment, userPermissionType, userLocation, Cookies.get('user_id'));
            getTicketList(userDepartment, userPermissionType, userLocation, Cookies.get('user_id'));
        }).catch((err) => {
            console.log("Error", err);
        })
    }, [userDepartment]);

    const getTicketCountByDepartment = (userDepartment, userPermissionType, userLocation, userId) => {
        get_ticket_count_by_department({
            department: userDepartment,
            user_permission_type: userPermissionType,
            user_location: userLocation,
            user_id: userId
        })
            .then((res) => {
                setTicketCount(Object.values(res['message']));
            })
            .catch((err) => {
                console.log("Error", err);
            })
    }

    const getTicketList = (userDepartment, userPermissionType, userLocation, userId) => {
        get_ticket_list({
            department: userDepartment,
            user_permission_type: userPermissionType,
            user_location: userLocation,
            user_id: userId,
        })
            .then((res) => {
                setTicketList(res['message']);
            })
            .catch((err) => {
                console.log("Error", err);
            })
    }

    const { call: get_tickets_for_involved_parties } = useFrappePostCall("internal_ticketing.ticketing_api.get_tickets_for_involved_parties");

    useEffect(() => {
        get_tickets_for_involved_parties({
            department_name: userDepartment
        }).then((data) => {
            setInvolvedTicketList(data);
        });
    }, [userDepartment]);

    return (

        <div className="w-full">
            {/* Searchbar */}
            <div className="w-full flex">
                <div className="w-1/2">
                    <Searchbar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
                </div>
            </div>

            {/* Ticket List */}
            <div className="p-4 shadow-2xl rounded-lg bg-white mt-3">
                <div className="flex justify-between items-center px-4 my-2">
                    <h2 className="text-xl font-bold" >{"Involved Tickets"}</h2>
                </div>
                <hr className="border-gray-200 mt-4" />
                <div className="p-2 rounded-lg bg-white cursor-pointer overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 flex flex-col gap-1 mt-2">
                    {involvedTicketList.message ?
                        (
                            (involvedTicketList.message.map((ticket) => (
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

    );
};

export default SentTicket;


