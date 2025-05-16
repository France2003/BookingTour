import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✨ import thêm

type Region = "Bac" | "Trung" | "TayNguyen" | "DongNamBo" | "TayNamBo";

const destinations: Record<Region, { name: string; image: string }[]> = {
    Bac: [
        { name: "Hà Nội", image: "https://saigontourist.net/media/private/PIgm7G/6bcM7M/69138d5d.jpg.thumb/375x250.jpg" },
        { name: "Hạ Long", image: "https://saigontourist.net/media/private/PIgm7G/W4A5xh/2d4496a8.jpg.thumb/375x250.jpg" },
        { name: "Hà Giang", image: "https://saigontourist.net/media/upload/2025/4/18/a756bc07.jpg.thumb/375x250.jpg" },
        { name: "Ninh Bình", image: "https://saigontourist.net/media/upload/2025/4/18/53310779.jpg.thumb/375x250.jpg" },
        { name: "Sa Pa", image: "https://saigontourist.net/media/upload/2025/4/19/8b910f34.jpg.thumb/375x250.jpg" },
        { name: "Mộc Châu", image: "https://saigontourist.net/media/upload/2025/4/18/0afca7b1.jpg.thumb/375x250.jpg" },
        { name: "Sơn La", image: "https://saigontourist.net/media/upload/2025/4/18/a0430dfb.jpg.thumb/375x250.jpg" },
        { name: "Điện Biên", image: "https://saigontourist.net/media/upload/2025/4/18/b79490fd.jpg.thumb/375x250.jpg" },
    ],
    Trung: [
        { name: "Huế", image: "https://saigontourist.net/media/upload/2025/4/18/b4e42f13.jpg.thumb/375x250.jpg" },
        { name: "Đà Nẵng", image: "https://saigontourist.net/media/upload/2025/4/18/388a306d.jpg.thumb/375x250.jpg" },
        { name: "Hội An", image: "https://saigontourist.net/media/upload/2025/4/18/37082391.jpg.thumb/375x250.jpg" },
        { name: "Quy Nhơn", image: "https://saigontourist.net/media/upload/2025/4/20/dab19d99.jpg.thumb/375x250.jpg" },
        { name: "Mũi Né", image: "https://saigontourist.net/media/private/PIgm7G/3lZNxT/aaa4cf38.jpg.thumb/375x250.jpg" },
        { name: "Nha Trang", image: "https://saigontourist.net/media/private/PIgm7G/hu4iWV/217f215c.jpg.thumb/375x250.jpg" },
        { name: "Quảng Bình", image: "https://saigontourist.net/media/upload/2025/4/18/0d3e87fb.jpg.thumb/375x250.jpg" },
        { name: "Vĩnh Hý", image: "https://saigontourist.net/media/upload/2025/4/18/1a8e82b9.jpg.thumb/375x250.jpg" },
    ],
    DongNamBo: [
        { name: "TP. Hồ Chí Minh", image: "https://saigontourist.net/media/upload/2025/4/18/39e42646.jpeg.thumb/375x250.jpeg" },
        { name: "Vũng Tàu", image: "https://saigontourist.net/media/upload/2025/4/18/dc0d070b.jpg.thumb/375x250.jpg" },
        { name: "Côn Đảo", image: "https://saigontourist.net/media/upload/2025/4/18/78750e22.jpeg.thumb/375x250.jpeg" },
        { name: "Bình Châu", image: "https://saigontourist.net/media/upload/2025/4/18/ed3b3cf5.jpg.thumb/375x250.jpg" },
        { name: "Phước Hải", image: "https://saigontourist.net/media/upload/2025/4/18/fcdfe027.jpg.thumb/375x250.jpg" },
        { name: "Long Hải", image: "https://saigontourist.net/media/upload/2025/4/18/efeeba1b.jpg.thumb/375x250.jpg" },
        { name: "Hồ Tràm", image: "https://saigontourist.net/media/upload/2025/4/18/9175c988.jpg.thumb/375x250.jpg" },
        { name: "Tây Ninh", image: "https://saigontourist.net/media/upload/2025/4/18/21ecdb08.jpg.thumb/375x250.jpg" },
    ],
    TayNguyen: [
        { name: "Đà Lạt", image: "https://saigontourist.net/media/upload/2025/4/18/1c548ec6.jpeg.thumb/375x250.jpeg" },
        { name: "Buôn Ma Thuột", image: "https://saigontourist.net/media/upload/2025/4/19/473a51cb.jpg.thumb/375x250.jpg" },
        { name: "Kon Tum", image: "https://saigontourist.net/media/upload/2025/4/18/ab15ecaf.jpg.thumb/375x250.jpg" },
        { name: "PleiKu", image: "https://saigontourist.net/media/upload/2025/4/18/669475bd.jpg.thumb/375x250.jpg" },
        { name: "Măng Đen", image: "https://saigontourist.net/media/upload/2025/4/18/f6348917.jpg.thumb/375x250.jpg" },
        { name: "Tà Đùng", image: "https://saigontourist.net/media/upload/2025/4/18/63b8ce0f.jpg.thumb/375x250.jpg" },
        { name: "Đắk Nông", image: "https://saigontourist.net/media/upload/2025/4/19/ed32f4aa.jpg.thumb/375x250.jpg" },
        { name: "Bảo Lộc", image: "https://saigontourist.net/media/upload/2025/4/18/8c1d08ad.jpg.thumb/375x250.jpg" },
    ],
    TayNamBo: [
        { name: "Phú Quốc", image: "https://saigontourist.net/media/upload/2025/4/19/33a8a70b.jpg.thumb/375x250.jpg" },
        { name: "Cà Mau", image: "https://saigontourist.net/media/upload/2025/4/19/cd5e5ea1.jpg.thumb/375x250.jpg" },
        { name: "Cần Thơ", image: "https://saigontourist.net/media/upload/2025/4/19/dd81df32.png.thumb/375x250.png" },
        { name: "Châu Đốc", image: "https://saigontourist.net/media/upload/2025/4/18/45253f73.jpg.thumb/375x250.jpg" },
        { name: "Tiền Giang", image: "https://saigontourist.net/media/upload/2025/4/19/d073a5ac.jpg.thumb/375x250.jpg" },
        { name: "Hà Tiên", image: "https://saigontourist.net/media/upload/2025/4/18/4c56c24c.jpg.thumb/375x250.jpg" },
        { name: "Rạch Giá", image: "https://saigontourist.net/media/upload/2025/4/19/d2f8ce0b.jpg.thumb/375x250.jpg" },
        { name: "Vĩnh Long", image: "https://saigontourist.net/media/upload/2025/4/20/b53e1a1e.jpg.thumb/375x250.jpg" },
    ],
};

export default function DestinationTabs() {
    const [region, setRegion] = useState<Region>("Bac");

    return (
        <div className="px-[150px] mt-5 pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <h2 className="text-2xl font-bold mb-3 text-[#0069AD] text-center">
                ĐIỂM DU LỊCH HẤP DẪN
            </h2>
            <p className="text-center mb-6 text-[14px]">
                DinhPhaptourist luôn có những sản phẩm đến các điểm du lịch hấp dẫn trải dài dọc suốt mảnh đất hình chữ S và khắp năm châu.
                Du khách có thể chọn một điểm đến du lịch hấp dẫn để khám phá và trải nghiệm với mức giá vô cùng hợp lý.
            </p>

            <div className="flex justify-center gap-6 mb-8">
                {(["Bac", "Trung", "TayNguyen", "DongNamBo", "TayNamBo"] as Region[]).map((r) => (
                    <button
                        key={r}
                        onClick={() => setRegion(r)}
                        className={`px-4 py-2 rounded-full font-semibold ${region === r ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {
                            r === "Bac"
                                ? "Miền Bắc"
                                : r === "Trung"
                                    ? "Miền Trung"
                                    : r === "TayNguyen"
                                        ? "Tây Nguyên"
                                        : r === "DongNamBo"
                                            ? "Đông Nam Bộ"
                                            : "Tây Nam Bộ"
                        }

                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="wait"> {/* ✨ thêm AnimatePresence */}
                    {destinations[region].map((place) => (
                        <motion.div
                            key={place.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={place.image}
                                alt={place.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4 text-center font-semibold">{place.name}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
