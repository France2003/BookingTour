import { Select, notification } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { FaPlay, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';  // Import icon từ react-icons

const { Option } = Select;

interface TourStatusProps {
    tourId: string; // ID của tour
    currentStatus: 'active' | 'booked' | 'completed'; // Trạng thái hiện tại của tour
}

function TourStatus({ tourId, currentStatus }: TourStatusProps) {
    // Khai báo state để theo dõi trạng thái hiện tại
    const [status, setStatus] = useState<'active' | 'booked' | 'completed'>(currentStatus);

    // Xử lý thay đổi trạng thái
    const handleStatusChange = async (newStatus: 'active' | 'booked' | 'completed') => {
        try {
            // Gửi yêu cầu PATCH để cập nhật trạng thái
            const response = await axios.patch(`/api/tours/${tourId}/status`, { status: newStatus });

            // Cập nhật trạng thái mới vào state
            setStatus(newStatus);

            notification.success({
                message: 'Cập nhật trạng thái',
                description: `Tour đã được cập nhật trạng thái thành ${newStatus}`,
            });
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                const err = error as { message: string };
                console.error("Lỗi khi cập nhật trạng thái tour:", err.message);
            } else {
                console.error("Một lỗi không xác định đã xảy ra.");
            }

            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật trạng thái tour',
            });
        }
    };

    return (
        <Select
            value={status}  // Lấy giá trị từ state `status`
            onChange={handleStatusChange}  // Cập nhật trạng thái khi người dùng chọn
            style={{ width: 250 }}
            suffixIcon={
                status === 'active' ? (
                    <FaPlay style={{ color: 'green', fontSize: '16px' }} />
                ) : status === 'booked' ? (
                    <FaCalendarCheck style={{ color: 'orange', fontSize: '16px' }} />
                ) : (
                    <FaCheckCircle style={{ color: 'blue', fontSize: '16px' }} />
                )
            }
        >
            <Option value="active" style={{ display: 'flex', alignItems: 'center' }}>
                {/* <FaPlay style={{ color: 'green', marginRight: 8 }} /> */}
                Đang hoạt động
            </Option>
            <Option value="booked" style={{ display: 'flex', alignItems: 'center' }}>
                {/* <FaCalendarCheck style={{ color: 'orange', marginRight: 8 }} /> */}
                Đã đặt
            </Option>
            <Option value="completed" style={{ display: 'flex', alignItems: 'center' }}>
                {/* <FaCheckCircle style={{ color: 'blue', marginRight: 8 }} /> */}
                Đã hoàn thành
            </Option>
        </Select>
    );
}

export default TourStatus;
