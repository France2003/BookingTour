import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PassengerInformation = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/bookings/${bookingId}`);
        setBooking(res.data);

        const totalPassengers = [
          ...Array(res.data.adults).fill({ type: "adult" }),
          ...Array(res.data.children).fill({ type: "child" }),
          ...Array(res.data.babies).fill({ type: "baby" }),
        ].map((p, index) => ({
          ...p,
          name: "",
          dob: "",
          gender: "",
          key: index,
        }));

        setPassengers(totalPassengers);
      } catch (error) {
        console.error("Lỗi khi tải booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async () => {
    const isValid = passengers.every(p => p.name && p.dob && p.gender);
    if (!isValid) {
      alert("Vui lòng điền đầy đủ thông tin hành khách.");
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/bookings/${bookingId}/passengers`, {
        passengers,
      });

      navigate(`/booking-success/${bookingId}`);
    } catch (error) {
      console.error("Lỗi khi gửi thông tin hành khách:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải thông tin...</div>;
  if (!booking) return <div className="text-center py-10 text-red-500">Không tìm thấy booking.</div>;

  return (
    <div className='px-[80px] pt-[620px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen'>
      <h2 className="text-2xl font-bold mb-6">THÔNG TIN HÀNH KHÁCH</h2>
      <div className="space-y-8">
        {passengers.map((p, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">Hành khách {index + 1} ({p.type})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Họ và tên"
                value={p.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                placeholder="Ngày sinh"
                value={p.dob}
                onChange={(e) => handleChange(index, "dob", e.target.value)}
                className="border rounded px-3 py-2"
              />
              <select
                value={p.gender}
                onChange={(e) => handleChange(index, "gender", e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default PassengerInformation;
