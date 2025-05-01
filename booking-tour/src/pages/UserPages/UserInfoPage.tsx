import { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Avatar } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";

const { Option } = Select;

const UserInfoPage = () => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const storedEmail = localStorage.getItem("userEmail");
      const res = await axios.get("http://localhost:3001/api/auth/users");
      const user = res.data.find((u: any) => u.email === storedEmail);

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
      </Form>
    </div>
  );
};

export default UserInfoPage;
