import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaSuitcase } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalTours: 0,
    revenueData: [],
  });

  // ✅ Cấu hình axios để tự động refresh token khi hết hạn
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          console.log("🔄 Token hết hạn, đang làm mới...");
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("Không tìm thấy refresh token!");

          const refreshResponse = await axios.post("/api/auth/refresh-token", { refreshToken });
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);

          // ✅ Cập nhật headers và gửi lại request ban đầu
          error.config.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error("🚨 Refresh token thất bại:", refreshError);
          localStorage.clear();
          navigate("/login");
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("❌ Lỗi tải dashboard:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Admin Dashboard</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-blue-100 flex items-center p-4">
            <FaMoneyBillWave className="text-4xl text-blue-600" />
            <CardContent>
              <p className="text-gray-500">Tổng Doanh Thu</p>
              <h2 className="text-2xl font-bold">${stats.revenue.toLocaleString()}</h2>
            </CardContent>
          </Card>

          <Card className="bg-green-100 flex items-center p-4">
            <FaUsers className="text-4xl text-green-600" />
            <CardContent>
              <p className="text-gray-500">Tổng Người Dùng</p>
              <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 flex items-center p-4">
            <FaShoppingCart className="text-4xl text-yellow-600" />
            <CardContent>
              <p className="text-gray-500">Lượt Đặt Tour</p>
              <h2 className="text-2xl font-bold">{stats.totalBookings}</h2>
            </CardContent>
          </Card>

          <Card className="bg-red-100 flex items-center p-4">
            <FaSuitcase className="text-4xl text-red-600" />
            <CardContent>
              <p className="text-gray-500">Tổng Số Tour</p>
              <h2 className="text-2xl font-bold">{stats.totalTours}</h2>
            </CardContent>
          </Card>
        </div>

        {/* Doanh Thu Hàng Tháng */}
        <div className="mt-6 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Doanh Thu Hàng Tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
