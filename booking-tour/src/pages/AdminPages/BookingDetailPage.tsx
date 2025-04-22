import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Để lấy tham số từ URL

interface Booking {
    _id: string;
    contact: {
        name: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        region: string;
    };
    passengers: {
        name: string;
        gender?: string;
        phone: string;
        address: string;
        passport?: string;
    }[];
    tourId: {
        tour: string;
        tourCode: string; // Thêm mô tả tour nếu có
        location: string;
        startDate: Date;
        endDate: Date;
        destination: string;
    };
    amount: number;
    paymentMethod: string;
    paymentType: string;
    createdAt: string;
}

const BookingDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/bookings/${id}`);
                console.log("API Response:", response.data);  // Kiểm tra dữ liệu trả về
                setBooking(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin booking:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBooking();
        }
    }, [id]);

    if (loading) {
        return <div>Đang tải thông tin booking...</div>;
    }
    if (!booking) {
        return <div>Không tìm thấy booking.</div>;
    }
    // Kiểm tra trước khi hiển thị các thông tin
    const contact = booking.contact || {};
    const tour = booking.tourId || {};
    const passengers = booking.passengers || [];
     // Tính toán tổng số tiền
     const total = booking.amount;  // Có thể thay đổi nếu cần thêm tính toán nào
     const finalPayment = booking.paymentType === "full" ? total : total / 2;
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Chi tiết Booking</h2>
            <div className="space-y-6 mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Thông tin tour đã đặt</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-4  rounded-lg shadow-sm">
                        <strong className="text-gray-600">Tên tour:</strong>
                        <p className="text-gray-800">{tour?.tour || "Chưa có tên tour"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Mã tour:</strong>
                        <p className="text-gray-800">{tour?.tourCode || "Chưa có mô tả tour"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Điểm đi:</strong>
                        <p className="text-gray-800">{tour?.location || "Chưa có địa điểm"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Điểm đến:</strong>
                        <p className="text-gray-800">{tour?.destination || "Chưa có địa điểm"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Ngày bắt đầu:</strong>
                        <p className="text-gray-800">{new Date(tour?.startDate).toLocaleDateString() || "Chưa có ngày bắt đầu"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Ngày kết thúc:</strong>
                        <p className="text-gray-800">{new Date(tour?.endDate).toLocaleDateString() || "Chưa có ngày kết thúc"}</p>
                    </div>
                </div>
                {/* Thông tin thanh toán */}
                <h3 className="text-2xl font-semibold text-center text-gray-800 mt-6 mb-4">Thông tin thanh toán</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Số tiền thanh toán:</strong>
                        <p className="text-gray-800">
                            {new Intl.NumberFormat("vi-VN").format(finalPayment)} VND
                        </p>
                    </div>
                    <div className="bg-white flex items-center p-4 rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Phương thức thanh toán:</strong>
                        <p className="text-gray-800">{booking.paymentMethod}</p>
                    </div>
                    <div className="bg-white flex items-center p-4 rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Thanh toán trả trước:</strong>
                        <p className="text-gray-800">{booking.paymentType}</p>
                    </div>
                    <div className="bg-white flex items-center p-4 rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Ngày đặt tour:</strong>
                        <p className="text-gray-800">
                            {new Date(booking.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-6 mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
                {/* Thông tin liên hệ */}
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Thông tin liên hệ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white flex items-center  p-4 rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Tên khách hàng:</strong>
                        <p className="text-gray-800">{contact?.name || "Chưa có tên"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Số điện thoại:</strong>
                        <p className="text-gray-800">{contact?.phone || "Chưa có số điện thoại"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Email:</strong>
                        <p className="text-gray-800">{contact?.email || "Chưa có email"}</p>
                    </div>
                    <div className="bg-white p-4 flex items-center rounded-lg shadow-sm">
                        <strong className="text-gray-600 mr-4">Địa chỉ:</strong>
                        <p className="text-gray-800">{contact?.address || "Chưa có địa chỉ"}</p>
                    </div>
                </div>
                {/* Thông tin khách hàng (Passengers) */}
                <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Thông tin khách hàng</h3>
                <div className="space-y-4">
                    {passengers.length > 0 ? (
                        passengers.map((passenger, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-md bg-white shadow-sm">
                                <h4 className="text-xl font-semibold text-center text-gray-800 mb-4">Hành khách {index + 1}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-center">
                                        <strong className="text-gray-600 mr-4">Họ và tên:</strong>
                                        <p className="text-gray-800">{passenger?.name || "Chưa có tên"}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="text-gray-600 mr-4">Số điện thoại:</strong>
                                        <p className="text-gray-800">{passenger?.phone || "Chưa có số điện thoại"}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="text-gray-600 mr-4">Giới tính:</strong>
                                        <p className="text-gray-800">{passenger?.gender || "Chưa có giới tính"}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="text-gray-600 mr-4">Địa chỉ:</strong>
                                        <p className="text-gray-800">{passenger?.address || "Chưa có địa chỉ"}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="text-gray-600 mr-4">Passport:</strong>
                                        <p className="text-gray-800">{passenger?.passport || "Chưa có passport"}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-800">Không có thông tin hành khách.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;
