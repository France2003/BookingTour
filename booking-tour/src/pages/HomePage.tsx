import { Helmet } from "react-helmet";
import TourNew from "../components/Tour2025";
import Border from "../components/boder";
import TravelDestinations from "../components/TravelDestinations/TravelDestinations";
import CustomerCareBanner from "../components/CustomerCareBanner/CustomerCareBanner";
import ChatBubble from "../components/ChatBubble/ChatBubble";
import DestinationTabs from "../components/DestinationTabs/DestinationTabs";
const HomePage = () => {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Trang chủ</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <div className="mt-[590px]">
                <TourNew />
            </div>
            <div>
                <Border />
            </div>
            <div className="p-4 px-[150px] space-y-4">
                <div className="w-full">
                    <img
                        src="https://saigontourist.net/media/upload/2025/4/23/57546211.png"
                        alt="Chào Beloved Vietnam"
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <img
                            src="https://saigontourist.net/media/upload/2025/4/23/85d1884c.jpg"
                            alt="Úc Brisbane & Gold Coast"
                            className="w-full h-full rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <img
                            src="https://saigontourist.net/media/upload/2025/4/23/4755d86f.jpg"
                            alt="Lễ 30/4 & 1/5"
                            className="w-full rounded-xl shadow-lg"
                        />
                        <img
                            src="https://saigontourist.net/uploads/homepage/3banner/Banner-dichvudulich.jpg"
                            alt="Tự do trải nghiệm"
                            className="w-full rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </div>
            <div>
                <DestinationTabs />
            </div>
            <div className="relative mt-8 w-full">
                <img
                    src="https://letravel.vn/uploaded/ANH-cate-tour/tourdulich30-4.jpg"
                    alt="Saigontourist hợp tác Indonesia"
                    className="w-full h-[446px] object-center rounded-xl shadow-md"
                />
                <div className="absolute top-1/2 right-10 -translate-y-1/2 bg-[#254060] opacity-90 text-white p-6 rounded-xl max-w-md">
                    <p className="text-orange-400 font-semibold mb-2">Tin mới</p>
                    <h2 className="text-[17px] font-bold uppercase leading-snug mb-3">
                        50 năm – Một dấu mốc lịch sử, một hành trình trải nghiệm – Cùng DinhPhapTour nhớ về, sống lại, và khám phá.
                    </h2>
                    <p className="text-[13px] leading-relaxed mb-4">
                        Cùng bạn đến với những địa danh lịch sử – ghi nhớ và vinh danh 50 năm thống nhất đất nước.
                        Nửa thế kỷ vững vàng một dải đất – Cùng DinhPhapTour khám phá quê hương đổi mới
                        Cùng bạn đến với những địa danh lịch sử – ghi nhớ và vinh danh 50 năm thống nhất đất nước.
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-4 py-2 rounded font-medium">
                        Xem thêm
                    </button>
                </div>
            </div>
            <TravelDestinations />
            <div className="relative mt-3 w-full">
                <img
                    src="https://fpt.ai/wp-content/uploads/2024/06/Banner_chamsockh_D-1.jpg"
                    alt="Saigontourist hợp tác Indonesia"
                    className="w-full h-[446px] object-center rounded-xl shadow-md"
                />
                <div className="absolute top-1/2 left-10 -translate-y-1/2 bg-[#254060] opacity-90 text-white p-6 rounded-xl max-w-md">
                    <p className="text-orange-400 font-semibold mb-2">CHĂM SÓC KHÁCH HÀNG</p>
                    <h2 className="text-[17px] font-bold uppercase leading-snug mb-3">
                        Chương trình thẻ thành viên Lữ hành DinhPhapTour
                    </h2>
                    <p className="text-[13px] leading-relaxed mb-4">
                        Hội viên chương trình “Hoa Mai Vàng” sẽ nhận được nhiều quyền lợi hấp dẫn tăng dần theo từng hạng thẻ sở hữu và có cơ hội đổi nhiều quà tặng giá trị,
                        tour du lịch trọn gói từ kho quà tặng thuộc chương trình.
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-4 py-2 rounded font-medium">
                        Xem thêm
                    </button>
                </div>
            </div>
            <CustomerCareBanner />
            <div className="chat">
                <ChatBubble />
            </div>
        </>
    );
};
export default HomePage;