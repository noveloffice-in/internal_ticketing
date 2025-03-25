import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import TicketMessages from "../components/Ticketmessages";
import TicketSubDetails from "../components/Ticketsubdetails";
import Subtickets from "../components/Subtickets";
import TicketTimeline from "../components/Tickettimeline";
import TextEditor from "../components/Texteditor";
import { useState, useEffect } from "react";
import { useFrappePostCall } from "frappe-react-sdk";   
import TicketButtons from "../components/Ticketbuttons";
import Button from "../components/Button";



const TicketDetails = () => {
    const { ticketId } = useParams();


    const [ticketSubDetails, setTicketSubDetails] = useState([]);
    const [subTicketInfo, setSubTicketInfo] = useState([]);
    const [ticketTimeline, setTicketTimeline] = useState([]);
    const [ticketMessages, setTicketMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editorText, setEditorText] = useState("");
    const [parentTicket, setParentTicket] = useState([]);
    const [fileUrl, setFileUrl] = useState("");
    const [messageAdded, setMessageAdded] = useState(0);

 
    const { call: getTicketSubDetails } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_sub_details");
    const { call: getSubTicketInfo } = useFrappePostCall("internal_ticketing.ticketing_api.get_sub_ticket_info");
    const { call: getTicketTimeline } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_timeline");
    const { call: getTicketMessages } = useFrappePostCall("internal_ticketing.ticketing_api.get_ticket_messages");
    const { call: getParentTicket } = useFrappePostCall("internal_ticketing.ticketing_api.get_parent_ticket");

    
    useEffect(() => {

        setIsLoading(true);

        const fetchData = async () => {
            try {
                setIsLoading(true);

                const ticketSubDetailsData = await getTicketSubDetails({ ticket_id: ticketId });
                setTicketSubDetails(ticketSubDetailsData.message);

                const subTicketInfoData = await getSubTicketInfo({ ticket_id: ticketId });
                setSubTicketInfo(subTicketInfoData.message);

                const ticketTimelineData = await getTicketTimeline({ ticket_id: ticketId });
                setTicketTimeline(ticketTimelineData.message);

                const ticketMessagesData = await getTicketMessages({ ticket_id: ticketId });
                setTicketMessages(ticketMessagesData.message);

                const parentTicketData = await getParentTicket({ ticket_id: ticketId });
                setParentTicket(parentTicketData.message);

                setIsLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [ticketId, messageAdded]);

    // useEffect(() => {
    //     console.log(messageAdded);
    //     const ticketMessagesData = getTicketMessages({ ticket_id: ticketId });
    //     setTicketMessages(ticketMessagesData.message);
    // }, [messageAdded]);


    if (isLoading) {
        return <div>Loading...</div>;
    }


      if (!ticketMessages) return <p className="text-center text-red-600">Ticket not found</p>;

    return (
        <div>
            {/* <Link to="/dashboard" className="mt-4 inline-block">
                <FaArrowLeft className="mr-2" />
            </Link> */}


            <div className="flex">

                <div className="w-5/6 p-2 mt-2">
                    <TicketMessages ticketMessages={ticketMessages}/>
                    <TextEditor editorText={editorText} setEditorText={setEditorText} setMessageAdded={setMessageAdded} messageAdded={messageAdded}/>
                </div>

                <div className="w-1/4 p-1 flex flex-col gap-3 mt-3">
                    <TicketSubDetails ticketSubDetails={ticketSubDetails} />
                    <Subtickets compHeader={"Parent Ticket"} suborParentTicketInfo={parentTicket}/>
                    <Subtickets compHeader={"Subtickets"} suborParentTicketInfo={subTicketInfo} parentTicketId={ticketId}/>
                    <TicketTimeline ticketTimeline={ticketTimeline} />
                    <TicketButtons fileUrl={fileUrl} setFileUrl={setFileUrl}/>
                </div>

            </div>
        </div>

    );
};

export default TicketDetails;
