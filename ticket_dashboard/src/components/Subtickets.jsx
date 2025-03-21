import { useParams, Link } from "react-router-dom";
import CreateTicketModal from "./CreateTicketModal";
import { useState } from "react";
import { BsCalendar } from "react-icons/bs";


const Subtickets = ({ compHeader, suborParentTicketInfo, parentTicketId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (

        <div className="flex flex-col items-start p-1 border rounded shadow-md bg-white rounded-2xl">
            <div className="w-full p-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-md text-gray-500 font-bold">{compHeader}</p>
                    </div>
                    <div>
                        {parentTicketId && <button className="text-2xl text-gray-500" onClick={openModal}>+</button>}
                        {isModalOpen && <CreateTicketModal onClick={closeModal} isOpen={isModalOpen} isSubticket={true} parentTicketId={parentTicketId} />}
                    </div>
                </div>
                <div className="overflow-y-auto max-h-30 scrollbar-thin mt-2" style={{ maxHeight: '140px' }}>
                    {suborParentTicketInfo && suborParentTicketInfo.map((subticket) => (
                        <Link key={subticket.name} to={`/dashboard/tickets/${subticket.name}`}>
                            <div className="items-center p-2 border rounded bg-gray-50 w-full cursor-pointer mb-2" >
                                <div className="flex justify-between items-start">
                                    <div className="flex-col gap-1">
                                        <p className="text-gray-700 text-xs font-semibold text-left">{subticket.subject.length > 35 ? `${subticket.subject.substring(0, 35)}...` : subticket.subject}</p>
                                        <p className="text-gray-600 mr-2 text-left text-sm mt-1">{subticket.assigned_to_name}</p>
                                    </div>
                                    <div className="w-fit">
                                        <div className="flex justify-end">
                                            <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full ">{subticket.ticket_status.split(' ')[0]}</span>
                                        </div>
                                        {subticket.due_date && (
                                            <p className="flex items-center text-xs text-gray-500 mt-1 justify-end">
                                                <BsCalendar className="mr-1 text-xs" /> Due: {new Date(subticket.due_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>


    )
}

export default Subtickets;
