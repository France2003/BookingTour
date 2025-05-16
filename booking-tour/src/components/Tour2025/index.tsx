import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";  // Import axios
import { Link } from "react-router-dom";

const TourNew = () => {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const [swiperInstance] = useState<any>(null);
    const [tours, setTours] = useState<any[]>([]); // State to store tours fetched from the API

    // Fetch tours from the API using axios
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/tours", {
                    params: { isFeatured: true } // Send `isFeatured=true` as a query parameter
                });
                setTours(response.data); // Update state with the fetched tours
            } catch (error) {
                console.error("Error fetching tours:", error);
            }
        };
        fetchTours();
    }, []); // Run once when the component mounts

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    return (
        <section className="container px-[150px] mx-auto  py-12 relative">
            <motion.div
                initial={{ opacity: 0, y: 50 }}  // Bắt đầu ẩn và dịch xuống 50px
                whileInView={{ opacity: 1, y: 0 }} // Khi vào màn hình, xuất hiện từ dưới lên
                transition={{ duration: 0.8, ease: "easeOut" }} // Hiệu ứng mượt
                viewport={{ once: true }} // Chỉ chạy 1 lần
                className="mb-10 "
            >
                <h2 className="text-3xl font-bold text-blue-700">
                    Chào mừng bạn đến với Đình Pháp – Cánh cửa mở ra những chuyến hành trình đáng nhớ!
                </h2>
                <hr className=" text-[#FD8365] mt-[10px]" />
                <p className="text-gray-700 mt-4 max-w-3xl">
                    Bạn đang tìm kiếm một chuyến đi tuyệt vời để khám phá những điểm đến hấp dẫn? Hãy để Đình Pháp đồng hành cùng bạn!
                    Chúng tôi cung cấp các tour du lịch chất lượng, lịch trình hoạt động, dịch vụ tận tâm và giá cả hợp lý.
                </p>
                <p className="text-gray-700 mt-2">
                    Đặt chuyến tham quan ngay hôm nay và bắt đầu hành trình khám phá thế giới theo cách riêng của bạn!
                </p>
            </motion.div>
            <h3 className="text-3xl font-bold text-center text-blue-600 mb-6">TOUR NỔI BẬT</h3>
            <button
                ref={prevRef}
                className="absolute left-[130px] top-[500px] transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-400 transition"
            >
                <FaChevronLeft className="text-xl text-gray-700" />
            </button>

            <motion.div
                initial={{ opacity: 0, y: 50 }}  // Bắt đầu ẩn và dịch xuống 50px
                whileInView={{ opacity: 1, y: 0 }} // Khi vào màn hình, xuất hiện từ dưới lên
                transition={{ duration: 0.8, ease: "easeOut" }} // Hiệu ứng mượt
                viewport={{ once: true }} 
            >
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    loop={true}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-10"
                >
                    {tours.map((tour) => (
                        <SwiperSlide key={tour.id} className="flex mb-5 justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}  // Hình ảnh bắt đầu mờ và nhỏ
                                whileInView={{ opacity: 1, scale: 1 }} // Hình ảnh phóng to và mờ dần
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="bg-white shadow-lg  rounded-lg overflow-hidden w-[410px] h-[450px] relative group"
                            >
                                <div className="overflow-hidden rounded-t-lg">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="w-full h-[250px] object-cover transform transition duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-115"
                                    />
                                </div>

                                <div className="absolute top-3 right-[-3px] bg-orange-400 opacity-95 text-white text-right text-[13px] font-bold px-3 py-2 rounded-lg shadow-md">
                                    Giá từ <br />
                                    <span>{Number(tour.price).toLocaleString("vi-VN")} VNĐ</span> <br />
                                    <span>{tour.duration}</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between text-gray-600 text-sm italic">
                                        <div className="flex flex-col space-y-3 w-[48%]"> {/* Chiếm gần nửa chiều rộng */}
                                            <p className="w-full truncate "><span className="font-semibold ">Tour:</span> {tour.tour}</p>
                                            <p className="w-full truncate"><span className="font-semibold">Điểm xuất phát:</span> {tour.location}</p>
                                        </div>
                                        <div className="flex flex-col space-y-3 w-[48%]">
                                            <p className="w-full truncate"><span className="font-semibold">Phương tiện:</span> {tour.vehicle}</p>
                                            <p className="w-full truncate"><span className="font-semibold">Điểm đến:</span> {tour.destination}</p>
                                        </div>
                                    </div>
                                    <Link to={`/tour/${tour._id}`} className="block mt-4">
                                        <motion.h4
                                            initial={{ opacity: 0, y: 20 }}  // Tiêu đề bắt đầu ẩn và dịch lên
                                            whileInView={{ opacity: 1, y: 0 }}  // Tiêu đề hiện lên
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="text-blue-600 text-[17px] font-medium mt-2 text-ellipsis   overflow-hidden"
                                        >
                                            {tour.title}
                                        </motion.h4>
                                    </Link>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>

            <button
                ref={nextRef}
                className="absolute right-[130px] top-[500px] transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-400 transition"
            >
                <FaChevronRight className="text-xl text-gray-700" />
            </button>
        </section>
    );
};

export default TourNew;
