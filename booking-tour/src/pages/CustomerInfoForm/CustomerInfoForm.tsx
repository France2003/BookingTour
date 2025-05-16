import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Timeline from "../../components/Timeline/Timeline";
import { FaUser, FaChild, FaBaby } from "react-icons/fa";
import { MdCalendarToday, MdAccessTime, MdConfirmationNumber } from "react-icons/md";
import Checkbox from "antd/es/checkbox/Checkbox";
import { Helmet } from "react-helmet";
const CustomerInfoForm = () => {
    const { id } = useParams();
    const history = useNavigate();
    const [tour, setTour] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [babies, setBabies] = useState(1);
    const [paymentType, setPaymentType] = useState<'full' | 'half' | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [isAgreed, setIsAgreed] = useState(false); // Trạng thái của checkbox đồng ý điều khoản
    // Hàm tính toán tổng số tiền cần thanh toán
    const calculateTotalAmount = () => {
        const total = (adults * tour.price) + (children * tour.childPrice) + (babies * tour.babyPrice);
        if (paymentType === 'full') {
            setTotalAmount(total); // Thanh toán 100%
            setDepositAmount(0); // Không có tiền cọc khi thanh toán 100%
        } else if (paymentType === 'half') {
            setTotalAmount(total * 0.5); // Thanh toán 50%
            setDepositAmount(total * 0.5); // Số tiền cọc 50%
        } else {
            setTotalAmount(total); // Mặc định là thanh toán 100%
            setDepositAmount(0); // Không có tiền cọc khi thanh toán 100%
        }
    };
    useEffect(() => {
        if (tour) {
            calculateTotalAmount();
        }
    }, [paymentType, adults, children, babies, tour]);
    const handleSubmitBooking = async () => {
        if (!selectedPaymentMethod || !isAgreed) {
            alert("Vui lòng chọn phương thức thanh toán và đồng ý điều khoản.");
            return;
        }
        const email = localStorage.getItem("userEmail");
        console.log(email);
        // Chỉ gửi các thông tin cơ bản cần thiết
        const bookingData = {
            tourId: tour._id,
            adults,
            children,
            babies,
            paymentType,
            paymentMethod: selectedPaymentMethod, totalAmount,
            status: 'pending',
            email,
        };
        console.log(bookingData);
        try {
            console.log("Dữ liệu gửi lên API:", bookingData);
            const response = await axios.post('http://localhost:3001/api/bookings', bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const bookingId = response.data._id;
            history(`/passenger-info/${bookingId}`, {
                state: {
                    email,
                    adults,
                    children,
                    babies,
                    paymentMethod: selectedPaymentMethod,
                    totalAmount: paymentType === 'half' ? depositAmount : totalAmount,
                    fullAmount: (adults * tour.price + children * tour.childPrice + babies * tour.babyPrice),
                    tourInfo: {
                        tourCode: tour.tourCode,
                        startDate: tour.startDate,
                        endDate: tour.endDate,
                        duration: tour.duration,
                    },
                },
            });
        } catch (error) {
            console.error("Đặt tour thất bại:", error);
        }
    };
    const handlePaymentTypeChange = (type: 'full' | 'half') => {
        setPaymentType(type); // Cập nhật phương thức thanh toán
    };
    const handleSelectPaymentMethod = async (method: string) => {
        setSelectedPaymentMethod(method);
    };

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/tours/${id}`);
                setTour(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tour:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [id]);
    if (loading) return <div className="text-center py-10 text-lg">Đang tải dữ liệu...</div>;
    if (!tour) return <div className="text-center py-10 text-red-500">Không tìm thấy thông tin tour.</div>;
    return (
        <div className="px-[80px] pt-[620px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Chọn dịch vụ</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Timeline currentStep={1} />
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold">SỐ LƯỢNG HÀNH KHÁCH</h2>
                        <div className="space-y-4 mt-2">
                            <div>
                                <label className="block mb-1">Người lớn (*)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={adults}
                                    onChange={(e) => setAdults(Number(e.target.value))}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Trẻ em</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={children}
                                    onChange={(e) => setChildren(Number(e.target.value))}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Em bé</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={babies}
                                    onChange={(e) => setBabies(Number(e.target.value))}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PHƯƠNG THỨC THANH TOÁN</h2>
                        <div className="flex space-x-4 mt-2">
                            <button
                                className={`px-4 py-2 rounded ${paymentType === 'full' ? 'bg-green-500' : 'bg-green-200'}`}
                                onClick={() => handlePaymentTypeChange('full')}
                            >
                                Thanh toán 100%
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${paymentType === 'half' ? 'bg-green-500' : 'bg-green-200'}`}
                                onClick={() => handlePaymentTypeChange('half')}
                            >
                                Thanh toán 50%
                            </button>
                        </div>
                        <p className="mt-2 text-sm font-semibold">
                            Sau khi đặt cọc, quý khách vui lòng hoàn tất thanh toán trong <span className="font-bold">48h</span>
                        </p>
                        <p className="text-red-500 text-sm">* Chỉ áp dụng cho thanh toán online hoặc đặt cọc</p>
                        <div className="flex items-center mt-4 space-x-2">
                            <input
                                type="text"
                                placeholder="Mã khuyến mãi"
                                className="border px-3 py-2 rounded w-full"
                            />
                            <button className="bg-orange-500 text-white px-4 py-2 rounded">ÁP DỤNG</button>
                        </div>
                        <p className="font-semibold">Chọn một trong các phương thức sau:</p>
                        <div className="mt-4 grid gap-4">
                            <div
                                onClick={() => handleSelectPaymentMethod("atm")}
                                className={`border p-4 rounded cursor-pointer relative transition ${selectedPaymentMethod === "atm" ? "bg-green-100 border-green-500" : "bg-gray-50"
                                    }`}
                            >
                                <h3 className="font-semibold">Thanh toán bằng thẻ nội địa ATM</h3>
                                <p className="text-sm mt-1">
                                    Sau khi đặt vé và thanh toán thành công, Lữ hành Saigontourist sẽ gửi vé điện tử của Quý khách
                                </p>
                                {selectedPaymentMethod === "atm" && (
                                    <span className="absolute top-2 right-2 text-green-600 font-bold">✓</span>
                                )}
                            </div>
                            <div
                                onClick={() => handleSelectPaymentMethod("momo")}
                                className={`border p-4 rounded cursor-pointer relative transition ${selectedPaymentMethod === "momo" ? "bg-purple-100 border-purple-500" : "bg-gray-50"
                                    }`}
                            >
                                <h3 className="font-semibold">Thanh toán bằng MoMo</h3>
                                <p className="text-sm mt-1">
                                    Chuyển hướng đến ứng dụng MoMo để thanh toán nhanh chóng và bảo mật
                                </p>
                                {selectedPaymentMethod === "momo" && (
                                    <span className="absolute top-2 right-2 text-purple-600 font-bold">✓</span>
                                )}
                            </div>
                        </div>
                        <div className=" mt-4 space-x-2">
                            <Checkbox checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)}>
                                Tôi đã đọc và đồng ý điều khoản
                            </Checkbox>
                            <div className="max-h-[200px] mt-3 overflow-y-auto border p-4 rounded bg-gray-50 text-sm leading-relaxed">
                                <p><strong>1. Thanh toán:</strong> Quý khách có thể chọn thanh toán toàn bộ hoặc đặt cọc 50% giá trị tour. Số tiền còn lại phải được thanh toán trước ngày khởi hành tối thiểu 48 giờ.</p>
                                <p className="mt-2"><strong>2. Hủy tour:</strong> Nếu quý khách hủy tour:</p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Trước 7 ngày: Hoàn 100% tiền đã thanh toán</li>
                                    <li>Từ 3–6 ngày: Phạt 50% tổng giá trị tour</li>
                                    <li>Dưới 3 ngày: Không hoàn tiền</li>
                                </ul>
                                <p className="mt-2"><strong>3. Trách nhiệm:</strong> Saigontourist không chịu trách nhiệm với các trường hợp bất khả kháng như thiên tai, dịch bệnh, tai nạn giao thông, v.v.</p>
                                <p className="mt-2"><strong>4. Hồ sơ cần thiết:</strong> Quý khách cần mang theo giấy tờ tùy thân hợp lệ (CMND/CCCD/hộ chiếu) khi tham gia tour.</p>
                                <p className="mt-2"><strong>5. Đặt vé:</strong> Sau khi đặt tour thành công, vé điện tử sẽ được gửi qua email đã đăng ký.</p>
                                <p className="mt-2"><strong>6. Khác:</strong> Các điều khoản khác được áp dụng theo quy định chung của Lữ hành Saigontourist.</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-4 justify-between">
                            <Link
                                to={`/tour/${tour._id}`}
                                className="bg-gray-300 text-black py-2 px-6 rounded text-lg font-bold transition-all hover:bg-gray-400 hover:shadow-lg"
                            >
                                Quay lại
                            </Link>
                            <button
                                onClick={handleSubmitBooking}
                                className="bg-orange-400 text-white py-2 px-10 rounded text-lg font-bold transition-all hover:bg-orange-500 hover:shadow-lg "
                            >
                                Tiếp tục
                            </button>
                        </div>

                    </div>
                </div>
                <div className="space-y-4">
                    <button className="bg-orange-400 text-white w-full py-2 rounded text-lg font-bold">
                        Hỗ trợ giao dịch 1900 1808
                    </button>
                    <img
                        src={tour.image || "/default-tour.jpg"}
                        alt={tour.title}
                        className="rounded-lg shadow object-cover w-full h-[200px]"
                        onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x200";
                        }}
                    />
                    <div className="rounded-lg  shadow-lg bg-white p-4">
                        <h3 className="text-lg font-bold leading-snug">{tour.title}</h3>
                        <ul className="text-sm mt-2 space-y-2 text-gray-800">
                            <li className="flex items-center gap-2">
                                <MdConfirmationNumber className="text-black" />
                                <span><strong>Code:</strong> {tour.tourCode}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdCalendarToday className="text-black" />
                                <span><strong>Ngày đi:</strong> {new Date(tour.startDate).toLocaleDateString("vi-VN")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdCalendarToday className="text-black" />
                                <span><strong>Ngày về:</strong> {new Date(tour.endDate).toLocaleDateString("vi-VN")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdAccessTime className="text-black" />
                                <span><strong>Thời gian:</strong> {tour.duration}</span>
                            </li>

                            {adults > 0 && (
                                <li className="flex items-center gap-2">
                                    <FaUser className="text-black" />
                                    <span><strong>Giá Người lớn:</strong> {Number(tour.price).toLocaleString("vi-VN")} ₫ x {adults}</span>
                                </li>
                            )}
                            {children > 0 && (
                                <li className="flex items-center gap-2">
                                    <FaChild className="text-black" />
                                    <span><strong>Trẻ em:</strong> {Number(tour.childPrice).toLocaleString("vi-VN")} ₫ x {children}</span>
                                </li>
                            )}
                            {babies > 0 && (
                                <li className="flex items-center gap-2">
                                    <FaBaby className="text-black" />
                                    <span><strong>Em bé:</strong> {tour.babyPrice === 0 ? "Miễn phí" : `${Number(tour.babyPrice).toLocaleString("vi-VN")} ₫ x ${babies}`}</span>
                                </li>
                            )}
                        </ul>
                        {(adults > 0 || children > 0 || babies > 0) && (
                            <div className="mt-4 text-left">
                                <div className="text-xl font-bold">
                                    Tổng: <span className="text-orange-500">{(
                                        adults * tour.price +
                                        children * tour.childPrice +
                                        babies * tour.babyPrice
                                    ).toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                            </div>
                        )}
                        {paymentType === 'half' && depositAmount > 0 && (
                            <div className="mt-4 text-left">
                                <hr className="mb-2" />
                                <p className="text-[18px]">Thanh Toán</p>
                                <div className="text-[18px]">
                                    <p className="text-[15px]"> Bạn đã chọn hình thức <b>Đặt cọc 50%</b></p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-[15px]">Cần thanh toán:</p> <strong className="text-orange-400 text-xl font-bold">{Number(depositAmount).toLocaleString("vi-VN")}</strong> VNĐ
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoForm;