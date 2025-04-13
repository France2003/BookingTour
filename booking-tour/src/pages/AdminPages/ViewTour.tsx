import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { notification, Card, Descriptions, Spin } from 'antd';
import { IoReturnDownBack } from 'react-icons/io5';
import { Helmet } from 'react-helmet';
export default function ViewTour() {
    const { id } = useParams(); // Lấy tourId từ URL
    const [tour, setTour] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/tours/${id}`);
                console.log('Tour data:', response.data);  // Log toàn bộ thông tin tour
                setTour(response.data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể lấy thông tin tour. Vui lòng thử lại!',
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTour();
        }
    }, [id]);


    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!tour) {
        return <div>Không tìm thấy tour!</div>;
    }
    console.log('URL ảnh tour:', tour.image);

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Xem chi tiết tour {tour.tour}</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Chi Tiết Tour</h2>
            <Card title="Thông Tin Tour" bordered={false}>
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="Mã Tour">{tour.tourCode}</Descriptions.Item>
                    <Descriptions.Item label="Tiêu Đề">{tour.tour}</Descriptions.Item>
                    <Descriptions.Item label="Ngày $ Giờ Thêm">
                        {new Date(tour.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương Tiện">{tour.vehicle}</Descriptions.Item>
                    <Descriptions.Item label="Địa Điểm">{tour.location}</Descriptions.Item>

                    <Descriptions.Item label="Nơi Đến">{tour.destination}</Descriptions.Item>
                    <Descriptions.Item label="Thời Gian">{tour.duration}</Descriptions.Item>
                    <Descriptions.Item label="Giá Tour">{tour.price.toLocaleString()} VNĐ</Descriptions.Item>
                    <Descriptions.Item label="Giá Trẻ Em">{tour.childPrice.toLocaleString()} VNĐ</Descriptions.Item>
                    <Descriptions.Item label="Giá Trẻ Sơ Sinh">{tour.babyPrice.toLocaleString()} VNĐ</Descriptions.Item>
                    <Descriptions.Item label="Giảm Giá">{tour.discount}%</Descriptions.Item>
                    <Descriptions.Item label="Ngày Khởi Hành">
                        {new Date(tour.startDate).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: false,
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày Kết Thúc">
                        {new Date(tour.endDate).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: false,
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số Chỗ">{tour.seatsAvailable}</Descriptions.Item>
                    <Descriptions.Item label="Vùng Miền">{tour.region}</Descriptions.Item>
                    <Descriptions.Item label="Trạng Thái">{tour.status}</Descriptions.Item>
                    <Descriptions.Item label="Tour Nổi Bật Của Năm 2025">{tour.isFeatured ? 'Có' : 'Không'}</Descriptions.Item>
                    <Descriptions.Item label="Ảnh Tour" span={2}>
                        {tour.image ? (
                            <img
                                src={tour.image}
                                alt={tour.title}
                                className="w-64"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/150";
                                }}
                            />
                        ) : (
                            <p>Không có ảnh</p>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ảnh Phụ" span={2}>
                        {tour.additionalImageUrls && tour.additionalImageUrls.length > 0 ? (
                            <div className="flex flex-wrap gap-4 mt-2">
                                {tour.additionalImageUrls.map((url: string, idx: number) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Ảnh phụ ${idx + 1}`}
                                        className="w-32 h-32 object-cover rounded border"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/150";
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>Không có ảnh phụ</p>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tour Này Có Gì Hay? ">{tour.highlights}</Descriptions.Item>
                </Descriptions>
                <h3 className="text-xl font-bold mt-6">Chương Trình Tour</h3>
                <div className="mt-4">
                    {tour.program && tour.program.length > 0 ? (
                        tour.program.map((day: any, index: number) => (
                            <div key={index} className="mb-4">
                                <ul >
                                    {day.activities.map((activity: string, activityIndex: number) => (
                                        <li key={activityIndex}>{activity}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>Không có chương trình tour</p>
                    )}
                </div>
            </Card>
            <Link to="/admin/tours" className="flex items-center gap-2 text-[15px] text-blue-600">
                <IoReturnDownBack className="text-[30px]"></IoReturnDownBack>
                <p>Quay lại</p>
            </Link>
        </div>
    );
}
