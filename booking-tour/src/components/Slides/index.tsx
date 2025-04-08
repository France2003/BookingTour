import { useState, useEffect } from "react";
import HaLong from "../../assets/image/Ha Long bay_561711448.jpg";
import BanGioc from "../../assets/image/Ban-Gioc-waterfall-in-Cao-Bang_222378442.jpg";
import PhuQuoc from "../../assets/image/phu-quoc-beach_788218267.jpg";
import HoiAn from "../../assets/image/street-view-of-Hoi-An_1063328627.jpg";
import { FaSearch } from "react-icons/fa";
// import Search from "../Search";

const slides = [
    {
        image: HaLong,
        title: "MIỀN BẮC",
        subtitle: "GIỖ TỔ HÙNG VƯƠNG",
        date: "Khởi hành: 04/04/2025",
    },
    {
        image: HoiAn,
        title: "MIỀN TRUNG",
        subtitle: "DU LỊCH HỘI AN",
        date: "Khởi hành: 10/05/2025",
    },
    {
        image: PhuQuoc,
        title: "MIỀN NAM",
        subtitle: "DU LỊCH PHÚ QUỐC",
        date: "Khởi hành: 15/06/2025",
    },
    {
        image: BanGioc,
        title: "ĐÔNG BẮC - TÂY BẮC",
        subtitle: "DU LỊCH HÀ GIANG",
        date: "Khởi hành: 20/07/2025",
    },
];

const Slide = () => {
    const [index, setIndex] = useState(0);

    // Tự động chuyển slide mỗi 5 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="absolute w-full h-[600px]  overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${slides[index].image})` }}
                >
                    <div className="absolute inset-0 bg-black opacity-45"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-start p-10 text-white">
                    <div key={index} className="p-6 max-w-md animate-slideDown">
                        <h2 className="text-5xl font-bold">{slides[index].title}</h2>
                        <p className="text-2xl mt-2">{slides[index].subtitle}</p>
                        <p className="mt-2">{slides[index].date}</p>
                        <button className="mt-4 px-6 py-2 bg-[#e36e00] font-semibold text-white rounded-lg">
                            Xem thêm
                        </button>
                    </div>
                </div>
                <div className="absolute top-1/2 right-5 transform -translate-y-1/2 flex gap-4">
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className={`w-[120px] h-[180px] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer ${i === index ? "scale-110 border-4 border-white" : "opacity-80"
                                }`}
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: "cover",
                            }}
                            onClick={() => setIndex(i)}
                        ></div>
                    ))}
                </div>
                <div className="flex items-center  border border-gray-300 rounded-lg px-3 py-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm...."
                        className="flex-1 outline-none border-none  text-lg"
                    />
                    <FaSearch className="text-gray-500 cursor-pointer text-xl" />
                </div>
                <style>
                    {`
                        @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        }
                        .animate-slideDown {
                        animation: slideDown 0.8s ease-out;
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default Slide;
