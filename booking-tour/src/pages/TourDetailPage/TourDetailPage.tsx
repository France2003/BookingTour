import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaClock, FaBusAlt } from "react-icons/fa";
import RelatedTours from "../../components/RelatedTours/RelatedTours";
import ReviewSection from "../../components/Review/ReviewSection";
import { Helmet } from "react-helmet";

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/tours/${id}`);
        setTour(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-lg">Đang tải dữ liệu...</div>;
  if (!tour) return <div className="text-center py-10 text-red-500">Không tìm thấy tour.</div>;

  return (
    <div className="px-[80px] pt-[620px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tour {tour.title}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="relative mb-3">
        <h1 className="text-4xl w-full  bg-[#1B2426] p-[25px] opacity-80 absolute mt-[270px] z-100 font-bold text-white mb-6">{tour.title}</h1>
        <img
          src={tour.image || "/default-tour.jpg"}
          alt={tour.title}
          className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
        />
        <span className="text-white bg-[#FF002C] -mt-[15px] px-3 p-2 rounded">Giảm 700.000đ/khách</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
        <p><FaClock className="inline-block mr-2 text-black" /> <strong>Thời gian:</strong> {tour.duration}</p>
        <p><FaBusAlt className="inline-block mr-2 text-black" /> <strong>Phương tiện:</strong> {tour.vehicle}</p>
        <p><FaMapMarkerAlt className="inline-block mr-2 text-black" /> <strong>Xuất phát:</strong> {tour.location}</p>
        <p><FaMapMarkerAlt className="inline-block mr-2 text-black" /> <strong>Điểm đến:</strong> {tour.destination}</p>
      </div>
      <table className="w-full table-auto mt-5  text-left text-black shadow-sm">
        <thead className="bg-[#FFEDDF] text-center">
          <tr>
            <th className="p-3 ">Khởi hành</th>
            <th className="p-3 ">Mã tour</th>
            <th className="p-3 ">Giá</th>
            <th className="p-3 ">Giá trẻ em</th>
            <th className="p-3 ">Giá em bé</th>
            <th className="p-3 "></th>
          </tr>
        </thead>
        <tbody className="bg-[#FFEDDF] text-center border-t">
          <tr key={id} className="">
            <td className="p-3 font-bold ">{new Date(tour.startDate).toLocaleDateString("vi-VN")}</td>
            <td className="p-3 font-bold ">{tour.tourCode}</td>
            <td className="p-3  text-orange-600 font-semibold">{Number(tour.price).toLocaleString("vi-VN")} VNĐ</td>
            <td className="p-3  text-orange-600 font-semibold">{Number(tour.childPrice).toLocaleString("vi-VN")} VNĐ</td>
            <td className="p-3 text-orange-600 font-semibold ">{tour.babyPrice === 0 ? "Miễn phí" : `${Number(tour.babyPrice).toLocaleString("vi-VN")} VNĐ`}</td>
            <td className="p-3 ">
              <button
                onClick={() => navigate(`/dat-tour/${id}`)}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm"
              >
                Mua Online
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-5 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Tour này có gì hay</h2>
        <ul className="list-none space-y-2">
          {tour.highlights.map((highlight: string, index: number) => (
            <li key={index} className="flex  items-center">
              <FaMapMarkerAlt className="mr-2 text-orange-500" /> {highlight}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Ảnh trong tour</h2>
        {tour.additionalImageUrls && tour.additionalImageUrls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tour.additionalImageUrls.map((url: string, idx: number) => (
              <div key={idx} className="w-full h-60 overflow-hidden rounded-lg shadow">
                <img
                  src={url}
                  alt={`Ảnh phụ ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>Không có ảnh phụ</p>
        )}
      </div>
      <div className="mt-5 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Chương trình tour</h2>
        {tour.program && tour.program.length > 0 ? (
          tour.program.map((day: any, index: number) => (
            <div key={index} className="mb-4">
              <ul className="list-disc space-y-2">
                {day.activities.map((activity: string, activityIndex: number) => (
                  <li key={activityIndex} className="flex items-start">
                    <span
                      dangerouslySetInnerHTML={{ __html: activity }}
                      className="leading-relaxed"
                    />
                  </li>
                ))}
              </ul>
              {tour.additionalImageUrls && tour.additionalImageUrls.length > index ? (
                <div className="mt-4 w-full  overflow-hidden rounded-lg shadow">
                  <img
                    src={tour.additionalImageUrls[index]}
                    alt={`Ảnh ngày ${index + 1}`}
                    className="w-full h-[580px] object-cover "
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x200";
                    }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2"></p>
              )}
            </div>
          ))
        ) : (
          <p>Không có chương trình tour</p>
        )}

      </div>
      {/* Tour liên quan */}
      <div>
        <RelatedTours currentRegion={tour.region} />
      </div>
      {/* //Đánh giá */}
      <ReviewSection tourId={tour!._id} existingReviews={tour?.reviews || []} />
      <div className="mt-5 text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Lưu ý khi kết thúc tour</h2>
        <p>Quý khách vui lòng lưu ý các thông tin sau khi tour kết thúc:</p>
        <p>• Đối với tour du lịch bằng máy bay, quý khách sẽ được đưa ra sân bay để trở về điểm đón ban đầu.</p>
        <p>• Đối với tour du lịch bằng xe khách, xe sẽ đưa quý khách trở lại điểm đón ban đầu.</p>
        <p>• Đối với tour du lịch bằng xe máy, lịch trình linh hoạt và quý khách có thể chủ động sắp xếp lộ trình về.</p>
      </div>
      {/* Thông tin về bảo hiểm du lịch */}
      <div className="mt-5 text-gray-700">
        <h2 className="text-[16px]  text-[#3D70A5] font-bold mb-4 underline  ">Thông tin bảo hiểm du lịch</h2>
        <div className="">
          <p>Công ty TNHH Một Thành Viên Dịch vụ Lữ hành Saigontourist thực hiện chương trình TẶNG MIỄN PHÍ BẢO HIỂM DU LỊCH NỘI ĐỊA dành cho tất cả du khách của Công ty và các chi nhánh trực thuộc tham gia tour trọn gói trên tất cả các tuyến du lịch nội địa,
            khởi hành trên toàn quốc, với mức bảo hiểm tối đa lên đến 150.000.000 VNĐ/khách/vụ. </p>
          <p className="mt-5">Toàn bộ phí bảo hiểm được tặng miễn phí cho khách hàng của Lữ hành Saigontourist với chương trình, giá và chất lượng dịch vụ tour không đổi.</p>
          <p>Thông tin chi tiết, vui lòng liên hệ các văn phòng thuộc Hệ thống Lữ hành Saigontourist trên toàn quốc.</p>
        </div>
        <div className="flex  items-center gap-[25px] mt-3 ">
          <h2 className="text-[16px] mt-3 text-[#3D70A5] font-bold mb-4 underline  ">Các địa chỉ liên hệ với Lữ hành Saigontourist</h2>
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="p-[5px] text-[#ff891e] mt-[-10px] font-bold border border-amber-500 rounded hover:bg-amber-100 transition"
          >
            {showDetail ? "Thu gọn ▲" : "Xem thêm ▼"}
          </button>
          {showDetail && (
            <div className=" bg-gray-100  space-y-6 p-4 rounded-xl absolute mt-[530px] shadow text-sm leading-relaxed">
              <div className="border-b">
                <p><strong>Hotline:</strong>0363977687</p>
                <p><strong>Email:</strong> Phapcv2003@gmail.com</p>
                <p><strong>Tên: </strong>Bùi Đình Pháp</p>
                <p className="">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để mang đến trải nghiệm tốt nhất.</p>
              </div>
              <div className="border-b">
                <p><strong>Hotline:</strong>0363977687</p>
                <p><strong>Email:</strong> Nhatcv2003@gmail.com</p>
                <p><strong>Tên: </strong>Lê Văn Nhật</p>
                <p className="">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để mang đến trải nghiệm tốt nhất.</p>
              </div>
              <div className="border-b">
                <p><strong>Hotline:</strong>0363977687</p>
                <p><strong>Email:</strong> AnhQuocQN2003@gmail.com</p>
                <p><strong>Tên: </strong>Bùi Văn Anh Quốc</p>
                <p className="">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để mang đến trải nghiệm tốt nhất.</p>
              </div>
              <div className="border-b">
                <p><strong>Hotline:</strong>0363977687</p>
                <p><strong>Email:</strong> ThuAnGL2003@gmail.com</p>
                <p><strong>Tên: </strong>Nguyễn Thị Thu Ân</p>
                <p className="">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để mang đến trải nghiệm tốt nhất.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TourDetail;
