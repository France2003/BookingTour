import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion"
const tours = [
    {
        id: 1,
        title: "Du Lịch Đà Nẵng - Hội An - Bà Nà - Cầu Vàng - Suối Khoáng Nóng Thần Tài",
        tour: "Hồ Chí Minh",
        destination: "Hội An - Đà Nẵng",
        vehicle: "Hàng không Vietnam Airlines",
        location: "TP. Hồ Chí Minh",
        duration: "3 ngày 2 đêm",
        price: "6.490.000đ",
        image: "https://saigontourist.net/uploads/destination/TrongNuoc/DaNang/Castles-on-the-hill-Ba-Na-Hills_624658109.jpg",
    },
    {
        id: 2, 
        title: "Du Lịch Động Phong Nha - Đồng Thiên Đường - Huế - Đà Nẵng - Hội An - Bà Nà Hills",
        tour: "Đà Nẵng",
        destination: "Huế - Hội An - Đà Nẵng",
        vehicle: "Hàng không Vietnam Airlines",
        location: "Đà Nẵng",
        duration: "5 ngày 4 đêm",
        price: "12.490.000đ",
        image: "https://saigontourist.net/uploads/destination/TrongNuoc/Quangbinh/Thien-Duong-cave_654445999.jpg",
    },
    {
        id: 3,
        title: "Du Lịch Phan Thiết - Mũi Né - Lâu Đài Rượu Vang - Trung Tâm Bùn Khoáng",
        tour: "Hồ Chí Minh",
        destination: "Phan Thiết",
        vehicle: "Xe tham quan 16, 29, 35, 45",
        location: "TP. Hồ Chí Minh",
        duration: "2 ngày 1 đêm",
        price: "3.590.000đ",
        image: "https://www.saigontourist.net/uploads/destination/TrongNuoc/Phanthiet/Mui-Ne-Beach-Vietnam_380449951.jpg",
    },
    {
        id: 4,
        title: "Du Lịch Hải Phòng – Vịnh Hạ Long – Khám Phá Tàu La Casta 5*",
        tour: "Hải Phòng",
        destination: "Hạ Long",
        vehicle: "Đi về bằng xe",
        location: "Hải Phòng",
        duration: "2 ngày 1 đêm",
        price: "1.890.000đ",
        image: "https://www.saigontourist.net/uploads/destination/TrongNuoc/Halong/Halong-Bay-Vietnam_433429624.jpg",
    },
    {
        id: 5,
        title: "Du Lịch Liên Tuyến Nha Trang - Phú Yên - Quy Nhơn - Hội An - Đà Nẵng - Huế - Măng Đen - Buôn Ma Thuột [Sự Kiện Sinh Nhật 50 Năm]",
        tour: "Hồ Chí Minh",
        destination: "Huế - Tuy Hoà - Quy Nhơn - Đà Nẵng - Nha Trang - Tây Nguyên",
        vehicle: "Đi về bằng xe",
        location: "Hồ Chí Minh",
        duration: "11 ngày 10 đêm",
        price: "13.150.000",
        image: "https://www.saigontourist.net/uploads/destination/TrongNuoc/QuyNhon/EoGio-beach-QuyNhon-BinhDinh-Vietnam-_479390470.jpg",
    },
    {
        id: 6,
        title: "Du Lịch Hà Giang – Đồng Văn – Hồ Ba Bể – Cao Bằng – Bản Giốc – Lạng Sơn [Lễ 30/04]",
        tour: "Hồ Chí Minh",
        destination: "Đông Bắc",
        vehicle: "Hàng không Vietnam Airlines",
        location: "Hồ Chí Minh",
        duration: "6 ngày 5 đêm",
        price: "14.179.000đ",
        image: "https://saigontourist.net/uploads/destination/TrongNuoc/Caobang-BacCan/Ban-Gioc-waterfall-in-Cao-Bang_222378442.jpg",
    },
];

const TourNew = () => {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);
    return (
        <section className="container mx-auto px-6 py-12 relative">
            {/* Phần Giới Thiệu */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}  // Bắt đầu ẩn và dịch xuống 50px
                whileInView={{ opacity: 1, y: 0 }} // Khi vào màn hình, xuất hiện từ dưới lên
                transition={{ duration: 0.8, ease: "easeOut" }} // Hiệu ứng mượt
                viewport={{ once: true }} // Chỉ chạy 1 lần
                className="mb-10 px-[80px]"
            > 
                <h2 className="text-3xl font-bold text-blue-700">
                    Chào mừng bạn đến với Đình Pháp – Cánh cửa mở ra những chuyến hành trình đáng nhớ!
                </h2>
                <hr className="w-[150px] text-[#FD8365] mt-[10px]" />
                <p className="text-gray-700 mt-4 max-w-3xl">
                    Bạn đang tìm kiếm một chuyến đi tuyệt vời để khám phá những điểm đến hấp dẫn? Hãy để Đình Pháp đồng hành cùng bạn!
                    Chúng tôi cung cấp các tour du lịch chất lượng, lịch trình hoạt động, dịch vụ tận tâm và giá cả hợp lý.
                </p>
                <p className="text-gray-700 mt-2">
                    Đặt chuyến tham quan ngay hôm nay và bắt đầu hành trình khám phá thế giới theo cách riêng của bạn!
                </p>
            </motion.div>
            <h3 className="text-3xl font-bold text-center text-blue-600 mb-6">TOUR MỚI 2025</h3>
            <button
                ref={prevRef}
                className="absolute left-[55px] top-[500px] transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-400 transition"
            >
                <FaChevronLeft className="text-xl text-gray-700" />
            </button>

            <motion.div
                initial={{ opacity: 0, y: 50 }}  // Bắt đầu ẩn và dịch xuống 50px
                whileInView={{ opacity: 1, y: 0 }} // Khi vào màn hình, xuất hiện từ dưới lên
                transition={{ duration: 0.8, ease: "easeOut" }} // Hiệu ứng mượt
                viewport={{ once: true }} // Chỉ chạy 1 lần

            >
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={10}
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
                        <SwiperSlide key={tour.id} className="flex mb-5 px-[50px] justify-center">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-[400px] h-[400px] relative">
                                <img src={tour.image} alt={tour.title} className="w-full h-52 object-cover" />
                                <div className="absolute top-3 right-[-3px]  bg-orange-500 opacity-90 text-white text-right text-[13px] font-bold px-3 py-2 rounded-lg shadow-md">
                                    Giá từ <br />
                                    <span className="">{tour.price}</span> <br />
                                    <span className="">{tour.duration}</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between text-gray-600 text-sm italic">
                                        <div>
                                            <p><span className="font-semibold">Tour:</span> {tour.tour}</p>
                                            <p className=" pt-[10px]"><span className="font-semibold">Điểm xuất phát:</span> {tour.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <p><span className="font-semibold">Phương tiện:</span> {tour.vehicle} </p>
                                            <p className="truncate w-[200px] pt-[10px] "><span className="font-semibold">Điểm đến:</span> {tour.destination} </p>
                                        </div>
                                    </div>
                                    <h4 className="text-blue-600 text-[17px]  font-medium mt-2">
                                        {tour.title}
                                    </h4>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>

            <button
                ref={nextRef}
                className="absolute right-[40px] top-[500px] transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-400 transition"
            >
                <FaChevronRight className="text-xl text-gray-700" />
            </button>
        </section>
    );
};

export default TourNew;
