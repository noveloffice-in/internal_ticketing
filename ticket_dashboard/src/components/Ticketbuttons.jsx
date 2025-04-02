import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappePostCall, useFrappeAuth } from 'frappe-react-sdk';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const TicketButtons = ({ previousStatus }) => {
    const { ticketId } = useParams();
    const { call: close_ticket_status } = useFrappePostCall("internal_ticketing.ticketing_api.close_ticket_status");
    const { currentUser } = useFrappeAuth();
    const full_name = Cookies.get('full_name');

    const { call: get_all_attachments } = useFrappePostCall("internal_ticketing.ticketing_api.get_all_attachments");
    const [attachments, setAttachments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [closeTicket, setCloseTicket] = useState(false);
    useEffect(() => {
        get_all_attachments({
            ticket_id: ticketId
        }).then((data) => {
            setAttachments(data);
        });

        close_ticket_status({
            ticket_id: ticketId,
            status: "Solved Tickets"
        }).then((data) => {
            setCloseTicket(data);
            console.log("data", data);
        });
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            // Disable scrolling when modal opens
            document.body.style.overflow = "hidden";
        } else {
            // Enable scrolling when modal closes
            document.body.style.overflow = "auto";
        }

        return () => {
            // Ensure scrolling is enabled when component unmounts
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);


    return (
        <div>
            <div className="flex gap-2 mt-1">
                <button
                    className="text-white text-md bg-[rgb(24,161,161)] rounded-md px-5 py-2 flex items-center"
                    onClick={() => {
                        console.log("attachments", attachments);
                        setIsModalOpen(true);
                    }}
                >
                    Attach File
                </button>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center z-[1300]">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-1/2 relative">
                            <h2 className="text-xl font-semibold mb-4">Attachments</h2>
                            <div>
                                {attachments.message && attachments.message.length > 0 ? (
                                    attachments.message.map((attachment, index) => (
                                        <div key={index} className="flex py-2">
                                            <p className="text-gray-500 text-sm flex items-center justify-center mr-1">{attachment.message}</p>
                                            <a href={`http://10.80.4.63/${attachment.attachment_url}`} target="_blank" className="text-blue-500 text-sm flex items-center justify-center hover:text-blue-700"> {attachment.attachment_url.split('/files/').pop()}</a>
                                            <p className="text-gray-500 text-sm flex items-center justify-center ml-1">on</p>
                                            <p className="text-gray-500 text-sm flex items-center justify-center ml-1">
                                                {new Date(attachment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{', '}
                                                {new Date(attachment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex py-2">
                                        <p className="text-gray-500 text-sm flex items-center justify-center">No attachments found</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="text-black text-2xl font-medium rounded-md shadow-sm absolute top-7 right-10"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    x
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    className="text-black text-md border border-[rgb(24,161,161)] rounded-md px-5 py-2"
                    onClick={() => {
                        const status = 'Solved Tickets'
                        console.log("closeTicket", closeTicket);
                        toast.success("Ticket closed successfully", {
                            position: "bottom-right",
                            autoClose: 1000,
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
