import React, { useState } from 'react';

const Buttons = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <div>
            <div className="flex gap-2 justify-center mt-1">
                <button className="text-black text-md border border-purple-500 rounded-md px-8 py-2">Close Ticket</button>
                <div className="relative inline-block">
                    <button
                        className="text-white text-md bg-purple-500 rounded-md px-8 py-2 flex items-center"
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                        Send As
                        <span className="ml-2">&#9650;</span>
                    </button>
                    {dropdownVisible && (
                        <div className="absolute bottom-full mb-2 right-0 w-80 bg-white border border-gray-300 rounded-md shadow-lg">
                            <ul className="py-1">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Open Ticket</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Working Ticket</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">On Hold Ticket</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Solved Ticket</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Unassigned Ticket</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cancel Ticket</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Needs Approval</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Buttons;
