import { Outlet } from "react-router-dom";
import SidePart from "../../components/SidebarAdmin";

const AdminLayout = () => {
  console.log("RouteAdmin");
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidePart />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
