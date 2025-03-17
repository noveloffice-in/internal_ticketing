import React from 'react';
import { FaTicket, FaTicketSimple, FaCircleCheck, FaRegPaperPlane, FaUserPlus, FaCircleExclamation } from "react-icons/fa6";



const Cards = ({ ticketInfo, onClick }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-[195px] h-[100px] mt-4 cursor-pointer hover:bg-gray-300" onClick={() => onClick(ticketInfo.ticket_status)}>
        <div className='flex items-center justify-between text-gray-600'>
            {ticketInfo.ticket_status}
        </div>
        <div className='flex felx-col items-center justify-between text-2xl font-bold mt-2'>
            <div className='flex items-center justify-between'>
                {ticketInfo.count}
            </div>
            <div className='flex items-center justify-between'>
                {ticketInfo.ticket_status === "Open Tickets" && <div className="bg-blue-200 p-2 rounded-full"><FaTicketSimple color='blue'/></div>}
                {ticketInfo.ticket_status === "Working Tickets" && <div className="bg-pink-100 p-2 rounded-full"><FaTicket color='pink'/></div>}
                {ticketInfo.ticket_status === "Solved Tickets" && <div className="bg-green-100 p-2 rounded-full"><FaCircleCheck color='green'/></div>}
                {ticketInfo.ticket_status === "Sent Tickets" && <div className="bg-purple-100 p-2 rounded-full"><FaRegPaperPlane color='purple'/></div>}
                {ticketInfo.ticket_status === "Unassigned Tickets" && <div className="bg-orange-100 p-2 rounded-full"><FaUserPlus color='orange'/></div>}
                {ticketInfo.ticket_status === "Overdue Tickets" && <div className="bg-red-100 p-2 rounded-full"><FaCircleExclamation color='red'/></div>}
            </div>
        </div>
    </div>
  );
};

export default Cards;

