import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdAccessTime, MdCalendarToday, MdConfirmationNumber } from "react-icons/md";
import { CreditCard, DollarSign } from "lucide-react";
import { FaBaby, FaChild, FaUser } from "react-icons/fa";
import Timeline from "../../components/Timeline/Timeline";
import { Helmet } from "react-helmet";

const PassengerInformation = () => {
  const [booking, setBooking] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    region: ""
  });
  useEffect(() => {
    if (!bookingId) {
      setError("Không có ID của booking.");
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/bookings/${bookingId}`);
        console.log(res.data); // Kiểm tra dữ liệu nhận được từ API

        // Kiểm tra nếu phản hồi có dữ liệu hợp lệ
        if (res.data && res.data.adults !== undefined && res.data.children !== undefined && res.data.babies !== undefined) {
          setBooking(res.data);

          // Tạo danh sách hành khách từ dữ liệu booking
          const totalPassengers = [
            ...Array(res.data.adults).fill({ type: "adult", name: "", gender: "", firstName: "", phone: "", address: "", passport: "" }),
            ...Array(res.data.children).fill({ type: "child", name: "", gender: "", firstName: "", phone: "", address: "", passport: "" }),
            ...Array(res.data.babies).fill({ type: "baby", name: "", gender: "", firstName: "", phone: "", address: "", passport: "" }),
          ];

          setPassengers(totalPassengers);
        } else {
          setError("Không tìm thấy thông tin booking.");
        }
      } catch (error) {
        setError("Lỗi khi tải thông tin booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleChange = (index: number, field: string, value: string) => {
    setPassengers((prevPassengers) => {
      const updatedPassengers = [...prevPassengers]; // Sao chép mảng hành khách hiện tại
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value }; // Cập nhật hành khách cụ thể
      return updatedPassengers; // Trả lại mảng hành khách đã được cập nhật
    });
  };
  const handleSubmit = async () => {
    // Kiểm tra dữ liệu hành khách
    const isValid = passengers.every(
      (p) => p.name && p.gender && p.firstName && p.phone && p.address && p.passport
    );

    if (!isValid) {
      alert("Vui lòng điền đầy đủ thông tin hành khách.");
      return;
    }

    try {
      // Gửi yêu cầu tới backend để thêm thông tin hành khách
      const response = await axios.post(
        `http://localhost:3001/api/bookings/${bookingId}/passengers`,
        {
          passengers,
          contact,  // Nếu bạn có thông tin liên hệ cần gửi
        }
      );
      console.log("Dữ liệu hành khách đã được gửi thành công:", response.data);
      // Điều hướng đến trang thanh toán
      navigate(`/thanh-toan/${bookingId}`, {
        state: {
          adults: booking.adults,
          children: booking.children,
          babies: booking.babies,
          passengers,
          contact,
          paymentType: booking.paymentType,
          paymentMethod: booking.paymentMethod,
          total: finalPayment,
          tour: booking.tourId,
          booking: booking,
          bookingDate: booking.date,
        },
      });
    } catch (error) {
      console.error("Lỗi khi gửi thông tin hành khách:", error);
      alert("Lỗi khi gửi thông tin hành khách.");
    }
  };
  console.log(passengers);
  if (loading) return <div className="text-center py-10">Đang tải thông tin...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!booking) return <div className="text-center py-10 text-red-500">Không tìm thấy booking.</div>;
  const adultPrice = Number(booking.amount) || 0;
  const childPrice = Number(booking.tourId?.childPrice) || 0;
  const babyPrice = Number(booking.tourId?.babyPrice) || 0;
  const total =
    (booking.adults * adultPrice) +
    (booking.children * childPrice) +
    (booking.babies * babyPrice);

  const finalPayment = booking.paymentType === "full" ? total : total / 2;
  return (
    <div className="px-[80px] pt-[620px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Thông tin khách hàng</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Timeline currentStep={2} />
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-lg mb-2">Thông tin liên hệ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text:placeholder-gray-500">
          <div>
            <input
              type="text"
              placeholder="Tên *"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              className=" border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Số điện thoại *"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className=" border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email *"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className=" border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Địa chỉ *"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className=" border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Thành phố"
              value={contact.city}
              onChange={(e) => setContact({ ...contact, city: e.target.value })}
              className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <select
              value={contact.region}
              onChange={(e) => setContact({ ...contact, region: e.target.value })}
              className="border bg-[#e0e0e0] border-[#ccc] text:placeholder-gray-500 rounded px-3 py-2 w-full"
            >
              <option value="">Chọn vùng miền</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
            </select>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-5">THÔNG TIN HÀNH KHÁCH</h2>
      <div className="p-4 grid grid-cols-1 text:placeholder-gray-500 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-6">
          {passengers.map((p, index) => (
            <div key={index} className="bg-white p-4 rounded text:placeholder-gray-500 shadow">
              <h3 className="font-semibold text-lg mb-2">
                Hành khách {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={p.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)} // Cập nhật hành khách cụ thể
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tên"
                    value={p.firstName}
                    onChange={(e) => handleChange(index, "firstName", e.target.value)} // Cập nhật hành khách cụ thể
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={p.phone}
                    onChange={(e) => handleChange(index, "phone", e.target.value)} // Cập nhật hành khách cụ thể
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={p.address}
                    onChange={(e) => handleChange(index, "address", e.target.value)} // Cập nhật hành khách cụ thể
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <select
                    value={p.gender}
                    onChange={(e) => handleChange(index, "gender", e.target.value)} // Cập nhật hành khách cụ thể
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <select
                    value={p.region}
                    onChange={(e) => handleChange(index, "region", e.target.value)}
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                  >
                    <option value="">Chọn vùng miền</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Nam">Miền Nam</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Passport"
                    value={p.passport}
                    onChange={(e) => handleChange(index, "passport", e.target.value)} // Cập nhật hành khách cụ thể
                    className="border bg-[#e0e0e0] border-[#ccc] rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center mt-4 justify-between">
            <Link
              to={`/dat-tour/${bookingId}`}

              className="bg-gray-300 text-black py-2 px-6 rounded text-lg font-bold transition-all hover:bg-gray-400 hover:shadow-lg"
            >
              Quay lại
            </Link>
            <button
              onClick={handleSubmit}
              className="bg-orange-400 text-white py-2 px-10 rounded text-lg font-bold transition-all hover:bg-orange-500 hover:shadow-lg "
            >
              Tiếp tục
            </button>
          </div>
        </div>
        {/* Right Section: Tour Summary */}
        <div className="space-y-4">
          <button className="bg-orange-400 text-white w-full py-2 rounded text-lg font-bold">
            Hỗ trợ giao dịch 1900 1808
          </button>

          <div className="bg-white rounded shadow p-4">
            {booking.tourId?.image && (
              <img
                src={booking.tourId.image}
                alt="Ảnh tour"
                className="rounded-lg shadow object-cover w-full h-[200px]"
              />
            )}

            <div className="rounded-lg shadow-lg bg-white p-4 mt-4">
              <p className="text-lg font-semibold mb-2">{booking.tourId?.title}</p>
              <ul className="space-y-2 text-sm text-gray-800">
                <li className="flex items-center gap-2">
                  <MdConfirmationNumber className="text-black" />
                  <span><strong>Code:</strong> {booking.tourId?.tourCode}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdCalendarToday className="text-black" />
                  <span><strong>Ngày đi:</strong> {new Date(booking.date).toLocaleDateString("vi-VN")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdCalendarToday className="text-black" />
                  <span><strong>Ngày về:</strong> {new Date(booking.tourId?.endDate).toLocaleDateString("vi-VN")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdAccessTime className="text-black" />
                  <span><strong>Thời gian:</strong> {booking.tourId?.duration}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaUser className="text-black" />
                  <span><strong>Giá người lớn:</strong> {new Intl.NumberFormat("vi-VN").format(booking.amount)} ₫</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaChild className="text-black" />
                  <span><strong>Giá trẻ em:</strong> {new Intl.NumberFormat("vi-VN").format(booking.tourId?.childPrice)} ₫</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaBaby className="text-black" />
                  <span><strong>Giá em bé:</strong> {new Intl.NumberFormat("vi-VN").format(booking.tourId?.babyPrice)} ₫</span>
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-black" />
                  <span><strong>Hình thức thanh toán:</strong> {booking.paymentType === "full" ? "Thanh toán 100%" : "Thanh toán 50%"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-black" />
                  <span><strong>Phương thức thanh toán:</strong> {booking.paymentMethod === "atm" ? "Thẻ ATM nội địa" : "Ví Momo"}</span>
                </li>
              </ul>

              <p className="mt-4 text-lg font-bold text-red-600 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-500" />
                Tổng thanh toán: {new Intl.NumberFormat("vi-VN").format(finalPayment)} VNĐ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerInformation;
