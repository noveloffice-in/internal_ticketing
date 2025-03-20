import React from 'react';
import { useEffect } from 'react';



const Modal = ({ onClose, ticketTimeline }) => {
    
    useEffect(() => {
        // Disable scrolling when modal opens
        document.body.style.overflow = "hidden";
        
        return () => {
            // Enable scrolling when modal closes
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center z-[1300]">
            <div className="p-5 border w-3/5 shadow-lg rounded-md bg-white">
                <h3 className="text-lg leading-6 font-bold text-gray-900 text-left">Ticket Timeline</h3>
                <div className="m-3">
                    {ticketTimeline.length > 0 ? (
                        ticketTimeline.map((entry, index) => {
                            
                            return (
                                <div key={index} className="flex space-x-3 relative">
                                    {/* Timeline Marker (Bullet & Line) */}
                                    

                                    <div className="flex flex-col items-center relative mt-2">
                                        {/* Bullet Point */}
                                        <div className="w-2 h-2 bg-gray-400 rounded-full relative">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full absolute top-1\2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                        </div>

                                        {/* Connecting Line */}
                                        {index < ticketTimeline.length - 1 && (
                                            <div className="w-px flex-grow bg-gray-400 absolute top-0.5" style={{ height: 'calc(100% + 0.5rem)' }}></div>
                                        )}
                                    </div>

                                    {/* Timeline Content */}
                                    <div>
                                        {entry && (
                                            <p className="text-gray-500 text-sm p-1">
                                                <span><b>{entry.user}</b> has changed the status from <b>{entry.pre_status}</b> to <b>{entry.post_status}</b>.</span> on <span className="text-xs text-gray-500"> <b>{entry.date_of_change}</b></span>
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
                <div className="items-right px-4 py-3 flex justify-end">
                    <button
                        className="px-4 py-2 text-black text-base font-medium rounded-md shadow-sm  border border-gray-300"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
