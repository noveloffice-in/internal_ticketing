import { Link } from "react-router-dom";
import { FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div
            className={`bg-white box-shadow-lg text-black overflow-y-auto flex flex-col h-full z-[1200] fixed top-0 left-0 transition-all duration-300 ${isOpen ? "w-[270px]" : "w-[60px]"}`}
        >
            <nav className="flex flex-col gap-4 p-4">
                {/* Toggle Sidebar Button */}
                <FaBars
                    onClick={toggleSidebar}
                    className="cursor-pointer font-bold text-2xl text-black"
                />

                {/* Sidebar Links */}
                {[
                    { icon: FaSignOutAlt, text: "Login", path: "/login" },
                    { icon: FaUser, text: "Profile", path: "/profile" },
                    { icon: FaSignOutAlt, text: "Logout", path: "/logout" },
                ].map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="flex items-center gap-4 p-2 mt-2 rounded-lg cursor-pointer hover:bg-gray-700 transition font-bold"
                    >
                        <item.icon size={30} />
                        {isOpen && <span>{item.text}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
