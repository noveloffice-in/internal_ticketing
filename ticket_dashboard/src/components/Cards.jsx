import React from 'react';
import { FaTicket, FaTicketSimple, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { PiFoldersFill, PiUserCirclePlusDuotone } from "react-icons/pi";    
import { BsStopCircleFill, BsQuestionOctagonFill } from "react-icons/bs";


const Cards = ({ ticketInfo, onClick, activeCard }) => {

    const isActive = activeCard === ticketInfo.ticket_status;

    return (
        <div className={`shadow-md rounded-xl p-4 w-[195px] h-[100px] mt-4 cursor-pointer hover:bg-gray-300 ${isActive ? "bg-blue-200" : 'bg-white'}`} onClick={() => onClick(ticketInfo.ticket_status)}>
            <div className='flex items-center justify-between text-gray-600'>
                {ticketInfo.ticket_status}
            </div>
            <div className='flex felx-col items-center justify-between text-2xl font-bold mt-2'>
                <div className='flex items-center justify-between'>
                    {ticketInfo.count}
                </div>
                <div className='flex items-center justify-between'>
                    {ticketInfo.ticket_status === "All Tickets" && <div className="bg-purple-200 p-2 rounded-full"><PiFoldersFill color='purple' /></div>}
                    {ticketInfo.ticket_status === "Open Tickets" && <div className="bg-blue-200 p-2 rounded-full"><FaTicketSimple color='blue' /></div>}
                    {ticketInfo.ticket_status === "Working Tickets" && <div className="bg-pink-100 p-2 rounded-full"><FaTicket color='pink' /></div>}
                    {ticketInfo.ticket_status === "Solved Tickets" && <div className="bg-green-100 p-2 rounded-full"><FaCircleCheck color='green' /></div>}
                    {ticketInfo.ticket_status === "Unassigned Tickets" && <div className="bg-orange-100 p-2 rounded-full"><PiUserCirclePlusDuotone color='orange' /></div>}
                    {ticketInfo.ticket_status === "Overdue Tickets" && <div className="bg-red-100 p-2 rounded-full"><FaCircleExclamation color='red' /></div>}
                    {ticketInfo.ticket_status === "On-Hold Tickets" && <div className="bg-gray-100 p-2 rounded-full"><BsStopCircleFill color='gray' /></div>}
                    {ticketInfo.ticket_status === "Needs Verification" && <div className="bg-purple-100 p-2 rounded-full"><BsQuestionOctagonFill color='purple' /></div>}
                </div>
            </div>
        </div>
    );
};

export default Cards;

