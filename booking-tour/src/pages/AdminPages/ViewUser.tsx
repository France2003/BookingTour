import { Descriptions, Spin, Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { IoReturnDownBack } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

interface IBooking {
  _id: string;
  date: string;
  amount: number;
  tourId: string; // ID của tour đã đặt
}

interface ITour {
  _id: string;
  title: string;
  location: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

interface IUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  city?: string;
  avatar?: string;
  role?: "user" | "admin";
  bookings?: IBooking[]; // Danh sách đơn đặt tour
}

const ViewUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [tours, setTours] = useState<ITour[]>([]); // Thêm state chứa thông tin các tour

  // Fetch thông tin chi tiết người dùng và booking
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/auth/users/${id}`);
      setUserData(res.data.user);
      setBookings(res.data.bookings);
      console.log("User data fetched:", res.data.user); // Kiểm tra dữ liệu người dùng
      
      console.log("Bookings from user:", res.data.bookings); // Kiểm tra bookings
      // Fetch thông tin tour từ danh sách bookings
      const tourRequests = res.data.bookings.map((booking: IBooking) =>
        axios.get(`http://localhost:3001/api/tours/${booking.tourId}`)
      );
      const tourResponses = await Promise.all(tourRequests);

      // Kiểm tra các phản hồi từ API tour
      console.log("Tour data fetched:", tourResponses);

      const fetchedTours = tourResponses.map((response) => response.data);
      setTours(fetchedTours);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Xem chi tiết người dùng</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      {/* Thông tin người dùng */}
      <Card title="Chi tiết người dùng" bordered className="shadow-md">
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        ) : userData ? (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Họ tên">{userData.name || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData.email || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{userData.phone || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {userData.birthdate ? new Date(userData.birthdate).toLocaleDateString() : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">{userData.gender || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{userData.address || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Thành phố">{userData.city || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Avatar">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt="avatar"
                  className="w-[100px] h-[100px] object-cover rounded"
                />
              ) : (
                "Chưa có"
              )}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p className="text-center text-gray-500">Không có dữ liệu người dùng</p>
        )}
      </Card>

      {/* Lịch sử đặt tour */}
      <Card title="Lịch sử đặt tour" bordered className="shadow-md">
        {loading ? (
          <div className="text-center py-6">
            <Spin size="large" />
          </div>
        ) : bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking, index) => {
              // Tìm thông tin tour từ mảng tours
              const tour = tours.find((tour) => tour._id === booking.tourId);
              return (
                <li key={booking._id} className="border p-4 rounded-md shadow-sm">
                  <p><strong>STT:</strong> {index + 1}</p>
                  <p><strong>Tên tour:</strong> {tour?.title || "Không xác định"}</p>
                  <p><strong>Địa điểm:</strong> {tour?.location || "Chưa có thông tin địa điểm"}</p>
                  <p><strong>Mô tả tour:</strong> {tour?.destination || "Chưa có mô tả"}</p>
                  <p><strong>Ngày đặt:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Số tiền:</strong> {booking.amount.toLocaleString()} đ</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">Bạn chưa đặt tour nào.</p>
        )}
      </Card>

      {/* Quay lại danh sách người dùng */}
      <Link to="/admin/users" className="flex items-center gap-2 text-[15px] text-blue-600">
        <IoReturnDownBack className="text-[30px]" />
        <p>Quay lại</p>
      </Link>
    </div>
  );
};

export default ViewUser;
