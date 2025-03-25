import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useFrappeAuth } from "frappe-react-sdk";
import { useFrappePostCall, useFrappeFileUpload } from "frappe-react-sdk";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
const TextEditor = ({ editorText, setEditorText, setMessageAdded, messageAdded }) => {
    const { upload } = useFrappeFileUpload();
    const fullName = Cookies.get('full_name');
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const { ticketId } = useParams();
    const { currentUser } = useFrappeAuth();
    const { call: sendMessage } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_description");
    const { call: sendMessageForAttachment } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_description_for_attachment");


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
            sendMessageForAttachment({
                ticket_id: ticketId,
                current_user: currentUser,
                file_url: response.file_url,
                full_name: fullName
            });

        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        setIsTyping(editorText.trim() !== "");
    }, [editorText]);

    const handleSendMessage = () => {
        if (editorText.trim() !== "") {
            sendMessage({
                ticket_id: ticketId,
                message: editorText,
                current_user: currentUser
            }).then((response) => {
                setMessageAdded(messageAdded + 1);
            }).catch((error) => {
                console.error("Error sending message:", error);
            });
            setEditorText("");
        }
    };

    return (
        <div className="card bg-white mt-4 rounded-2xl shadow-md relative p-5">
            <textarea
                className="outline-none"
                value={editorText}
                onChange={(e) => {
                    setEditorText(e.target.value);
                }}
                placeholder="Type a message..."
                style={{ height: '60px', width: '100%' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
            />
            {isTyping && (
                <button
                    className="absolute bottom-2 right-10 bg-[rgb(24,161,161)] text-white p-2 rounded-full"
                    onClick={() => { handleSendMessage() }}
                >
                    <FaPaperPlane />
                </button>
            )}

            <div className="absolute bottom-2 right-20 flex">
                <label htmlFor="file-upload" className="cursor-pointer text-gray-500 hover:text-gray-700">
                    <FaPaperclip className="text-2xl mb-1" />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                            toast.success("File uploaded successfully", {
                                position: "bottom-right",
                                autoClose: 1000,
                            });
                        }
                    }}
                />
                <ToastContainer />
            </div>
        </div>
    )
}

export default TextEditor;
