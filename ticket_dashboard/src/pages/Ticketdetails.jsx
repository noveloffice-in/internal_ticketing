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
        console.log("id = ", ticketId);

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
                console.log("Error:", err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [ticketId]);

    console.log("ticketMessages = ", ticketMessages);
    console.log("ticketSubDetails = ", ticketSubDetails);
    console.log("subTicketInfo = ", subTicketInfo);
    console.log("ticketTimeline = ", ticketTimeline);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Stores text from TextEditor
    //   const [selectedStatus, setSelectedStatus] = useState("");  // Stores selected status

    //   const [subticketMessages, setSubticketMessages] = useState([]);
    //   const handleStatusChange = (status) => {
    //     if (editorText.trim() !== "") {
    //       setFinalMessage({ status, message: editorText });
    //     }
    //     setSelectedStatus(status);
    //     setEditorText("");
    //   };


      if (!ticketMessages) return <p className="text-center text-red-600">Ticket not found</p>;

    return (
        <div>
            <Link to="/dashboard" className="mt-4 inline-block">
                <FaArrowLeft className="mr-2" />
            </Link>


            <div className="flex">

                <div className="w-3/4 p-2 mt-2">
                    <TicketMessages ticketMessages={ticketMessages} finalMessage={finalMessage} />
                    <TextEditor editorText={editorText} setEditorText={setEditorText} setFinalMessage={setFinalMessage}/>
                </div>

                <div className="w-1/4 p-1 flex flex-col gap-2 mt-3">
                    <TicketSubDetails ticketSubDetails={ticketSubDetails} />
                    < Subtickets subTicketInfo={subTicketInfo} />
                    <TicketTimeline ticketTimeline={ticketTimeline} />
                    {/* <Ticketbuttons handleStatusChange={handleStatusChange} /> */}
                </div>

            </div>
        </div>

    );
};

export default TicketDetails;
