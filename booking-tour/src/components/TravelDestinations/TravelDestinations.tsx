import { Link } from "react-router-dom";

const destinations = [
    {
        slug: "ha-giang-noi-da-no-hoa",
        category: "Du lịch Việt Nam",
        title: "Hà Giang - Nơi đá nở hoa",
        desc: "Hà Giang - Vùng đất địa đầu của Tổ quốc - nơi cảnh vật làm nao lòng du khách khi đặt chân đến nơi đây. Mỗi mùa, mỗi thời điểm khác nhau lại có một nét đặc...",
        img: "https://saigontourist.net/uploads/destination/TrongNuoc/mienbac/Ha-giang/Xin-Man_1131374039.jpg",
    },
    {
        slug: "du-lich-nuoc-ngoai-304-15",
        category: "Du lịch Thái Lan",
        title: "Du lịch nước ngoài - Trải nghiệm mới mẻ cho kỳ nghỉ 30/4 và 1/5",
        desc: "Du lịch nước ngoài không chỉ giúp bạn khám phá những nền văn hóa mới mẻ, mở rộng tầm nhìn mà còn mang đến cho bạn những trải nghiệm độc đáo và khó quên.",
        img: "https://saigontourist.net/uploads/destination/NuocNgoai/Thailand/Bangkok-China-Town_1124522612.jpg",
    },
    {
        slug: "5-diem-den-304-15",
        category: "Du lịch Việt Nam",
        title: "5 điểm đến không thể bỏ qua cho kỳ nghỉ lễ 30/4 - 1/5",
        desc: "Du lịch 30/4 1/5 là dịp để bạn khám phá các vùng đất tuyệt đẹp, thử sức với các trải nghiệm mới mẻ. Vì vậy việc chọn điểm đến cũng cần sự tìm hiểu thật kỹ lưỡng.",
        img: "https://saigontourist.net/uploads/destination/TrongNuoc/Condao/Vietnamese-fishing-boats-on-Con-Dao-Island.jpg",
    },
];

export default function TravelDestinations() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-[30px] font-bold text-blue-700 mb-8 uppercase">
                Điểm đến & Trải nghiệm
            </h2>
            <div className="grid md:grid-cols-5 gap-8">
                {/* LEFT: Featured destination */}
                <Link to={`/${destinations[0].slug}`} className="md:col-span-2">
                    <div className="bg-blue-100 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                        <img
                            src={destinations[0].img}
                            alt={destinations[0].title}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <p className="text-orange-500 font-semibold">
                                [{destinations[0].category}]
                            </p>
                            <h3 className="text-xl font-semibold text-blue-700 mt-2">
                                {destinations[0].title}
                            </h3>
                            <p className="text-gray-700 mt-2 text-sm">{destinations[0].desc}</p>
                        </div>
                    </div>
                </Link>
                <div className="md:col-span-3 flex flex-col gap-6">
                    {destinations.slice(1).map((item, index) => (
                        <Link to={`/${item.slug}`} key={index}>
                            <div className="flex gap-4 items-start bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-1/2 h-40 object-cover rounded-l-xl"
                                />
                                <div className="p-4">
                                    <p className="text-orange-500 font-semibold">
                                        [{item.category}]
                                    </p>
                                    <h3 className="text-lg font-semibold text-blue-600 mt-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-700 text-sm mt-1">{item.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
