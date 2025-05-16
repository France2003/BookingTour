import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { Helmet } from "react-helmet";

const TourMienTrungPage = () => {
    const [tours, setTours] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const [currentPage, setCurrentPage] = useState<number>(pageParam);

    const toursPerPage = 6;

    useEffect(() => {
        setCurrentPage(pageParam); // đồng bộ page trên URL khi load
    }, [pageParam]);

    const formatCurrency = (amount?: number) =>
        amount ? `${amount.toLocaleString("vi-VN")} VNĐ` : "Đang cập nhật";

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/tours", {
                    params: { region: "mien-nam" },
                });
                setTours(response.data);
            } catch (error) {
                console.error("❌ Error fetching tours for Miền Nam:", error);
            }
        };

        fetchTours();
    }, []);

    // Tính phân trang
    const totalPages = Math.ceil(tours.length / toursPerPage);
    const startIndex = (currentPage - 1) * toursPerPage;
    const currentTours = tours.slice(startIndex, startIndex + toursPerPage);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    return (
        <div className="px-[80px] pt-[650px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Tour Miền Nam</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12 drop-shadow-sm">
                🌄 Tour Du Lịch Miền Nam
            </h1>
            <div className="bg-white p-8 rounded-xl shadow-lg mb-16 text-lg leading-relaxed text-gray-700">
                <p className="mb-3">
                    Khám phá vẻ đẹp phóng khoáng và năng động của miền Nam Việt Nam – nơi có những thành phố sôi động, những khu du lịch sinh thái tuyệt vời và các bãi biển thơ mộng. Đây là nơi giao thoa của các nền văn hóa, với những nét đặc trưng riêng biệt của miền Nam.</p>
                <p>
                    Từ thành phố Hồ Chí Minh hiện đại, với nhịp sống không ngừng nghỉ, đến đồng bằng sông Cửu Long với những cánh đồng mênh mông, hay bãi biển Vũng Tàu tươi đẹp, tour miền Nam sẽ mang đến cho bạn một trải nghiệm đầy thú vị và mới lạ. </p>
            </div>

            {tours.length === 0 ? (
                <p className="text-center text-xl text-gray-500">Không có tour nào ở khu vực này.</p>
            ) : (
                <>
                    <div className="grid gap-10">
                        {currentTours.map((tour, index) => (
                            <motion.div
                                key={tour._id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                    ease: "easeOut",
                                }}
                                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row transition-all duration-300"
                            >
                                <div className="md:w-1/3 relative group">
                                    <img
                                        src={tour.image || "/placeholder-tour.jpg"}
                                        alt={tour.title}
                                        className="w-full h-full object-cover md:h-[280px] transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="md:w-2/3 p-4 flex flex-col justify-between">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div className="md:w-3/4">
                                            <h2 className="text-2xl font-bold text-blue-900 mb-2">{tour.title}</h2>
                                            <p className="text-gray-600 mb-1">🚩 <b>Điểm xuất phát:</b> {tour.location}</p>
                                            <p className="text-gray-600 mb-1">🎯 <b>Điểm đến:</b> {tour.destination}</p>
                                            <p className="text-gray-600 mb-1">🕒 <b>Thời gian:</b> {tour.duration}</p>
                                            <p className="text-gray-600 mb-1">🚗 <b>Phương tiện:</b> {tour.vehicle}</p>
                                            <p className="text-gray-600 mb-1 truncate w-[505px]">{tour.highlights}</p>
                                        </div>
                                        <div className="flex flex-col items-end md:w-1/4 space-y-3 md:mt-0">
                                            <Link
                                                to={`/tour/${tour._id}`}
                                                className="inline-block mt-[10px] bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-sm"
                                            >
                                                Chi tiết
                                            </Link>
                                            <p className="flex items-center border border-[#969696] rounded-xl space-x-2 p-3 text-[#969696]">
                                                <FaCalendarAlt className="text-[#969696]" />
                                                <span>{new Date(tour.startDate).toLocaleDateString("vi-VN")}</span>
                                            </p>
                                            <p className="flex items-center border border-[#969696] rounded-xl space-x-2 p-3 text-[#969696]">
                                                <FaCalendarAlt className="text-[#969696]" />
                                                <span>{new Date(tour.endDate).toLocaleDateString("vi-VN")}</span>
                                            </p>
                                            <p className="text-red-500 font-bold text-[18px]">
                                                <b className="text-gray-600">Giá: </b>{formatCurrency(tour.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* PHÂN TRANG */}
                    <div className="flex justify-center mt-12 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                        >
                            Trang trước
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 rounded-lg font-semibold ${currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-semibold ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TourMienTrungPage;
