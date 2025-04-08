import { Form, Input, InputNumber, DatePicker, Button, Checkbox, notification, Row, Col, Card, Select } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { IoReturnDownBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";

const { Option } = Select;

export default function AddTour() {
  const [form] = Form.useForm();
  const [token, setToken] = useState<string | null>(null);
  const [programList, setProgramList] = useState([{ activities: "" }]);
  const [additionalImageUrls, setAdditionalImages] = useState<string[]>([""]);

  // useEffect để kiểm tra token khi component được mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken'); // Đảm bảo key là 'accessToken'
    if (!storedToken) {
      notification.error({
        message: "Lỗi!",
        description: "Không tìm thấy token, bạn cần đăng nhập lại!",
      });
    }
    setToken(storedToken);
  }, []);
  useEffect(() => {
    form.setFieldsValue({ additionalImageUrls });
  }, [additionalImageUrls, form]);

  const onFinish = async (values: any) => {
    if (!token) {
      notification.error({
        message: "Lỗi!",
        description: "Vui lòng đăng nhập để thực hiện hành động này!",
      });
      return;
    }

    try {
      // Kiểm tra nếu chưa nhập đường dẫn ảnh
      if (!values.imageUrl) {
        notification.error({
          message: "Lỗi!",
          description: "Vui lòng nhập đường dẫn ảnh!",
        });
        return;
      }

      // Kiểm tra tất cả các giá trị bắt buộc trước khi gửi
      if (!values.title || !values.tour || !values.tourCode || !values.destination || !values.vehicle || !values.location || !values.duration || !values.price || !values.imageUrl || !values.additionalImageUrls || !values.startDate || !values.endDate || !values.seatsAvailable || !values.region || !values.childPrice || !values.babyPrice || !values.program) {
        notification.error({
          message: "Lỗi!",
          description: "Thiếu thông tin tour, vui lòng kiểm tra lại các trường bắt buộc.",
        });
        return;
      }
      // Kiểm tra ngày khởi hành và ngày kết thúc
      if (values.startDate && values.endDate && values.startDate.isAfter(values.endDate)) {
        notification.error({
          message: "Lỗi!",
          description: "Ngày kết thúc không thể trước ngày khởi hành.",
        });
        return;
      }

      // Log dữ liệu gửi đi để kiểm tra
      console.log("Dữ liệu gửi đi:", values);
      const programWithDays = (values.program || []).map((item: any, index: number) => ({
        day: index + 1,
        activities: typeof item.activities === "string" ? [item.activities] : item.activities,
      }));
      const additionalImageUrls = values.additionalImageUrls || [];
      if (!Array.isArray(additionalImageUrls)) {
        notification.error({
          message: "Lỗi!",
          description: "Danh sách ảnh phụ không phải là một mảng.",
        });
        return;
      }
      const invalidImageIndex = additionalImageUrls.findIndex(img => typeof img !== 'string' || !img.trim());
      if (invalidImageIndex !== -1) {
        notification.error({
          message: "Lỗi!",
          description: `Ảnh phụ thứ ${invalidImageIndex + 1} không hợp lệ. Vui lòng kiểm tra lại.`,
        });
        return;
      }
      if (!values.additionalImageUrls) {
        values.additionalImageUrls = [];
      }
      console.log("Additional Images:", additionalImageUrls);


      // Format ngày tháng
      const formattedValues = {
        ...values,
        program: programWithDays,
        additionalImageUrls: values.additionalImageUrls,
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        isFeatured: values.isFeatured || false,
        price: Number(values.price),
        childPrice: Number(values.childPrice),
        babyPrice: Number(values.babyPrice),
        seatsAvailable: Number(values.seatsAvailable),
      };
      console.log("startDate:", values.startDate ? values.startDate.format("YYYY-MM-DD") : "Chưa có");
      console.log("endDate:", values.endDate ? values.endDate.format("YYYY-MM-DD") : "Chưa có");

      // Gửi API
      const response = await axios.post("http://localhost:3001/api/tours", formattedValues, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Gửi token trong header
        },
      });

      // Nếu server trả về token mới, lưu lại vào localStorage
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token); // Lưu token mới vào localStorage
      }

      // Hiển thị thông báo thành công
      notification.success({
        message: "Thành công!",
        description: `Tour "${values.title}" đã được thêm thành công!`,
      });
      console.log("Phản hồi từ server:", response.data);

      // Reset form
      form.resetFields();
    } catch (error: any) {
      console.error("Lỗi khi thêm tour:", error);

      if (error.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response data:", error.response.data);

        notification.error({
          message: "Lỗi!",
          description: error.response.data?.message || "Thêm tour thất bại, vui lòng thử lại!",
        });
      } else {
        console.error("Error details:", error.message);
        notification.error({
          message: "Lỗi!",
          description: "Có lỗi xảy ra khi thêm tour, vui lòng thử lại!",
        });
      }
    }
  };


  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Thêm Tour</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Thêm Tour Mới</h2>

      <Card variant="outlined" className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ discount: 0, isFeatured: false, additionalImageUrls: [] }}
        >
          <Row gutter={16}>
            {/* Tiêu đề & Mã tour */}
            <Col span={12}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
                <Input placeholder="Nhập tiêu đề tour..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tour" name="tour" rules={[{ required: true, message: "Vui lòng nhập tour!" }]}>
                <Input placeholder="Nhập tour..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mã tour" name="tourCode" rules={[{ required: true, message: "Vui lòng nhập mã tour!" }]}>
                <Input placeholder="Nhập mã tour..." />
              </Form.Item>
            </Col>

            {/* Địa điểm & Điểm đến */}
            <Col span={12}>
              <Form.Item label="Địa điểm" name="location" rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}>
                <Input placeholder="Nhập địa điểm..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nơi đến" name="destination" rules={[{ required: true, message: "Vui lòng nhập nơi đến!" }]}>
                <Input placeholder="Nhập nơi đến..." />
              </Form.Item>
            </Col>

            {/* Phương tiện & Thời gian */}
            <Col span={12}>
              <Form.Item label="Phương tiện" name="vehicle" rules={[{ required: true, message: "Vui lòng nhập phương tiện!" }]}>
                <Input placeholder="Nhập phương tiện..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số ngày đi tour" name="duration" rules={[{ required: true, message: "Vui lòng nhập số ngày!" }]}>
                <Input placeholder="Nhập số ngày..." />
              </Form.Item>
            </Col>


            {/* Ngày khởi hành & Ngày kết thúc */}
            <Col span={12}>
              <Form.Item label="Ngày khởi hành" name="startDate" rules={[{ required: true, message: "Chọn ngày khởi hành!" }]}>
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true, message: "Chọn ngày kết thúc!" }]}>
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>

            {/* Chọn vùng miền */}
            <Col span={12}>
              <Form.Item label="Vùng miền" name="region" rules={[{ required: true, message: "Vui lòng chọn vùng miền!" }]}>
                <Select placeholder="Chọn vùng miền">
                  <Option value="mien-bac">Miền Bắc</Option>
                  <Option value="mien-trung">Miền Trung</Option>
                  <Option value="mien-nam">Miền Nam</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Giá tour & Giảm giá */}
            <Col span={12}>
              <Form.Item
                label="Giá tour"
                name="price"
                rules={[{ required: true, message: "Nhập giá tour!" }]}
              >
                <InputNumber<number> // 👈 ép kiểu rõ ràng thành number
                  style={{ width: 'calc(93% + 30px)' }}
                  placeholder="Nhập giá..."
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
                  }
                  parser={(value) => {
                    const result = value?.replace(/\s?VNĐ|\./g, "");
                    return result ? Number(result) : 0; // 👈 đảm bảo trả về number
                  }}
                />
              </Form.Item>


            </Col>
            <Col span={12}>
              <Form.Item label="Giảm giá (%)" name="discount">
                <InputNumber<number>
                  style={{ width: 'calc(93% + 30px)' }}
                  min={0}
                  max={100}
                  placeholder="Nhập giảm giá..."
                  formatter={(value) => `${value}%`}
                  parser={(value) => {
                    const result = value?.replace('%', '');
                    return result ? Number(result) : 0;
                  }}
                />
              </Form.Item>
            </Col>
            {/* Child & Baby Prices */}
            <Col span={12}>
              <Form.Item label="Giá tour trẻ em" name="childPrice" rules={[{ required: true, message: "Nhập giá tour cho trẻ em!" }]}>
                <InputNumber<number> // 👈 ép kiểu rõ ràng thành number
                  style={{ width: 'calc(93% + 30px)' }}
                  placeholder="Nhập giá..."
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
                  }
                  parser={(value) => {
                    const result = value?.replace(/\s?VNĐ|\./g, "");
                    return result ? Number(result) : 0; // 👈 đảm bảo trả về number
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Giá tour em bé" name="babyPrice" rules={[{ required: true, message: "Nhập giá tour cho em bé!" }]}>
                <InputNumber<number> // 👈 ép kiểu rõ ràng thành number
                  style={{ width: 'calc(93% + 30px)' }}
                  placeholder="Nhập giá..."
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"
                  }
                  parser={(value) => {
                    const result = value?.replace(/\s?VNĐ|\./g, "");
                    return result ? Number(result) : 0; // 👈 đảm bảo trả về number
                  }}
                />
              </Form.Item>
            </Col>
            {/* Số chỗ & Ảnh */}
            <Col span={12}>
              <Form.Item label="Số chỗ tối đa" name="seatsAvailable" rules={[{ required: true, message: "Nhập số chỗ!" }]}>
                <InputNumber style={{ width: 'calc(93% + 30px)' }} min={1} placeholder="Nhập số chỗ..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ảnh tour"
                name="imageUrl"  // Kiểm tra tên đúng, nếu dùng "imageUrl" trên form frontend, cần thống nhất với tên trên backend
                rules={[{ required: true, message: "Vui lòng nhập đường dẫn ảnh!" }]}
              >
                <Input placeholder="Nhập đường dẫn ảnh..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh phụ">
                {form.getFieldValue("additionalImageUrls")?.map((_: string, index: number) => (
                  <Row gutter={16} key={index} align="middle">
                    <Col span={18}>
                      <Form.Item
                        name={["additionalImageUrls", index]}  // 🔄 Đúng với form field
                        label={`Ảnh ${index + 1}`}
                        rules={[{ required: true, message: `Vui lòng nhập đường dẫn ảnh phụ ${index + 1}` }]}
                      >
                        <Input placeholder="Nhập đường dẫn ảnh phụ..." />
                      </Form.Item>
                      {form.getFieldValue("additionalImageUrls")?.[index] && (
                        <img
                          src={form.getFieldValue("additionalImageUrls")[index]}
                          alt="Preview"
                          style={{ marginTop: "8px", width: "100%", maxHeight: "200px", objectFit: "cover" }}
                        />
                      )}
                    </Col>
                    <Col span={6}>
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => {
                          const updated = additionalImageUrls.filter((_, i) => i !== index);
                          setAdditionalImages(updated);
                        }}
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                ))}

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const newImages = [...additionalImageUrls, ""];
                    setAdditionalImages(newImages);
                  }}
                >
                  Thêm ảnh phụ
                </Button>
              </Form.Item>


            </Col>



            <Col span={24}>
              <Form.Item label="Chương trình Tour" required>
                {(programList || []).map((_: any, index: number) => (
                  <Row key={index} gutter={16} align="middle">
                    <Col span={22}>
                      <Form.Item
                        label={`Ngày ${index + 1}`}
                        name={['program', index, 'activities']}
                        rules={[{ required: true, message: `Vui lòng nhập nội dung cho ngày ${index + 1}!` }]}
                      >
                        <Input.TextArea
                          placeholder={`Nhập nội dung hoạt động cho ngày ${index + 1}`}
                          autoSize={{ minRows: 2, maxRows: 4 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => {
                          const newList = [...programList];
                          newList.splice(index, 1);
                          setProgramList(newList);
                          const currentProgram = form.getFieldValue('program') || [];
                          currentProgram.splice(index, 1);
                          form.setFieldsValue({ program: currentProgram });
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  className="mt-2"
                  onClick={() => {
                    setProgramList([...programList, { activities: "" }]);
                    const currentProgram = form.getFieldValue('program') || [];
                    form.setFieldsValue({ program: [...currentProgram, { activities: "" }] });
                  }}
                >
                  Thêm ngày
                </Button>
              </Form.Item>
            </Col>
            {/* Tour nổi bật năm 2025 */}
            <Col span={24}>
              <Form.Item name="isFeatured" valuePropName="checked">
                <Checkbox>Tour nổi bật của năm 2025</Checkbox>
              </Form.Item>
            </Col>
            {/* Nút Submit */}
            <Col span={24}>
              <Button type="primary" htmlType="submit" className="w-full" disabled={!token}>
                Thêm Tour
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Link to="/admin/tours" className="flex items-center gap-2 text-[15px] text-blue-600">
        <IoReturnDownBack className="text-[30px]"></IoReturnDownBack>
        <p>Quay lại</p>
      </Link>
    </div>
  );
}
