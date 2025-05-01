import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    // Xử lý tìm kiếm khi click icon hoặc nhấn Enter
    const handleSearch = () => {
        const trimmedTerm = searchTerm.trim();
        if (trimmedTerm) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(""); // Reset sau khi chuyển trang (tùy bạn)
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative w-full flex justify-center mt-[-30px]">
            <div className="relative w-[90%] md:w-[50%] bg-white shadow-lg rounded-full flex items-center px-4 py-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm tour..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full border-none outline-none text-lg px-3"
                />
                <FaSearch
                    className="text-gray-500 cursor-pointer text-xl hover:text-blue-500"
                    onClick={handleSearch}
                    title="Tìm kiếm"
                />
            </div>
        </div>
    );
};

export default SearchBar;
