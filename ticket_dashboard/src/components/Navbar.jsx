import { useState, useEffect } from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFrappeAuth } from "frappe-react-sdk";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useFrappePostCall } from "frappe-react-sdk";
import { io } from "socket.io-client";
export default function Navbar({ toggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { logout } = useFrappeAuth();
    const navigate = useNavigate();
    const user_id = Cookies.get('user_id');
    const { call: getUserIcon } = useFrappePostCall("internal_ticketing.ticketing_api.get_user_icon");
    const [user_icon, setUserIcon] = useState(null);
    const socket = io(import.meta.env.VITE_REACT_APP_API_URL);
    useEffect(() => {
        console.log("user_id:", user_id);
        getUserIcon({
            user_id: user_id
        }).then((res) => {
            const user_icon = res.message[0].profile;
            setUserIcon(user_icon);
        })
    }, [user_id])

    const handleLogout = () => {
        Cookies.remove('user_id');
        logout();
        navigate("/login");
        window.location.href = "/login";
        socket.disconnect();
    };

    return (
        <div className="bg-white shadow-md flex flex-col w-full box-border flex-shrink-0 sticky top-0 left-auto right-0 z-[1100] p-3">
            {/* Navbar Content */}
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="text-lg text-black">
                    <Link to="/dashboard" className="text-black">
                        <span className="font-bold text-black">
                            <img src="http://10.80.4.63/files/novel%20logo.webp" alt="logo" className="w-12 h-12" />
                        </span>
                    </Link>
                </div>

                {/* Profile Icons */}
                <div className="relative flex items-center gap-4">
                    {/* <button className="text-gray-600 text-2xl p-2">
                        <FaBell />
                    </button> */}

                    <button
                        className="text-gray-600 text-2xl p-2 relative"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(!dropdownOpen);
                            
                            // Add event listener to close when clicking outside
                            if (!dropdownOpen) {
                                setTimeout(() => {
                                    document.addEventListener('click', function closeDropdown(e) {
                                        setDropdownOpen(false);
                                        document.removeEventListener('click', closeDropdown);
                                    });
                                }, 0);
                            }
                        }}
                    >
                        <div className="w-10 h-10 text-center rounded-full flex items-center justify-center text-base text-white bg-[rgb(24,161,161)] mr-2">
                            {user_icon}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-4 top-12 w-40 bg-white shadow-lg rounded-md border-2 border-gray-200 ">
                            <ul className="text-gray-700 flex flex-col gap-2">
                                <li className="px-4 py-3 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
