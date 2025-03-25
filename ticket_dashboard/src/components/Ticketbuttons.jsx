import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeFileUpload, useFrappePostCall, useFrappeAuth } from 'frappe-react-sdk';
import Cookies from 'js-cookie';

const TicketButtons = ({ fileUrl, setFileUrl }) => {
    const { ticketId } = useParams();
    const [isUploading, setIsUploading] = useState(false);
    const { upload } = useFrappeFileUpload();
    const { call: update_ticket_status } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_status");
    const { currentUser } = useFrappeAuth();
    const full_name = Cookies.get('full_name');

    const handleFileUpload = async (file) => {
        if (!file) return;

        setIsUploading(true);
        try {
            const fileArgs = {
                isPrivate: 0,
                folder: 'Home',
                doctype: 'Internal Tickets',
                docname: ticketId,
                file_url: ""
            };

            // Remove the progress callback to avoid CORS issues
            const response = await upload(file, fileArgs);


            setFileUrl(response.file_url);
            console.log('File uploaded successfully', response.file_url);

        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    };

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
                    className="text-white text-md bg-[rgb(24,161,161)] rounded-md px-8 py-2 flex items-center"
                    onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                handleFileUpload(file);
                                console.log('File selected:', file.name);
                            }
                        };
                        fileInput.click();
                    }}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Attach File'}
                </button>

                <button
                    className="text-black text-md border border-[rgb(24,161,161)] rounded-md px-5 py-2"
                    onClick={() => {
                        console.log(full_name);
                        const status = 'Solved Tickets'
                        closeTicket(ticketId, status);
                    }}
                >
                    Close Ticket
                </button>

            </div>
        </div>
    );
};

export default TicketButtons;
