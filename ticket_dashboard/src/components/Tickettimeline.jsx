import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Timelinemodal from "./Timelinemodal";



const TicketTimeline = ({ ticketTimeline }) => {
    const [showTimeline, setShowTimeline] = useState(false);

    return (
        <div>
            <div className="bg-white p-3 shadow-md rounded-lg w-full">
                <div className="flex justify-between items-center">
                    <p className="text-gray-800 font-semibold text-lg">Ticket Timeline :</p>
                    <span
                        className="text-gray-400 cursor-pointer"
                        onClick={() => setShowTimeline(true)}
                    >
                        ↗
                    </span>
                    {showTimeline && <Timelinemodal onClose={() => setShowTimeline(false)} ticketTimeline={ticketTimeline} />}
                </div>



                <div className="mt-3 overflow-y-auto max-h-30 scrollbar-thin" style={{ maxHeight: '120px' }}>
                    {ticketTimeline.length > 0 ? (
                        ticketTimeline.map((entry, index) => {
                            console.log("entry = ", entry);
                            return (
                                <div key={index} className="flex space-x-3 relative">
                                    {/* Timeline Marker (Bullet & Line) */}
                                    <div className="flex flex-col items-center absolute left-0 top-0 mt-2">
                                        {/* Bullet Point */}
                                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
                                    </div>

                                    {/* Timeline Content */}
                                    <div>
                                        {entry && (
                                            <p className="text-gray-500 text-sm p-1">
                                                <span>{entry.user} has changed the status from {entry.pre_status} to {entry.post_status}.</span> on <span className="text-xs text-gray-500">{entry.date_of_change}</span>
                                            </p>
                                        )}

                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-sm">No timeline updates yet.</p>
                    )}
                </div>


            </div>
        </div>
    )
}

export default TicketTimeline;
