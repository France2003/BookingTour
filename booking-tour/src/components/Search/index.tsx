// import React from 'react'
import { FaSearch } from "react-icons/fa";
const SearchBar = () => {
    return (
        <div className="relative w-full flex justify-center mt-[-30px]">
            <div className="relative w-[50%] bg-white shadow-lg rounded-full flex items-center px-4 py-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full border-none outline-none text-lg px-3"
                />
                <FaSearch className="text-gray-500 cursor-pointer text-xl" />
            </div>
        </div>
    )
}

export default SearchBar