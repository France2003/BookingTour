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
  tourId: {
    title: string;
  };
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
  bookings?: IBooking[];
}

const ViewUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/auth/users/${id}`);
      setUserData(res.data.user);
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu người dùng:", err);
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
        <title>Xem chi tiết</title>
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
              {userData.birthdate
                ? new Date(userData.birthdate).toLocaleDateString()
                : "Chưa có"}
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
        ) : userData?.bookings && userData.bookings.length > 0 ? (
          <ul className="space-y-4">
            {userData.bookings.map((booking, index) => (
              <li key={booking._id} className="border p-4 rounded-md shadow-sm">
                <p><strong>STT:</strong> {index + 1}</p>
                <p><strong>Tên tour:</strong> {booking.tourId?.title || "Không xác định"}</p>
                <p><strong>Ngày đặt:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Số tiền:</strong> {booking.amount.toLocaleString()} đ</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">Bạn chưa đặt tour nào.</p>
        )}
      </Card>

      <Link to="/admin/users" className="flex items-center gap-2 text-[15px] text-blue-600">
        <IoReturnDownBack className="text-[30px]" />
        <p>Quay lại</p>
      </Link>
    </div>
  );
};

export default ViewUser;
