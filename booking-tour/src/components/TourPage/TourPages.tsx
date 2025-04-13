import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TourPage = () => {
  const { region, item } = useParams(); // Lấy tham số region và item từ URL
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTours = async () => {
        try {
            const regionParam = encodeURIComponent(region || "mien-bac");
            const destinationParam = encodeURIComponent(item || "");

            const response = await axios.get(`http://localhost:3001/api/tours`, {
                params: { region: regionParam, location: destinationParam },
            });

            console.log(response.data); // In ra kết quả trả về từ API để kiểm tra
            setTours(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tours:", error);
            setLoading(false);
        }
    };

    fetchTours();
}, [region, item]);

  return (
    <div className="px-[80px] pt-[650px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1>Tours tại {item}</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : tours.length > 0 ? (
        <div>
          {tours.map((tour, index) => (
            <div key={index}>
              <h2>{tour.title}</h2>
              <p>{tour.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có tour nào ở khu vực này.</p>
      )}
    </div>
  );
};

export default TourPage;
