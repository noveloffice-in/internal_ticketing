import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappePostCall, useFrappeAuth } from 'frappe-react-sdk';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const TicketButtons = () => {
    const { ticketId } = useParams();
    const { call: update_ticket_status } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_status");
    const { currentUser } = useFrappeAuth();
    const full_name = Cookies.get('full_name');

    

    const closeTicket = async (ticketId, status) => {
        await update_ticket_status({ticket_id: ticketId, status: status, current_user: currentUser, full_name: full_name}).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            <div className="flex gap-2 mt-1">
                <button
                    className="text-white text-md bg-[rgb(24,161,161)] rounded-md px-5 py-2 flex items-center"
                    onClick={() => {
                    }}
                >
                    Attach File
                </button>

                <button
                    className="text-black text-md border border-[rgb(24,161,161)] rounded-md px-5 py-2"
                    onClick={() => {
                        console.log(full_name);
                        const status = 'Solved Tickets'
                        closeTicket(ticketId, status);
                        toast.success("Ticket closed successfully", {
                            position: "bottom-right",
                        });
                    }}
                >
                    Close Ticket
                </button>
                <ToastContainer />
            </div>
        </div>
    );
};

export default TicketButtons;
