import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeFileUpload, useFrappePostCall } from 'frappe-react-sdk';

const TicketButtons = ({ fileUrl, setFileUrl }) => {
    const { ticketId } = useParams();
    const [isUploading, setIsUploading] = useState(false);
    const { upload } = useFrappeFileUpload();
    const { call: closeTicket } = useFrappePostCall("internal_ticketing.ticketing_api.close_ticket");

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



    return (
        <div>
            <div className="flex gap-2 mt-1">
                <button
                    className="text-white text-md bg-purple-500 rounded-md px-8 py-2 flex items-center"
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
                    className="text-black text-md border border-purple-500 rounded-md px-5 py-2"
                    onClick={() => {
                        const closeTicket = {
                            ticket_id: ticketId,
                            status: 'Closed'
                        }
                        console.log(closeTicket);
                    }}
                >
                    Close Ticket
                </button>

            </div>
        </div>
    );
};

export default TicketButtons;
