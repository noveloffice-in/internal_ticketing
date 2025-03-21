import React, { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useFrappeAuth } from "frappe-react-sdk";
import { useFrappePostCall } from "frappe-react-sdk";

const TextEditor = ({ editorText, setEditorText }) => {
    const [isTyping, setIsTyping] = useState(false);
    const {ticketId} = useParams();
    const { currentUser } = useFrappeAuth();
    const { call: sendMessage } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_description");

    useEffect(() => {
        setIsTyping(editorText.trim() !== "");
    }, [editorText]);

    const handleSendMessage = () => {
        if (editorText.trim() !== "") {
            console.log("editorText", editorText);
            sendMessage({
                ticket_id: ticketId,
                message: editorText,
                current_user: currentUser
            }).then((response) => {
            }).catch((error) => {
                console.error("Error sending message:", error);
            });
        }
        setEditorText("");
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
                style={{ height: '150px', width: '100%' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
            />
            {isTyping && (
                <button
                    className="absolute bottom-2 right-2 bg-purple-500 text-white p-2 rounded-full"
                    onClick={() => { handleSendMessage()}}
                >
                    <FaPaperPlane />
                </button>
            )}
        </div>
    )
}

export default TextEditor;
