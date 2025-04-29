import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Tour {
  _id: string;
  title: string;
  image: string;
  price: number;
  region: string;
}

interface RelatedToursProps {
  currentRegion: string;
}

const RelatedTours = ({ currentRegion }: RelatedToursProps) => {
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // State để theo dõi slide hiện tại
  const slidesToShow = 4; // Số lượng tour hiển thị trên mỗi slide (4 tour)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedTours = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/tours`);
        const filtered = response.data.filter((tour: Tour) => tour.region === currentRegion);
        setRelatedTours(filtered.slice(0, 8)); // Lấy tối đa 7 tour liên quan
      } catch (error) {
        console.error("Lỗi khi lấy tour liên quan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedTours();
  }, [currentRegion]);

  if (loading) return <div className="text-center py-10 text-lg">Đang tải tour liên quan...</div>;

  if (relatedTours.length === 0) {
    return <div className="text-center py-10 text-gray-500">Không tìm thấy tour liên quan.</div>;
  }

  const handleNext = () => {
    // Kiểm tra nếu là nhóm cuối cùng, quay lại nhóm đầu tiên
    if (currentSlide < Math.ceil(relatedTours.length / slidesToShow) - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0); // Quay lại nhóm đầu tiên khi đến cuối
    }
  };

  const handlePrev = () => {
    // Quay lại nhóm trước đó
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(Math.ceil(relatedTours.length / slidesToShow) - 1); // Quay lại nhóm cuối cùng khi đến đầu
    }
  };

  // Chia các tour thành các nhóm
  const groupedTours = [];
  for (let i = 0; i < relatedTours.length; i += slidesToShow) {
    groupedTours.push(relatedTours.slice(i, i + slidesToShow));
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6 text-[#0069AD] text-center">Các Tour Liên Quan</h2>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {groupedTours.map((group, index) => (
              <div
                key={index}
                className="flex-shrink-0 min-w-full flex justify-between gap-4"
              >
                {group.map((tour) => (
                  <div
                    key={tour._id}
                    className="rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 w-[300px] h-[400px]" // Đặt kích thước cố định cho ô
                  >
                    <img
                      src={tour.image || "/default-tour.jpg"}
                      alt={tour.title}
                      className="w-full h-[200px] object-cover"  // Cập nhật chiều cao ảnh
                    />
                    <div className="p-4 h-[200px] flex flex-col justify-between">
                      <h3 className="font-semibold text-lg truncate mb-2">{tour.title}</h3>
                      
                      <p className="text-orange-600 font-bold mb-4">{Number(tour.price).toLocaleString("vi-VN")} VNĐ</p>
                      <button
                        onClick={() => navigate(`/tour/${tour._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Nút điều hướng */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
        >
          &#10094;
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default RelatedTours;
