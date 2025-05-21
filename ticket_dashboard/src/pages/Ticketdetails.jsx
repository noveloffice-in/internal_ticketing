import { useParams } from "react-router-dom";
import TicketMessages from "../components/Ticketmessages";
import TicketSubDetails from "../components/Ticketsubdetails";
import Subtickets from "../components/Subtickets";
import TicketTimeline from "../components/Tickettimeline";
import TextEditor from "../components/Texteditor";
import { useState, useEffect, useMemo } from "react";
import { useFrappePostCall } from "frappe-react-sdk";
import TicketButtons from "../components/Ticketbuttons";
import { FaArrowLeft } from "react-icons/fa";
import io from "socket.io-client";


const TicketDetails = () => {
    const { ticketId } = useParams();

    const [ticketMessages, setTicketMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editorText, setEditorText] = useState("");
    const [messageAdded, setMessageAdded] = useState(0);

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const { call: getTicketMessages } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_messages");

    const socket = useMemo(() => io(apiUrl), []);
    


    useEffect(() => {
        // Initial data fetch
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const ticketMessagesData = await getTicketMessages({ ticket_id: ticketId });
                setTicketMessages(ticketMessagesData.message);

                setIsLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setIsLoading(false);
            }
        };

        fetchData();

    }, [ticketId]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!ticketMessages) return <p className="text-center text-red-600">Ticket not found</p>;

    return (
        <div >
            {/* <Link to="/dashboard" className="mt-4 inline-block">
                <FaArrowLeft className="mr-2" />
            </Link> */}
            <div className="hidden md:block">

                <div className="flex">

                    <div className="w-5/6 p-2 mt-2">
                        <TicketMessages ticketID={ticketId} />
                        <TextEditor editorText={editorText} setEditorText={setEditorText} setMessageAdded={setMessageAdded} messageAdded={messageAdded} />
                    </div>

                    <div className="w-1/4 p-1 flex flex-col gap-3 mt-3">
                        <TicketSubDetails ticketID={ticketId} />
                        <Subtickets compHeader={"Parent Ticket"} ticketID={ticketId} />
                        <Subtickets compHeader={"Subtickets"} ticketID={ticketId} parentTicketId={ticketId} />
                        <TicketTimeline ticketID={ticketId} />
                        <TicketButtons previousStatus={ticketMessages[0].ticket_status} />
                    </div>

                </div>
            </div>

            <div className="block md:hidden">

                <div className="flex w-full">
                    <div className="w-full p-1 flex flex-col gap-3 mt-3">
                        <TicketSubDetails ticketID={ticketId} />
                        <Subtickets compHeader={"Parent Ticket"} ticketID={ticketId} />
                        <Subtickets compHeader={"Subtickets"} ticketID={ticketId} parentTicketId={ticketId} />
                        <TicketTimeline ticketID={ticketId} />

                        <TicketMessages ticketID={ticketId} />
                        <TextEditor editorText={editorText} setEditorText={setEditorText} setMessageAdded={setMessageAdded} messageAdded={messageAdded} />
                        {/* <TicketButtons previousStatus={ticketMessages[0].ticket_status} /> */}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default TicketDetails;
