import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TourDetailPage = () => {
  const { tourCode } = useParams(); // Nhận mã tour từ URL
  const [tour, setTour] = useState<any>(null);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/tours/${tourCode}`);
        setTour(response.data);
      } catch (error) {
        console.error("Error fetching tour details:", error);
      }
    };

    if (tourCode) {
      fetchTourDetails();
    }
  }, [tourCode]);

  if (!tour) {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-[80px] pt-[650px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1>{tour.title}</h1>
      <p>{tour.description}</p>
      <img src={tour.image} alt={tour.title} />
      <p>{tour.price}</p>
      {/* Thêm các thông tin khác về tour nếu có */}
    </div>
  );
};

export default TourDetailPage;
