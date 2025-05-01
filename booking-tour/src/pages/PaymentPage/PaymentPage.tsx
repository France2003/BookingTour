import{ useState, useEffect } from "react";
import { Modal, Button, notification } from "antd"; // Import notification từ antd
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdConfirmationNumber, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { FaUser, FaChild, FaBaby } from "react-icons/fa";
import { CreditCard, DollarSign } from "lucide-react";

import Momo from "../../assets/image/momo.jpg";
import Vcb from "../../assets/image/vcb.jpg";
import Mb from "../../assets/image/mb.jpg";
import Tech from "../../assets/image/tech.jpg";
import Timeline from "../../components/Timeline/Timeline";
import { Helmet } from "react-helmet";

// Định nghĩa kiểu dữ liệu cho tour và booking
interface Tour {
    title: string;
    tourCode: string;
    startDate: string;
    endDate: string;
    duration: string;
    childPrice: number;
    babyPrice: number;
    image: string;
}

interface Booking {
    date: string;
    amount: number;
    paymentType: string;
    paymentMethod: string;
    tourId: string;
}

const PaymentPage = () => {
    const [method, setMethod] = useState<string>("");
    const [bank, setBank] = useState<string>("");
    const [showQRModal, setShowQRModal] = useState<boolean>(false);
    const [tour, setTour] = useState<Tour | null>(null);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [finalPayment, setFinalPayment] = useState<number>(0);
    const [contact, setContact] = useState<any>({});
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state && state.tour && state.booking) {
            console.log("Dữ liệu state:", state);
            console.log("Thông tin liên hệ:", state.contact);
            setContact(state.contact || {});
            setTour(state.tour);
            setBooking(state.booking);
            setFinalPayment(state.total);
            setMethod(state.booking?.paymentMethod || "");
            if (state.booking?.paymentMethod === "atm") {
                setBank(state.booking?.paymentInfo || "");
            }
        }
    }, [state]);

    const generateQR = () => {
        if (method === "momo") return Momo;
        if (method === "atm" && bank) {
            switch (bank) {
                case "vcb": return Vcb;
                case "tech": return Tech;
                case "mb": return Mb;
                default: return "";
            }
        }
        return "";
    };

    const handleConfirm = async () => {
        if (method === "atm" && !bank) {
            alert("Vui lòng chọn ngân hàng trước khi thanh toán.");
            return;
        }

        try {
            await axios.patch(`http://localhost:3001/api/bookings/${id}`, {
                paymentMethod: method,
                paymentInfo: method === "atm" ? bank : method === "momo" ? "momo" : "",
            });

            notification.success({
                message: 'Thanh toán thành công!',
                description: 'Chúc mừng bạn đã thanh toán thành công. Bạn sẽ được chuyển đến trang hoàn tất.',
                placement: 'topRight', // Vị trí thông báo
                duration: 3,
                style: { backgroundColor: '#f6ffed', color: '#52c41a' }, // Màu sắc thông báo thành công
            });
            // Điều hướng tới trang hoàn tất
            navigate(`/hoan-tat/${id}`);
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Đã có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.");
        }
    };
    const handleCancel = () => {
        navigate(-1);
    };
    const total = finalPayment;
    const passengers = state?.passengers || [];

    return (
        <div className="lg:px-24 px-[80px] pt-[620px] pb-20 py-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Phương thức thanh toán</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Timeline currentStep={3} />
            <h2 className="text-2xl font-bold mb-8 text-center">Thanh toán</h2>
            <div className="mb-4">
                <label className="font-medium block mb-1">Phương thức thanh toán</label>
                <select
                    value={method}
                    onChange={(e) => {
                        setMethod(e.target.value);
                        setBank("");
                    }}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">-- Chọn --</option>
                    <option value="atm ">Thẻ nội địa (ATM)</option>
                    <option value="momo">Momo</option>
                    <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                </select>
            </div>
            {/* Chọn ngân hàng nếu là ATM */}
            {method === "atm" && (
                <div className="mb-4">
                    <label className="font-medium block mb-1">Chọn ngân hàng</label>
                    <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Chọn ngân hàng --</option>
                        <option value="vcb">Vietcombank</option>
                        <option value="tech">Techcombank</option>
                        <option value="mb">MB Bank</option>
                    </select>
                </div>
            )}

            {/* Nút xem QR */}
            {(method === "momo" || (method === "atm" && bank)) && (
                <div className="mb-6 text-center">
                    <Button type="primary" onClick={() => setShowQRModal(true)}>
                        Xem mã QR để thanh toán
                    </Button>
                </div>
            )}
            {tour && booking ? (
                <>
                    <div className="rounded-lg shadow-lg bg-white p-4 mt-4">
                        <p className="text-lg font-semibold mb-2">{tour.title}</p>
                        <ul className="space-y-2 text-sm text-gray-800">
                            <li className="flex items-center gap-2">
                                <MdConfirmationNumber className="text-black" />
                                <span><strong>Code:</strong> {tour.tourCode}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdCalendarToday className="text-black" />
                                <span><strong>Ngày đi:</strong> {new Date(booking.date).toLocaleDateString("vi-VN")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdCalendarToday className="text-black" />
                                <span><strong>Ngày về:</strong> {new Date(tour.endDate).toLocaleDateString("vi-VN")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdAccessTime className="text-black" />
                                <span><strong>Thời gian:</strong> {tour.duration}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaUser className="text-black" />
                                <span><strong>Giá người lớn:</strong> {new Intl.NumberFormat("vi-VN").format(booking.amount)} ₫</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaChild className="text-black" />
                                <span><strong>Giá trẻ em:</strong> {new Intl.NumberFormat("vi-VN").format(tour.childPrice)} ₫</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaBaby className="text-black" />
                                <span><strong>Giá em bé:</strong> {new Intl.NumberFormat("vi-VN").format(tour.babyPrice)} ₫</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-black" />
                                <span><strong>Hình thức thanh toán:</strong> {booking.paymentType === "full" ? "Thanh toán 100%" : "Thanh toán 50%"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-black" />
                                <span><strong>Phương thức thanh toán:</strong> {
                                    method === "atm" ? "Thẻ ATM nội địa" :
                                        method === "momo" ? "Ví Momo" :
                                            method === "bank_transfer" ? "Chuyển khoản ngân hàng" :
                                                "Chưa chọn"
                                }</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-lg font-bold text-red-600 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-red-500" />
                            Tổng thanh toán: {new Intl.NumberFormat("vi-VN").format(finalPayment)} VNĐ
                        </p>
                    </div>
                </>
            ) : (
                <p>Không có thông tin tour hoặc booking!</p>
            )}
            <div className="bg-white p-6 rounded-lg shadow mb-3 mt-5">
                <h3 className="text-lg font-bold mb-4">Thông tin liên hệ</h3>
                {contact && typeof contact === "object" && Object.keys(contact).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border p-4 rounded bg-gray-50">
                            <p><strong>Họ tên:</strong> {contact.name}</p>
                            <p><strong>Số điện thoại:</strong> {contact.phone}</p>
                            <p><strong>Email:</strong> {contact.email}</p>
                            <p><strong>Địa chỉ:</strong> {contact.address}</p>
                            <p><strong>Thành Phố:</strong> {contact.city}</p>
                            <p><strong>Khu vực:</strong> {contact.region}</p>
                        </div>
                    </div>
                ) : (
                    <p>Không có thông tin liên hệ nào.</p>
                )}

                <h3 className="text-lg font-bold mt-5 mb-3">Thông tin hành khách</h3>
                {passengers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {passengers.map((p: any, index: any) => (
                            <div key={index} className="border p-4 rounded bg-gray-50">
                                <p><strong>Họ và tên:</strong> {p.firstName}</p>
                                <p><strong>Số điện thoại</strong> {p.phone}</p>
                                <p><strong>Địa chỉ: </strong> {p.address}</p>
                                <p><strong>Giới tính: </strong> {p.gender}</p>
                                <p><strong>Vùng miền: </strong> {p.region}</p>
                                <p><strong>Passport: </strong> {p.passport}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Không có hành khách nào.</p>
                )}
            </div>
            <Button
                type="primary"
                onClick={handleConfirm}
                className="w-full text-lg py-2"
            >
                Xác nhận thanh toán
            </Button>
            <Button
                type="default"
                onClick={handleCancel}
                className="w-full text-lg py-2"
            >
                Hủy giao dịch
            </Button>
            <Modal
                title="Quét mã QR để thanh toán"
                open={showQRModal}
                onCancel={() => setShowQRModal(false)}
                footer={[<Button key="close" onClick={() => setShowQRModal(false)}>Đóng</Button>]}>
                <div className="text-center">
                    <img
                        src={generateQR()}
                        alt="QR Thanh toán"
                        className="mx-auto border p-2 mb-4"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                    <p className="font-medium">
                        Tổng tiền cần thanh toán:{" "}
                        <span className="text-orange-500 font-bold">
                            {total.toLocaleString()} VND
                        </span>
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default PaymentPage;
