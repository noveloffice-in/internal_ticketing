import { useEffect, useState, useRef } from "react";
import { useFrappeAuth, useFrappePostCall } from 'frappe-react-sdk';
import Cookies from 'js-cookie';
import io from "socket.io-client";

const TicketMessages = ({ ticketID }) => {

  const { currentUser } = useFrappeAuth();
  const messagesEndRef = useRef(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const { call: getTicketMessages } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_messages");
  const socket = io("http://10.80.4.63:9001");
  useEffect(() => {
    getTicketMessages({ ticket_id: ticketID }).then((response) => {
      setTicketMessages(response.message);
    });
  }, [ticketID]);

  socket.on("ticket_updated", (updatedTicket) => {
    getTicketMessages({ ticket_id: ticketID }).then((response) => {
      setTicketMessages(response.message);
    });
  });

  return (
    <div>
      <div className="bg-white pt-4 pl-4 rounded-2xl shadow-md" >
        <p className="text-sm text-gray-500">Subject:</p>
        <h1 className="text-2xl text-gray-700 font-bold mb-4">{ticketMessages[1]}</h1>
        <hr></hr>

        <div className="overflow-y-auto rounded-2xl" style={{ maxHeight: '400px', minHeight: '500px' }}>
          {ticketMessages[0] && ticketMessages[0].length > 0 && (
            ticketMessages[0].map((msg, index) => (
              <div key={index} className="p-2 rounded" style={{ minHeight: '100px' }}>
                <div className="flex items-center mb-2">
                  <div className={`flex ${msg.user === currentUser ? 'justify-end' : 'justify-start'} w-full`}>
                    {msg.user !== currentUser && msg.status_change == 0 && msg.is_attachment == 0 && (
                      <div className="w-10 h-10 text-center rounded-full flex items-center justify-center text-base text-white bg-gray-300 mr-2">
                        {msg.profile}
                      </div>
                    )}
                    {msg.status_change == 0 && msg.is_attachment == 0 && (
                      <div className={`flex flex-col ${msg.user === currentUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex">
                          {msg.user === currentUser && (
                            <div className="w-10 h-10 text-center rounded-full flex justify-center items-center text-base text-white bg-[rgb(142,189,189)] ml-2 order-2">
                              {msg.profile}
                            </div>
                          )}
                          <div className={`flex gap-2 mt-2 ${msg.user === currentUser ? 'mr-2 order-1' : 'ml-2'}`}>
                            <p className="text-md text-gray-500 font-bold">{msg.sender}</p>
                          </div>
                        </div>

                        <div className={`p-3 rounded ${msg.user === currentUser ? 'bg-[rgb(208,233,233)] rounded-bl-lg rounded-tl-lg rounded-tr-lg' : 'bg-gray-100 rounded-br-lg rounded-tr-lg rounded-tl-lg'} mt-2 max-w-[50rem]`}>
                          <div className="text-gray-700 ">
                            {msg.status_change == 0
                              ? <p className="text-gray-600 text-lg break-words whitespace-normal overflow-hidden"> {msg.message}</p>
                              : null
                            }
                          </div>
                          {msg.status_change == 0 && (
                            <p className="text-xs text-gray-400 text-right">
                              {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{', '}
                              {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </p>
                          )}

                        </div>


                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {msg.status_change == 1 && msg.is_attachment == 0 && (
                    <p className="text-gray-500 text-sm flex items-center justify-center"> {msg.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  {msg.is_attachment == 1 && msg.status_change == 0 && (
                    <div className="flex items-center justify-center">
                      <p className="text-gray-500 text-sm flex items-center justify-center mr-1">{msg.message}</p>
                      <a href={`http://10.80.4.63/${msg.attachment_url}`} target="_blank" className="text-blue-500 text-sm flex items-center justify-center hover:text-blue-700"> {msg.attachment_url.split('/files/').pop()}</a>
                      <p className="text-gray-500 text-sm flex items-center justify-center ml-1">on</p>
                      <p className="text-gray-500 text-sm flex items-center justify-center ml-1">
                        {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{', '}
                        {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}



          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default TicketMessages;
