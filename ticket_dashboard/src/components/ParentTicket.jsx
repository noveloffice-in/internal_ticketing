
import { Link } from "react-router-dom";


const parentTicket = {
    name: ""
}

const ParentTicket = () => {

    return (

        <div className="flex flex-col items-start p-1 border rounded shadow-md bg-white rounded-2xl h-20">
            <div className="w-full p-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-md text-gray-500 font-bold">Parent Ticket</p>
                        {parentTicket.name ? (
                            <p className="text-gray-500 text-xs mt-2">Ticket ID:
                                <Link key={parentTicket.name} to={`/dashboard/tickets/${parentTicket.name}`}>
                                    {parentTicket.name}
                                </Link>
                            </p>
                        ) : <p className="text-gray-500 text-xs mt-2">No parent ticket found</p>
                        }

                    </div>

                </div>

            </div>
        </div>


    )
}

export default ParentTicket;
