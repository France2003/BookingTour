import { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Avatar } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import {
  Calendar,
  MapPin,
  Navigation,
  Clock,
  Bus,
  CreditCard,
  FileText,
} from "lucide-react";
interface ITour {
  _id: string;
  title: string;
  location: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  vehicle: string;
  duration: string;
}

interface IBooking {
  _id: string;
  date: string;
  amount: number;
  tourId: ITour;

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
const { Option } = Select;

const UserInfoPage = () => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [userData, setUserData] = useState<IUser | null>(null);
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const storedEmail = localStorage.getItem("userEmail");
      const res = await axios.get("http://localhost:3001/api/auth/users");
      const user = res.data.find((u: any) => u.email === storedEmail);
      const bookingsRes = await axios.get(`http://localhost:3001/api/auth/users/${user._id}`);
      setUserData(res.data.user);
      const userBookings = bookingsRes.data.bookings || [];
      setBookings(userBookings);
      console.log("hsdhjdf", userBookings);
      if (!user) return message.error("Không tìm thấy người dùng!");
      setUserId(user._id);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthdate: user.birthdate ? dayjs(user.birthdate) : null,
        gender: user.gender,
        address: user.address,
        city: user.city,
        avatar: user.avatar,
      });
    } catch (err) {
      message.error("Không thể lấy dữ liệu người dùng!");
    }

  };

  const handleSubmit = async (values: any) => {
    try {
      await axios.put(`http://localhost:3001/api/auth/users/${userId}`, {
        ...values,
        birthdate: values.birthdate?.toISOString(),
      });
      message.success("Cập nhật thành công!");

      // Đảm bảo avatar preview cập nhật
      form.setFieldValue("avatar", values.avatar);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  return (
    <div className="max-w-5xl  mx-auto mt-12 bg-white shadow-md p-8 rounded-lg">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Thông Tin Người Dùng</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <h2 className="text-3xl font-semibold mb-8 text-center">Hồ Sơ Người Dùng</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Form Fields */}
          <div className="md:col-span-2">
            <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="birthdate" label="Ngày sinh">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="Thành phố">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </div>

          {/* Right: Avatar Preview + Input */}
          <div className="flex flex-col items-center">
            <Form.Item shouldUpdate={(prev, curr) => prev.avatar !== curr.avatar}>
              {() => {
                const avatar = form.getFieldValue("avatar");
                return (
                  <Avatar
                    src={avatar || undefined}
                    size={120}
                    className="mb-4 border border-gray-300"
                  />
                );
              }}
            </Form.Item>

            <Form.Item name="avatar" label="URL ảnh đại diện" className="w-full">
              <Input placeholder="Nhập URL ảnh đại diện hoặc để trống" />
            </Form.Item>

            <p className="text-sm text-gray-500 text-center">
              Dung lượng tối đa 1MB <br />
              Định dạng: JPEG, PNG
            </p>
          </div>
        </div>
        <div className="border-t pt-2">
          <h3 className="text-2xl font-semibold mb-2">Tour đã đặt</h3>
          {bookings.length > 0 ? (
            <ul className="space-y-6">
              {bookings.map((booking) => {
                const tour = booking.tourId;
                return (
                  <li key={booking._id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <p className="flex items-center gap-2"><FileText size={16} /> <strong>Tên tour:</strong> {tour?.title || "Không xác định"}</p>
                    <p className="flex items-center gap-2"><MapPin size={16} /> <strong>Địa điểm:</strong> {tour?.location || "Chưa có thông tin"}</p>
                    <p className="flex items-center gap-2"><Navigation size={16} /> <strong>Điểm đến:</strong> {tour?.destination || "Chưa có mô tả"}</p>
                    <p className="flex items-center gap-2"><Clock size={16} /> <strong>Thời gian:</strong> {tour?.duration || "Chưa có mô tả"}</p>
                    <p className="flex items-center gap-2"><Bus size={16} /> <strong>Phương tiện:</strong> {tour?.vehicle || "Chưa có mô tả"}</p>
                    <p className="flex items-center gap-2"><Calendar size={16} /> <strong>Ngày đi:</strong> {tour?.startDate ? new Date(tour.startDate).toLocaleDateString() : "Không rõ"}</p>
                    <p className="flex items-center gap-2"><Calendar size={16} /> <strong>Ngày về:</strong> {tour?.endDate ? new Date(tour.endDate).toLocaleDateString() : "Không rõ"}</p>
                    <p className="flex items-center gap-2"><Calendar size={16} /> <strong>Ngày đặt:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    <p className="flex items-center gap-2"><CreditCard size={16} /> <strong>Tổng tiền:</strong> {booking.amount.toLocaleString()} VNĐ</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có lịch sử đặt tour.</p>
          )}
        </div>
      </Form>
    </div>
  );
};

export default UserInfoPage;