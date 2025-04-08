import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

// Kiểu dữ liệu người dùng
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Điều khiển Modal xóa
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Gọi API lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Hiển thị modal xác nhận
  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  // Xử lý xóa người dùng
  const confirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      await axios.delete(`http://localhost:3001/api/auth/users/${selectedUserId}`);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Đã xảy ra lỗi khi xóa người dùng.");
    } finally {
      setShowModal(false);
      setSelectedUserId(null);
    }
  };

  // Bộ lọc tìm kiếm
  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    user._id?.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Danh sách Người Dùng</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <h2 className="text-xl font-bold mb-4">Quản lý người dùng</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="🔍 Nhập id hoặc tên khách hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-l-md w-72 focus:outline-none"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
          Tìm kiếm
        </button>
      </div>

      {loading ? (
        <div>Đang tải dữ liệu người dùng...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="px-4 py-3 text-center">STT</th>
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Số điện thoại</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-3 text-center font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link to={`/admin/users/view/${user._id}`} title="Xem">
                        <Eye size={18} className="text-blue-500 hover:scale-110 transition-transform" />
                      </Link>
                      <button
                        className="text-red-500 hover:scale-110 transition-transform"
                        title="Xóa"
                        onClick={() => openDeleteModal(user._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showModal && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-md shadow w-full max-w-sm">
      <h3 className="text-base font-medium mb-2">Xác nhận xóa người dùng</h3>
      <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn xóa người dùng này không?</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          onClick={() => setShowModal(false)}
        >
          Hủy
        </button>
        <button
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          onClick={confirmDelete}
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default UserList;
