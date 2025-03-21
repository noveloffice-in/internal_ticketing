import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useFrappeAuth } from 'frappe-react-sdk';

const TicketMessages = ({ ticketMessages, fileUrl }) => {
  const { currentUser } = useFrappeAuth();
  const [messagesArray, setMessagesArray] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => { 
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }1  
  }, [messagesArray]);

  return (
    <div>
      <div className="bg-white pt-4 pl-4 rounded-2xl shadow-md" >
        <p className="text-sm text-gray-500">Subject:</p>
        <h1 className="text-2xl text-gray-700 font-bold mb-4">{ticketMessages[1]}</h1>
        <hr></hr>

        <div className="overflow-y-auto rounded-2xl" style={{ maxHeight: '400px', minHeight: '500px' }}>
          {ticketMessages[0].length === 0 ? (
            <div className="p-2 rounded" style={{ height: '100%' }}></div>
          ) : (
            ticketMessages[0].map((msg, index) => (
              <div key={index} className="p-2 rounded" style={{ minHeight: '100px' }}>
                <div className="flex items-center mb-2">
                  <div className={`flex ${msg.user === currentUser ? 'justify-end' : 'justify-start'} w-full`}>
                    {msg.user !== currentUser && (
                      <div className="w-10 h-10 text-center rounded-full flex items-center justify-center text-base text-white bg-gray-300 mr-2">
                        {msg.profile}
                      </div>
                    )}

                    <div className={`flex flex-col ${msg.user === currentUser ? 'items-end' : 'items-start'}`}>
                      <div className="flex">
                        {msg.user === currentUser && (
                          <div className="w-10 h-10 text-center rounded-full flex justify-center items-center text-base text-white bg-[rgb(138,89,226,0.28)] ml-2 order-2">
                            {msg.profile}
                          </div>
                        )}
                        <div className={`flex gap-2 mt-2 ${msg.user === currentUser ? 'mr-2 order-1' : 'ml-2'}`}>
                          <p className="text-md text-gray-500 font-bold">{msg.sender}</p>
                        </div>
                      </div>

                      <div className={`p-3 rounded ${msg.user === currentUser ? 'bg-[rgb(138,89,226,0.28)] rounded-bl-lg rounded-tl-lg rounded-tr-lg' : 'bg-gray-100 rounded-br-lg rounded-tr-lg rounded-tl-lg'} mt-2 max-w-[50rem]`}>
                        <p className="text-gray-700">{msg.message}</p>
                        {msg.file_url && (
                          <div className="mt-2">
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                              {msg.file_url.split('/').pop()}
                            </a>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 text-right">
                          {new Date(msg.date).toLocaleDateString('en-US', {  month: 'short', day: 'numeric' })}{', '}
                          {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {fileUrl && (
            <div className="p-4 border-t">
              <p className="text-sm font-medium text-gray-600">Attached File:</p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {fileUrl.split('/').pop()}
              </a>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default TicketMessages;
