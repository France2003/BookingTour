import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import Timeline from "../../components/Timeline/Timeline";
import { Helmet } from "react-helmet";

const SuccessPaymentPage = () => {
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra API và lấy thông tin thanh toán
        axios
            .get(`http://localhost:3001/api/bookings/${id}`)
            .then((response) => {
                console.log("Dữ liệu trả về từ API:", response.data);  // In ra dữ liệu trả về từ API
                setPaymentDetails(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy thông tin thanh toán:", error);
                alert("Đã có lỗi xảy ra khi lấy thông tin thanh toán.");
                setLoading(false);
            });
    }, [id]);

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="px-[200px] pt-[620px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <Helmet >
                <meta charSet="utf-8" />
                <title>Thanh toán thành công</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Timeline currentStep={4} />
            <div className="max-w-4xl mx-auto text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-3xl font-bold mt-4">Thanh toán thành công!</h2>
                <p className="mt-2 text-xl text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                <div className="mt-4">
                    <Button
                        type="default"
                        onClick={handleGoHome}
                        className="px-8 py-2 text-lg"
                    >
                        Quay về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPaymentPage;
