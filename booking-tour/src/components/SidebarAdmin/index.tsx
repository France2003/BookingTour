import { Link } from "react-router-dom";
import { FaSignOutAlt, FaChartBar, FaClipboardList, FaShoppingCart, FaUserCog } from "react-icons/fa";

export default function SidePart() {
  return (
    <div className="w-64 bg-white shadow-lg p-5">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Admin Panel</h1>
      <ul className="space-y-4">
        <li className="flex items-center p-3 rounded-lg hover:bg-blue-100">
          <FaChartBar className="mr-3 text-blue-600" />
          <Link to="/admin" className="w-full">Dashboard</Link>
        </li>
        <li className="flex items-center p-3 rounded-lg hover:bg-blue-100">
          <FaClipboardList className="mr-3 text-green-600" />
          <Link to="tours" className="w-full">Quản lý Tour</Link>
        </li>
        <li className="flex items-center p-3 rounded-lg hover:bg-blue-100">
          <FaShoppingCart className="mr-3 text-yellow-600" />
          <Link to="/admin/bookings" className="w-full">Quản lý Đặt Tour</Link>
        </li>
        <li className="flex items-center p-3 rounded-lg hover:bg-blue-100">
          <FaUserCog className="mr-3 text-red-600" />
          <Link to="/admin/users" className="w-full">Quản lý Người Dùng</Link>
        </li>
        <li className="flex items-center p-3 rounded-lg hover:bg-red-100 text-red-600">
          <FaSignOutAlt className="mr-3" />
          <Link to={`/login`}>Đăng Xuất</Link>
        </li>
      </ul>
    </div>
  );
}
