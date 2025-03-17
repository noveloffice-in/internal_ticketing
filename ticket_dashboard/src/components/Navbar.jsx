import { useState } from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="bg-white shadow-md flex flex-col w-full box-border flex-shrink-0 sticky top-0 left-auto right-0 z-[1100] p-4">
            {/* Navbar Content */}
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="text-lg text-black">

                    <span className="font-bold text-black">MyLogo</span>
                </div>

                {/* Profile Icons */}
                <div className="relative flex items-center gap-4">
                    {/* <button className="text-gray-600 text-2xl p-2">
                        <FaBell />
                    </button> */}

                    <button
                        className="text-gray-600 text-2xl p-2 relative"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <FaUserCircle />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-3 w-40 bg-white shadow-lg rounded-md">
                            <ul className="text-gray-700">
                                <li className="px-4 py-3 hover:bg-gray-200 cursor-pointer">Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
