import { useState, useEffect } from "react";
import { FaFacebook, FaTelegram, FaYoutube, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import NavbarItem from "../NavbarItem";
import Logo from "../../assets/image/logoVisit.png";
import Slide from "../Slides";
import ModalSearch from "../ModelSearch";
import SearchBar from "../Search";
import axios from "axios";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // 👈 Thêm userId
  const navigate = useNavigate();

  const tourRegions = [
    { name: "Tour Miền Bắc", slug: "tour-mien-bac", items: ["Đông Bắc - Tây Bắc", "Hạ Long", "Sapa", "Ninh Bình", "Hà Nội", "Hải Phòng"] },
    { name: "Tour Miền Trung", slug: "tour-mien-trung", items: ["Phan Thiết", "Nha Trang", "Đà Lạt", "Tây Nguyên", "Tuy Hòa - Quy Nhơn - Quảng Ngãi", "Huế - Quảng Bình", "Nghệ An", "Đà Nẵng"] },
    { name: "Tour Miền Nam", slug: "tour-mien-nam", items: ["Miền Tây", "Vũng Tàu", "Cần Thơ", "Phú Quốc", "Côn Đảo", "Tour Tp.Hồ Chí Minh", "Đông Nam Bộ"] },
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/auth/users");
        const foundUser = res.data.find((user: any) => user.email === userEmail);
        if (foundUser) {
          setUserId(foundUser._id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy userId:", error);
      }
    };

    if (userEmail) {
      fetchUserId();
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    navigate("/login");
  };

  return (
    <header>
      {/* Thanh liên hệ trên cùng */}
      <div className="w-full bg-[#A4E5F6] p-[10px] flex justify-between z-[999] items-center text-[15px]">
        <div className="flex items-center z-[999] gap-[25px] pl-[80px]">
          <p className="pt-[3px]">Hotline: 0363977687</p>
          <div className="flex gap-[15px] z-[999] text-[17px]">
            <a href="https://www.facebook.com/phap.bui.315428"><FaFacebook className="text-blue-600" /></a>
            <a href="https://web.telegram.org/"><FaTelegram className="text-blue-600" /></a>
            <a href="http://youtube.com/@phapbui559"><FaYoutube className="text-red-600" /></a>
          </div>
        </div>
        <div className="flex items-center gap-[25px] pr-[80px] text-[15px] relative z-[999]">
          {userEmail ? (
            <>
              <span>{userEmail}</span>
              <button onClick={handleLogout} className="text-red-500">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="pointer-events-auto">Đăng nhập</Link>
              <Link to="/register" className="pointer-events-auto">Đăng ký</Link>
            </>
          )}
        </div>
      </div>

      <div className="nav">
        <div className="bg-black">
          <Slide />
        </div>
        <nav className={`fixed top-0 left-0 w-full transition-all duration-300 ${isSticky ? "bg-white shadow-lg z-[999] text-black py-3" : "bg-transparent text-white py-10"}`}>
          <div className="flex items-center justify-between h-[100px] pl-[80px] pr-[60px]">
            {/* Logo */}
            <div className="w-30 h-30">
              <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
            </div>

            {/* Menu */}
            <ul className={`flex space-x-12 text-lg font-medium ${isSticky ? "text-black" : "text-white"}`}>
              <Link to="/"><NavbarItem label="Trang chủ" /></Link>
              {tourRegions.map((region) => (
                <div key={region.slug} className="relative group" onMouseEnter={() => setActiveDropdown(region.slug)} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link to={`/${region.slug}`}><NavbarItem label={region.name} /></Link>
                  <ul className="absolute left-0 mt-2 bg-white text-black shadow-lg rounded-md w-56 py-2 z-[999] opacity-0 transform scale-95 transition-all duration-300 ease-in-out"
                    style={{ visibility: activeDropdown === region.slug ? "visible" : "hidden", opacity: activeDropdown === region.slug ? 1 : 0 }}
                  >
                    {region.items.map((item, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        <Link
                          to={`/tour/${encodeURIComponent(region.slug)}/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, "-"))}`}
                          className="text-black"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>

                </div>
              ))}
              <Link to="/"><NavbarItem label="Trải nghiệm" /></Link>
              <Link to="/"><NavbarItem label="Liên hệ" /></Link>
            </ul>
            {/* Icon User */}
            <div className="flex space-x-6 text-lg">
              <ModalSearch />
              {userId ? (
                <Link to={`/users/${userId}`}>
                  <FaUser className={`cursor-pointer ${isSticky ? "text-black" : "text-white"}`} />
                </Link>
              ) : (
                <FaUser className={`cursor-pointer ${isSticky ? "text-black" : "text-white"}`} />
              )}
            </div>
          </div>
        </nav>
      </div>

      <div className="relative top-[610px]">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
