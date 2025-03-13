import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Searchbar = ( {searchQuery, onSearchQueryChange} ) => {

  return (
    <div className="bg-white shadow-md flex flex-col items-start p-4 rounded-xl">
      <div className="flex items-center w-full">
        <FaSearch className="text-gray-600 mr-2" />
        <input
          className="text-xl text-gray-700 focus:outline-none w-full"
          type="text"
          placeholder="Search Tickets..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>

      
    </div>
  );
};

export default Searchbar;
