import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { Helmet } from "react-helmet";
const TourMienTrungPage = () => {
    const [tours, setTours] = useState<any[]>([]);

    const formatCurrency = (amount?: number) =>
        amount ? `${amount.toLocaleString("vi-VN")} VNĐ` : "Đang cập nhật";

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/tours", {
                    params: { region: "mien-trung" },
                });
                setTours(response.data);
            } catch (error) {
                console.error("❌ Error fetching tours for Miền Trung:", error);
            }
        };

        fetchTours();
    }, []);

    return (
        <div className="px-[80px] pt-[650px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Tour Miền Trung</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12 drop-shadow-sm">
                🌄 Tour Du Lịch Miền Trung
            </h1>
            <div className="bg-white p-8 rounded-xl shadow-lg mb-16 text-lg leading-relaxed text-gray-700">
                <p className="mb-3">
                    Khám phá vẻ đẹp kỳ vĩ của miền Trung Việt Nam – nơi hội tụ những bãi biển hoang sơ, những di sản văn hóa thế giới và những ngọn núi hùng vĩ. Đây là vùng đất kết nối giữa thiên nhiên tươi đẹp và những giá trị lịch sử lâu đời.                </p>
                <p>
                    Từ cố đô Huế với những lăng tẩm, chùa chiền, đến phố cổ Hội An yên bình, hay bãi biển Mỹ Khê quyến rũ, tour miền Trung sẽ đưa bạn đến những điểm đến đầy ấn tượng và trải nghiệm khó quên.                </p>
            </div>
            {tours.length === 0 ? (
                <p className="text-center text-xl text-gray-500">Không có tour nào ở khu vực này.</p>
            ) : (
                <div className="grid gap-10">
                    {tours.map((tour, index) => {
                        const hasDiscount = tour.discount && tour.discount < tour.price;

                        return (
                            <motion.div
                                key={tour._id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                    ease: "easeOut",
                                }}
                                className="bg-white  rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row transition-all duration-300"
                            >
                                <div className="md:w-1/3 relative group">
                                    <img
                                        src={tour.image || "/placeholder-tour.jpg"}
                                        alt={tour.title}
                                        className="w-full h-full object-cover md:h-[280px] transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="md:w-2/3 p-4 flex flex-col justify-between">
                                    {/* Cấu trúc Flexbox để chia cột */}
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div className="md:w-3/4">
                                            <h2 className="text-2xl font-bold text-blue-900 mb-2">{tour.title}</h2>
                                            <p className="text-gray-600 mb-1">🚩 <b>Điểm xuất phát: </b> {tour.location}</p>
                                            <p className="text-gray-600 mb-1">🎯 <b>Điểm đến: </b> {tour.destination}</p>
                                            <p className="text-gray-600 mb-1">🕒 <b>Thời gian: </b> {tour.duration}</p>
                                            <p className="text-gray-600 mb-1">🚗 <b>Phương tiện: </b> {tour.vehicle}</p>
                                            <p className="text-gray-600 mb-1 truncate w-[505px]">{tour.highlights}</p>
                                        </div>
                                        <div className="flex flex-col items-end  md:w-1/4 space-y-3  md:mt-0">
                                            <Link
                                                to={`/tour-mien-bac/${tour.tourCode}`}
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
                                            <p className="text-red-500 font-bold text-[18px]"><b className="text-gray-600">Giá: </b>{formatCurrency(tour.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TourMienTrungPage;
