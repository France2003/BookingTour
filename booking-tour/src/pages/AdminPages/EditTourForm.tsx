import { Form, Input, InputNumber, DatePicker, Button, Checkbox, notification, Row, Col, Card, Select } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from 'dayjs';
import { IoReturnDownBack } from "react-icons/io5";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
export default function EditTourForm() {
    const { id } = useParams();
    const [programList, setProgramList] = useState([{ activities: "" }]);
    if (!id) {
        return <div>Không tìm thấy tourId.</div>;
    }
    console.log(id);
    const [form] = Form.useForm();
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (!storedToken) {
            notification.error({
                message: "Lỗi!",
                description: "Không tìm thấy token, bạn cần đăng nhập lại!",
            });
        }
        setToken(storedToken);
        const fetchTour = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/tours/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });
                console.log(response.data);  // Log dữ liệu nhận được

                // Kiểm tra và chuyển đổi ngày nếu cần
                if (response.data.startDate) {
                    response.data.startDate = dayjs(response.data.startDate);
                }
                if (response.data.endDate) {
                    response.data.endDate = dayjs(response.data.endDate);
                }

                form.setFieldsValue(response.data);
            } catch (error) {
                console.error("Lỗi khi tải tour:", error);
                notification.error({
                    message: "Lỗi!",
                    description: "Không thể tải thông tin tour. Vui lòng thử lại.",
                });
            }
        };



        fetchTour();
    }, [id, form]);
    const onFinish = async (values: any) => {
        if (!token) {
            notification.error({
                message: "Lỗi!",
                description: "Vui lòng đăng nhập để thực hiện hành động này!",
            });
            return;
        }

        setLoading(true);
        const programWithDays = (values.program || []).map((item: any, index: number) => ({
            day: index + 1,
            activities: typeof item.activities === "string" ? [item.activities] : item.activities,
        }));
        try {
            const formattedValues = {
                ...values,
                program: programWithDays,
                startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
                endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
                isFeatured: values.isFeatured || false,
                price: Number(values.price),
                childPrice: Number(values.childPrice),  // Đảm bảo gửi giá tour trẻ em
                babyPrice: Number(values.babyPrice),    // Đảm bảo gửi giá tour em bé
                seatsAvailable: Number(values.seatsAvailable),
            };

            const response = await axios.put(`http://localhost:3001/api/tours/${id}`, formattedValues, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            notification.success({
                message: "Thành công!",
                description: `Tour "${values.title}" đã được cập nhật thành công!`,
            });

            form.resetFields();
        } catch (error) {
            console.error("Lỗi khi cập nhật tour:", error);
            notification.error({
                message: "Lỗi!",
                description: "Cập nhật tour thất bại, vui lòng thử lại!",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Chỉnh Sửa Tour</h2>
            <Card variant="outlined" className="shadow-md">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ discount: 0, isFeatured: false }}
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
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    className="w-full"
                                    value={form.getFieldValue('startDate') ? dayjs(form.getFieldValue('startDate')) : null}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true, message: "Chọn ngày kết thúc!" }]}>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    className="w-full"
                                    value={form.getFieldValue('endDate') ? dayjs(form.getFieldValue('endDate')) : null}
                                />
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
                        {/* Giá tour trẻ em & em bé */}
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
                            <Form.Item label="Ảnh tour" name="imageUrl" rules={[{ required: true, message: "Vui lòng nhập đường dẫn ảnh!" }]}>
                                <Input placeholder="Nhập đường dẫn ảnh..." />
                            </Form.Item>
                        </Col>
                        {/* Chương trình tour */}
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
                            <Button type="primary" htmlType="submit" className="w-full" disabled={loading || !token}>
                                {loading ? "Đang cập nhật..." : "Cập nhật Tour"}
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
