import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Buttons = ({ handleStatusChange }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex gap-2 justify-center mt-1">
                <button
                    className="text-black text-md border border-purple-500 rounded-md px-8 py-2"
                    onClick={() => navigate('/')}
                >
                    Close Ticket
                </button>
                
                <div className="relative inline-block">
                    <button
                        className="text-white text-md bg-purple-500 rounded-md px-8 py-2 flex items-center"
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                        Change Status
                        <span className="ml-2">{dropdownVisible ? '▼' : '▲'}</span>
                    </button>

                    {dropdownVisible && (
                        <div className="absolute bottom-full mb-2 right-0 w-80 bg-white border border-gray-300 rounded-md shadow-lg">
                            <ul className="py-1">
                                {[
                                    'Open Ticket',
                                    'Working Ticket',
                                    'On Hold Ticket',
                                    'Solved Ticket',
                                    'Unassigned Ticket',
                                    'Cancel Ticket',
                                    'Needs Approval'
                                ].map((status, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleStatusChange(status);
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        {status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Buttons;
