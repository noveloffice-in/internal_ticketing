import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import { FaPaperPlane } from "react-icons/fa";

const TextEditor = ({ editorText, setEditorText, setFinalMessage }) => {
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setIsTyping(editorText.trim() !== "");
    }, [editorText]);

    const handleSendMessage = () => {
        if (editorText.trim() !== "") {
            setFinalMessage({ message: editorText });
        }
        setEditorText("");
    };

    return (
        <div className="card bg-white mt-4 rounded-md shadow-md border-none relative">
            <textarea
                value={editorText}
                onChange={(e) => {
                    setEditorText(e.target.value);
                }}
                placeholder="Type a message..."
                style={{ height: '150px', width: '100%' }}
            />
            {isTyping && (
                <button
                    className="absolute bottom-2 right-2 bg-purple-500 text-white p-2 rounded-full"
                    onClick={handleSendMessage}
                >
                    <FaPaperPlane />
                </button>
            )}
        </div>
    )
}

export default TextEditor;
