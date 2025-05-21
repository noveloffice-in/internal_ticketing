import { useParams, Link } from "react-router-dom";
import CreateTicketModal from "./CreateTicketModal";
import { useState, useEffect, useMemo } from "react";
import { BsCalendar } from "react-icons/bs";
import { useFrappePostCall } from "frappe-react-sdk";
import io from "socket.io-client";
import { FaChevronDown } from "react-icons/fa";
import TicketCreation from "./TicketCreation";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;


const Subtickets = ({ compHeader, ticketID, parentTicketId }) => {
    const socket = useMemo(() => io(apiUrl), []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [suborParentTicketInfo, setSuborParentTicketInfo] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { call: getSubTicketInfo } = useFrappePostCall("internal_ticketing.ticketing_api.get_sub_ticket_info");
    const { call: getParentTicketInfo } = useFrappePostCall("internal_ticketing.ticketing_api.get_parent_ticket");

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    }

    useEffect(() => {
        if (compHeader === "Subtickets") {
            getSubTicketInfo({ ticket_id: ticketID }).then((response) => {
                setSuborParentTicketInfo(response.message);
            });
        }

        if (compHeader === "Parent Ticket") {
            getParentTicketInfo({ ticket_id: ticketID }).then((response) => {
                setSuborParentTicketInfo(response.message);
            });
        }
    }, [ticketID]);

    socket.on("ticket_updated", (data) => {
        if (compHeader === "Subtickets") {
            getSubTicketInfo({ ticket_id: ticketID }).then((response) => {
                setSuborParentTicketInfo(response.message);
            });
        }

        if (compHeader === "Parent Ticket") {
            getParentTicketInfo({ ticket_id: ticketID }).then((response) => {
                setSuborParentTicketInfo(response.message);
            });
        }
    });

    return (

        <div>
            <div className="hidden md:block">
                <div className="flex flex-col items-start p-1 border-none rounded shadow-md bg-white rounded-2xl">
                    <div className="w-full p-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-md text-gray-500 font-bold">{compHeader}</p>
                            </div>
                            <div>
                                {parentTicketId && <button className="text-2xl text-gray-500" onClick={openModal}>+</button>}
                                {isModalOpen && <CreateTicketModal onClick={closeModal} isOpen={isModalOpen} isSubticket={true} parentTicketId={parentTicketId} />}
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-30 scrollbar-thin mt-2" style={{ maxHeight: '140px' }}>
                            {suborParentTicketInfo && suborParentTicketInfo.map((subticket) => (
                                <Link key={subticket.name} to={`/dashboard/tickets/${subticket.name}`}>
                                    <div className="items-center p-2 border-none rounded bg-gray-50 w-full cursor-pointer mb-2" >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-col gap-1">
                                                <p className="text-gray-700 text-xs font-semibold text-left">{subticket.subject.length > 35 ? `${subticket.subject.substring(0, 35)}...` : subticket.subject}</p>
                                                <p className="text-gray-600 mr-2 text-left text-sm mt-1">{subticket.assigned_to_name}</p>
                                            </div>
                                            <div className="w-fit">
                                                <div className="flex justify-end">
                                                    <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full ">{subticket.ticket_status.split(' ')[0]}</span>
                                                </div>
                                                {subticket.due_date && (
                                                    <p className="flex items-center text-xs text-gray-500 mt-1 justify-end">
                                                        <BsCalendar className="mr-1 text-xs" /> Due: {new Date(subticket.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="block md:hidden">
                <div className="flex flex-col items-start p-1 border-none rounded shadow-md bg-white rounded-2xl">
                    <div className="w-full p-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-md text-gray-500 font-bold">{compHeader}</p>
                            </div>

                            <div className="cursor-pointer mt-0 flex items-center gap-2">
                                {parentTicketId && <button className="text-md text-black-800" onClick={openModal}>+</button>}
                                {isModalOpen && <TicketCreation onClick={closeModal} isOpen={isModalOpen} isSubticket={true} parentTicketId={parentTicketId} />}
                                <FaChevronDown
                                    onClick={handleCollapse}
                                    className={`text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-y-auto max-h-30 scrollbar-thin mt-2" style={{ maxHeight: '140px' }}>
                                {suborParentTicketInfo && suborParentTicketInfo.map((subticket) => (
                                    <Link key={subticket.name} to={`/dashboard/tickets/${subticket.name}`}>
                                        <div className="items-center p-2 border-none rounded bg-gray-50 w-full cursor-pointer mb-2" >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-col gap-1">
                                                    <p className="text-gray-700 text-xs font-semibold text-left">{subticket.subject.length > 35 ? `${subticket.subject.substring(0, 35)}...` : subticket.subject}</p>
                                                    <p className="text-gray-600 mr-2 text-left text-sm mt-1">{subticket.assigned_to_name}</p>
                                                </div>
                                                <div className="w-fit">
                                                    <div className="flex justify-end">
                                                        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full ">{subticket.ticket_status.split(' ')[0]}</span>
                                                    </div>
                                                    {subticket.due_date && (
                                                        <p className="flex items-center text-xs text-gray-500 mt-1 justify-end">
                                                            <BsCalendar className="mr-1 text-xs" /> Due: {new Date(subticket.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>



        </div>

    )
}

export default Subtickets;
