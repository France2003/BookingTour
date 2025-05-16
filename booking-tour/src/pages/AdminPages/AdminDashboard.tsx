import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaSuitcase } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

interface RevenueItem {
  month: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<{
    revenue: number;
    totalUsers: number;
    totalBookings: number;
    totalTours: number;
    revenueData: RevenueItem[];
  }>({
    revenue: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalTours: 0,
    revenueData: [],
  });

  // const maxRevenue = Math.max(...stats.revenueData.map((d) => d.totalRevenue), 0);
  // const roundedMax = Math.ceil(maxRevenue / 10000000) * 10000000 || 10000000; // Tránh 0

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("Không tìm thấy refresh token!");

          const refreshResponse = await axios.post("/api/auth/refresh-token", { refreshToken });
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);

          error.config.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
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
        const [statsRes, revenueRes] = await Promise.all([
          axios.get("/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/revenue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const revenueList: RevenueItem[] = revenueRes.data || [];
        const totalRevenue = revenueList.reduce(
          (sum: number, item: RevenueItem) => sum + item.totalRevenue,
          0
        );

        setStats((prev) => ({
          ...prev,
          ...statsRes.data,
          revenue: totalRevenue,
          revenueData: revenueList,
        }));
      } catch (error) {
        console.error("❌ Lỗi tải dashboard:", error);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("vi-VN") + " VND";

  return (
    <div className="flex h-screen bg-gray-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Admin Dashboard</title>
      </Helmet>
      <div className="flex-1 p-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-blue-100 flex items-center p-4">
            <FaMoneyBillWave className="text-4xl text-blue-600" />
            <CardContent>
              <p className="text-gray-500">Tổng Doanh Thu</p>
              <h2 className="text-2xl font-bold">{formatCurrency(stats.revenue)}</h2>
            </CardContent>
          </Card>

          <Card className="bg-green-100 flex items-center p-4">
            <FaUsers className="text-4xl text-green-600" />
            <CardContent>
              <p className="text-gray-500">Tổng Người Dùng</p>
              <h2 className="text-2xl font-bold">{stats.totalUsers || 0}</h2>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 flex items-center p-4">
            <FaShoppingCart className="text-4xl text-yellow-600" />
            <CardContent>
              <p className="text-gray-500">Lượt Đặt Tour</p>
              <h2 className="text-2xl font-bold">{stats.totalBookings || 0}</h2>
            </CardContent>
          </Card>

          <Card className="bg-red-100 flex items-center p-4">
            <FaSuitcase className="text-4xl text-red-600" />
            <CardContent>
              <p className="text-gray-500">Tổng Số Tour</p>
              <h2 className="text-2xl font-bold">{stats.totalTours || 0}</h2>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Doanh Thu Hàng Tháng</h2>
          {stats.revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280} className={"mt-4"}>
              <BarChart
                data={stats.revenueData}
                margin={{ top: 15, right: 20, left: 60, bottom: 30 }}
              >
                <XAxis
                  dataKey="month"
                  tickFormatter={(month) => `Th${month}`}
                  fontSize={13}
                />
                <YAxis
                  domain={[0, 100000000]}
                  tickCount={11}
                  fontSize={13}
                  tickFormatter={(value: number) =>
                    value.toLocaleString("vi-VN") + " VND"
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString("vi-VN") + " VND"
                  }
                  labelFormatter={(label: any) => `Tháng ${label}`}
                />
                <Bar dataKey="totalRevenue" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>


          ) : (
            <p className="text-gray-500">Không có dữ liệu doanh thu cho tháng này.</p>
          )}
        </div>
      </div>
    </div>
  );
}
