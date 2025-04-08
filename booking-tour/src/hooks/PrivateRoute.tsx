import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  roleRequired: string;
}

const ProtectedRoute = ({ roleRequired }: ProtectedRouteProps) => {
  const role = localStorage.getItem("role"); // Lấy role từ localStorage

  return role === roleRequired ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
