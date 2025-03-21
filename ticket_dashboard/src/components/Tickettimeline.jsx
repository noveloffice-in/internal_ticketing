import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Timelinemodal from "./Timelinemodal";

const getTimeline = (date) => {
    const today = new Date();
    const entryDate = new Date(date);
    const timeDiff = today - entryDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
        return "Today";
    } else if (daysDiff === 1) {
        return "Yesterday";
    } else {
        return `${daysDiff} days ago`;
    }
}


const TicketTimeline = ({ ticketTimeline }) => {
    const [showTimeline, setShowTimeline] = useState(false);

    return (
        <div>
            <div className="bg-white p-3 shadow-md rounded-2xl w-full">
                <div className="flex justify-between items-center">
                    <p className="text-md text-gray-500 font-bold">Ticket Timeline</p>
                    <span
                        className="text-gray-400 cursor-pointer"
                        onClick={() => setShowTimeline(true)}
                    >
                        ↗
                    </span>
                    {showTimeline && <Timelinemodal onClose={() => setShowTimeline(false)} ticketTimeline={ticketTimeline} />}
                </div>

                <div className="mt-3 overflow-y-auto max-h-30 scrollbar-thin" style={{ maxHeight: '100px' }}>
                    {ticketTimeline.length > 0 ? (
                        ticketTimeline.map((entry, index) => {
                            return (
                                <div key={index} className="flex space-x-3 relative">
                                    {/* Timeline Marker (Bullet & Line) */}
                                    <div className="flex flex-col items-center relative mt-2">
                                        {/* Bullet Point */}
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>

                                        {/* Connecting Line */}
                                        {index < ticketTimeline.length - 1 && (
                                            <div className="w-px flex-grow bg-gray-400 absolute top-0" style={{ height: 'calc(100% + 0.8rem)' }}></div>
                                        )}
                                    </div>

                                    {/* Timeline Content */}
                                    <div>
                                        {entry && (
                                            <p className="text-gray-500 text-sm p-1">
                                                <span>{entry.user} has changed the status from {entry.pre_status} to {entry.post_status}.</span>  <span className="text-xs text-gray-500">{getTimeline(entry.date_of_change)}</span>
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
