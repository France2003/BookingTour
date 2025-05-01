import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye
} from "react-icons/fa";
import { Modal, message, Pagination } from "antd"; // 👉 Đã thêm Pagination
import TourStatus from "./TourStatus";
import { Helmet } from "react-helmet";

// 🟢 1️⃣ Kiểu dữ liệu Tour
interface Tour {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: "active" | "booked" | "completed";
}

export default function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState<string>("");

  // 🟣 Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    try {
      const response = await axios.get("/api/tours");
      setTours(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tour", error);
    }
  }

  function showDeleteConfirm(id: string) {
    setTourIdToDelete(id);
    setIsModalVisible(true);
  }

  function handleCancel() {
    setIsModalVisible(false);
    setTourIdToDelete("");
  }

  async function deleteTour() {
    if (tourIdToDelete) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        await axios.delete(`/api/tours/${tourIdToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        message.success("Xóa tour thành công!");
        fetchTours();
        handleCancel();
      } catch (error) {
        console.error("Lỗi khi xóa tour", error);
        message.error("Lỗi khi xóa tour");
      }
    }
  }

  async function updateTourStatus(tourId: string, status: Tour["status"]) {
    try {
      await axios.patch(`/api/tours/${tourId}/status`, { status });
      message.success("Cập nhật trạng thái tour thành công!");
      fetchTours();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái tour!");
    }
  }

  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Quản Lí Tour</title>
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Tour</h1>
        <Link
          to="add"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >
          <FaPlus /> Thêm Tour
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm tour..."
            className="border border-gray-300 rounded-lg p-2 pl-10 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
            }}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-sm">
              <th className="p-3 text-center">STT</th>
              <th className="p-3">Tên tour</th>
              <th className="p-3">Ngày khởi hành</th>
              <th className="p-3">Ngày kết thúc</th>
              <th className="p-3">Ngày & giờ thêm</th>
              <th className="p-3 text-center">Hoạt động</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTours.length > 0 ? (
              paginatedTours.map((tour, index) => (
                <tr key={tour._id} className="border-b hover:bg-gray-100 text-sm">
                  <td className="p-3 text-center font-semibold">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="p-3">{tour.title}</td>
                  <td className="p-3">
                    {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3">
                    {new Date(tour.endDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3">
                    {new Date(tour.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="p-3 text-center">
                    <TourStatus tourId={tour._id} currentStatus={tour.status} />
                  </td>
                  <td className="p-3 flex justify-center items-center gap-4">
                    <Link to={`/admin/tours/view/${tour._id}`} className="text-blue-500 hover:text-blue-600">
                      <FaEye size={18} />
                    </Link>
                    <Link to={`/admin/tours/edit/${tour._id}`} className="text-yellow-500 hover:text-yellow-600">
                      <FaEdit size={18} />
                    </Link>
                    <button
                      onClick={() => showDeleteConfirm(tour._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Không tìm thấy tour phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 🔵 Pagination */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredTours.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        visible={isModalVisible}
        onOk={deleteTour}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa tour này?</p>
      </Modal>
    </div>
  );
}
