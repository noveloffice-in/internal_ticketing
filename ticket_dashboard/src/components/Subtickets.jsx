import { useParams, Link } from "react-router-dom";
import CreateTicketModal from "./CreateTicketModal";
import { useState } from "react";


const Subtickets = ({ subTicketInfo }) => {


    const [showSubtickets, setShowSubtickets] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (

        <div className="flex flex-col items-start p-1 border rounded shadow-md bg-white rounded-md">
            <div className="overflow-y-auto max-h-48 scrollbar-thin w-full p-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-md text-gray-500 font-bold">Subticket</p>
                    </div>
                    <div>
                        <button className="text-2xl text-gray-500" onClick={openModal}>+</button>
                        {isModalOpen && <CreateTicketModal onClick={closeModal} isOpen={isModalOpen} isSubticket={true} />}
                    </div>
                </div>
                {subTicketInfo.map((subticket) => (
                    <Link key={subticket.name} to={`/dashboard/tickets/${subticket.name}`}>
                        <div key={subticket.name} className="flex justify-between items-center mt-2 p-2 border rounded bg-gray-50 w-full cursor-pointer" >

                            <div>
                                <p className="text-gray-700 text-xs font-semibold">{subticket.subject}</p>
                                {/* <p className="text-gray-600 mr-2">{subticket.full_name}</p> */}
                            </div>
                            <div className="flex justify-center items-center text-xs">
                                <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full text-center">{subticket.ticket_status.split(' ')[0]}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>


    )
}

export default Subtickets;
