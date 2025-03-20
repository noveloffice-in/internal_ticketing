import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import TicketMessages from "../components/Ticketmessages";
import TicketSubDetails from "../components/Ticketsubdetails";
import Subtickets from "../components/Subtickets";
import TicketTimeline from "../components/Tickettimeline";
import TextEditor from "../components/Texteditor";
import Ticketbuttons from "../components/Ticketbuttons";
import { useState, useEffect } from "react";
import { useFrappePostCall } from "frappe-react-sdk";
import ParentTicket from "../components/ParentTicket";

const TicketDetails = () => {
    const { ticketId } = useParams();

    const [ticketSubDetails, setTicketSubDetails] = useState([]);
    const [subTicketInfo, setSubTicketInfo] = useState([]);
    const [ticketTimeline, setTicketTimeline] = useState([]);
    const [ticketMessages, setTicketMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editorText, setEditorText] = useState("");
    const [finalMessage, setFinalMessage] = useState(null);

    const { call: getTicketSubDetails } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_sub_details");
    const { call: getSubTicketInfo } = useFrappePostCall("internal_ticketing.ticketing_api.get_sub_ticket_info");
    const { call: getTicketTimeline } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_timeline");
    const { call: getTicketMessages } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_messages");


    const getTicketSubDetailsfunc = (ticketId) => {
        return getTicketSubDetails({ ticket_id: ticketId });
    };

    const getSubTicketInfofunc = (ticketId) => {
        return getSubTicketInfo({ ticket_id: ticketId });
    };

    const getTicketTimelinefunc = (ticketId) => {
        return getTicketTimeline({ ticket_id: ticketId });
    };

    const getTicketMessagesfunc = (ticketId) => {
        return getTicketMessages({ ticket_id: ticketId });
    };

    useEffect(() => {

        setIsLoading(true);

        const fetchData = async () => {
            try {
                const [subDetailsRes, subTicketInfoRes, timelineRes, messagesRes] = await Promise.all([
                    getTicketSubDetailsfunc(ticketId),
                    getSubTicketInfofunc(ticketId),
                    getTicketTimelinefunc(ticketId),
                    getTicketMessagesfunc(ticketId)
                ]);

                setTicketSubDetails(subDetailsRes.message);
                setSubTicketInfo(subTicketInfoRes.message);
                setTicketTimeline(timelineRes.message);
                setTicketMessages(messagesRes.message);

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
        <div>
            <Link to="/dashboard" className="mt-4 inline-block">
                <FaArrowLeft className="mr-2" />
            </Link>


            <div className="flex">

                <div className="w-5/6 p-2 mt-2">
                    <TicketMessages ticketMessages={ticketMessages} />
                    <TextEditor editorText={editorText} setEditorText={setEditorText} setFinalMessage={setFinalMessage}/>
                </div>

                <div className="w-1/4 p-1 flex flex-col gap-3 mt-3">
                    <TicketSubDetails ticketSubDetails={ticketSubDetails} />
                    <ParentTicket />
                    <Subtickets subTicketInfo={subTicketInfo} parentTicketId={ticketId}/>
                    <TicketTimeline ticketTimeline={ticketTimeline} />
                </div>

            </div>
        </div>

    );
};

export default TicketDetails;
