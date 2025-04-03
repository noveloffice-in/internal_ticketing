import { Link } from "react-router-dom";
import { FaBars, FaHistory, FaPaperPlane } from "react-icons/fa";
import { BsFillTicketFill } from "react-icons/bs";
import { IoTicketSharp } from "react-icons/io5";

import { useEffect } from "react";

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div
            className={`bg-white box-shadow-lg text-black overflow-y-auto flex flex-col h-full z-[1200] fixed top-4 left-0 transition-all duration-300 ${isOpen ? "w-[270px]" : "w-[60px]"}`}
        >
            <nav className="flex flex-col gap-4 p-4">
                {/* Toggle Sidebar Button */}
                <FaBars
                    onClick={toggleSidebar}
                    className="cursor-pointer font-bold text-black"
                    size={20}
                />
                

                {/* Sidebar Links */}
                
                {[
                    { icon: BsFillTicketFill, size: 20, text: "View Ticket", path: "/dashboard/view_tickets" },
                    { icon: FaPaperPlane, size: 20, text: "Sent Tickets", path: "/dashboard/sent_tickets" },
                    { icon: FaHistory, size: 20, text: "Ticket History", path: "/dashboard/ticket_history" },
                    { icon: IoTicketSharp, size: 20, text: "Involved Parties", path: "/dashboard/involved_parties" }
                ].map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="flex text-lg items-center gap-4 p-2 mt-2 rounded-lg cursor-pointer hover:bg-[rgb(177,216,216)] hover:text-white transition font-bold"
                    >
                        <item.icon size={30} />
                        {isOpen && <span>{item.text}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
