import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex bg-gray-200">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[270px]" : "ml-[60px]"}`}>
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Content */}
                <div className="p-4 bg-gray-100 min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
