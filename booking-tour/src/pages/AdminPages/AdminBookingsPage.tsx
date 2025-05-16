import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css";
import {  ToastContainer } from "react-toastify";
import { Modal, message } from "antd";
// Kiểu dữ liệu Booking
interface Booking {
    _id: string;
    contact?: {
        name?: string;
        phone?: string;
    };
    tourId: {
        tour: string;
    };
    amount: number;
    paymentMethod: string;
    paymentType: string;
    createdAt: string;
}
const AdminBookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState(false); // Điều khiển modal
    const [bookingIdToDelete, setBookingIdToDelete] = useState<string>("");
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/bookings");
                const allBookings = response.data;
                if (Array.isArray(allBookings)) {
                    const paidBookings = allBookings.filter(
                        (booking: any) =>
                            booking.paymentMethod &&
                            booking.contact &&
                            typeof booking.contact.name === "string"
                    );
                    setBookings(paidBookings);
                } else {
                    console.error("Dữ liệu không hợp lệ:", allBookings);
                    setBookings([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải danh sách booking:", error);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);
    const showDeleteConfirm = (id: string) => {
        setBookingIdToDelete(id);
        setIsModalVisible(true);
    };
    const handleDeleteBooking = async () => {
        if (!bookingIdToDelete) return;

        try {
            await axios.delete(`http://localhost:3001/api/bookings/${bookingIdToDelete}`);
            setBookings((prev) => prev.filter((b) => b._id !== bookingIdToDelete)); // Cập nhật lại danh sách
            message.success("Đã xóa đơn đặt tour thành công!");
            setIsModalVisible(false); // Đóng modal
        } catch (error) {
            console.error("❌ Lỗi khi xóa booking:", error);
            message.error("Xóa đơn đặt tour thất bại!");
        }
    };
    const filteredBookings = bookings.filter((booking) => {
        const name = booking.contact?.name || "";
        const id = booking._id || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || id.includes(searchTerm);
    });

    const calculateFinalPayment = (booking: Booking) => {
        return booking.paymentType === "full" ? booking.amount : booking.amount / 2;
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md relative">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Danh sách bookings</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <h2 className="text-xl font-bold mb-4">Danh sách tour đã đặt</h2>

            {/* Tìm kiếm */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo tên khách hàng hoặc ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-l-md w-72 focus:outline-none"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
                    Tìm kiếm
                </button>
            </div>

            {loading ? (
                <div>Đang tải dữ liệu bookings...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-blue-600 text-white text-left">
                                <th className="px-4 py-3">Tên khách hàng</th>
                                <th className="px-4 py-3">Số điện thoại</th>
                                <th className="px-4 py-3">Tên tour</th>
                                <th className="px-4 py-3">Số tiền thanh toán</th>
                                <th className="px-4 py-3">Phương thức</th>
                                <th className="px-4 py-3">Ngày thanh toán</th>
                                <th className="px-4 py-3 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-gray-500">
                                        Không tìm thấy bookings nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{booking.contact?.name || "Không có tên"}</td>
                                        <td className="px-4 py-3">{booking.contact?.phone || "Không có số"}</td>
                                        <td className="px-4 py-3">{booking.tourId.tour}</td>
                                        <td className="px-4 py-3">
                                            {new Intl.NumberFormat("vi-VN").format(calculateFinalPayment(booking))} VND
                                        </td>
                                        <td className="px-4 py-3">{booking.paymentMethod}</td>
                                        <td className="px-4 py-3">
                                            {new Date(booking.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link to={`/admin/bookings/view/${booking._id}`} title="Xem">
                                                    <Eye size={18} className="text-blue-500 hover:scale-110 transition-transform" />
                                                </Link>
                                                <button
                                                    className="text-red-500 hover:scale-110 transition-transform"
                                                    title="Xóa"
                                                    onClick={() => showDeleteConfirm(booking._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <Modal
                        title="Xác nhận xóa"
                        visible={isModalVisible}
                        onOk={handleDeleteBooking}
                        onCancel={() => setIsModalVisible(false)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <p>Bạn có chắc chắn muốn xóa đơn đặt tour này không?</p>
                    </Modal>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default AdminBookingsPage;
