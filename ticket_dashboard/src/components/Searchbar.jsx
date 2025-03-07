import React from "react";
import { FaSearch } from "react-icons/fa";

const Searchbar = () => {
  return (
    <div className="bg-white shadow-md flex items-center pr-10 pl-3 py-3 rounded-xl">
      <FaSearch className="text-gray-600 mr-2" />
      <input className="text-xl text-gray-700 focus:outline-none" type="text" placeholder="Search Tickets..." />
    </div>
  );
};

export default Searchbar;