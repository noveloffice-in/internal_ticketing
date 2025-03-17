import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFrappeAuth } from 'frappe-react-sdk';

const TicketMessages = ({ ticketMessages, finalMessage }) => {
  const { currentUser } = useFrappeAuth();
  console.log("ticketing:", ticketMessages);
  const [messagesArray, setMessagesArray] = useState([]);

  useEffect(() => {
    if (finalMessage) {
      setMessagesArray((prevMessages) => [...prevMessages, finalMessage]);
    }
    
  }, [finalMessage]);

  return (
    <div>
      <div className="bg-white pt-4 pl-4 rounded-lg shadow-md overflow-y-auto" style={{ maxHeight: '400px', minHeight: '500px' }}>
        <p className="text-sm text-gray-400">Subject:</p>
        <h1 className="text-2xl font-bold mb-4">{ticketMessages[1]}</h1>
        <hr></hr>
        <div>

          {ticketMessages[0].length === 0 ? (
            <div className="p-2 rounded" style={{ height: '100%' }}></div>
          ) : (
            ticketMessages[0].map((msg, index) => (
              <div key={index} className="p-2 rounded" style={{ minHeight: '100px' }}>
                <div className="flex items-center mb-2">
                  {msg.sender === ticketMessages[0].assignee ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2 mt-2 text-white bg-[rgb(138,89,226,0.28)]">
                      {ticketMessages[0].profile}
                    </div>) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2 mt-2 text-white bg-gray-300">
                      {ticketMessages[0].profile}
                    </div>
                  )}
                  <p className="font-bold text-gray-800">{msg.sender}</p>
                  <p className="text-sm text-gray-500 ml-2">{new Date(msg.date).toLocaleDateString('en-GB')} {new Date(msg.date).toLocaleTimeString()}</p>
                </div>
                <div className={`p-3 rounded m-2 ml-10 rounded-b-lg ${msg.sender === ticketMessages[0].sender ? 'bg-[rgb(138,89,226,0.28)]' : 'bg-gray-100'}`}>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              </div>
            ))
          )}


          {messagesArray.map((msg, index) => (
            <div key={index} className="p-2 rounded" style={{ minHeight: '100px' }}>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2 mt-2 text-white bg-[rgb(138,89,226,0.28)]">
                  {ticketMessages.profile}
                </div>
                <p className="font-bold text-gray-800">{currentUser}</p>
                <p className="text-sm text-gray-500 ml-2">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="p-3 rounded m-2 ml-10 rounded-b-lg bg-[rgb(138,89,226,0.28)]">
                <p className="text-gray-700">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default TicketMessages;

