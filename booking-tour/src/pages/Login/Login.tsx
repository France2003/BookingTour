import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login({ url }: { url: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();
    console.log(url);
    console.log(isPageLoading);
    useEffect(() => {
        setFadeIn(true);
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Lỗi: ${response.status}`);
            }
    
            // ✅ Lưu Access Token và Refresh Token vào localStorage
            localStorage.setItem("accessToken", data.token); // Chỉ lưu token
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("role", data.user.role); // Lưu vai trò của user
    
            toast.success("🎉 Đăng nhập thành công!", { position: "top-right", autoClose: 2000 });
    
            setIsPageLoading(true);
            setTimeout(() => {
                navigate(data.user.role === "admin" ? "/admin" : "/");
            }, 2000);
    
        } catch (error: any) {
            toast.error(`🚨 ${error.message}`, { position: "top-right", autoClose: 3000 });
            setIsLoading(false);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const refreshToken = async () => {
        try {
            const storedRefreshToken = localStorage.getItem("refreshToken");
            if (!storedRefreshToken) throw new Error("Không tìm thấy refresh token!");

            const response = await fetch("http://localhost:3001/api/auth/refresh-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Không thể làm mới token");
            }

            localStorage.setItem("accessToken", data.accessToken);
            console.log("✅ Token mới đã được cập nhật!");

            return data.accessToken;
        } catch (error) {
            console.error("❌ Lỗi refresh token:", error);
            localStorage.clear();
            window.location.href = "/login"; 
        }
    };
    console.log(refreshToken);
    return (
        <div className={`login min-h-screen flex items-center justify-center text-black bg-gray-900 transition-opacity duration-1000 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
            <Helmet>
                <title>Đăng Nhập</title>
            </Helmet>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Đăng nhập</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                            type="email"
                            id="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Mật khẩu</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={togglePasswordVisibility}
                            style={{ top: '70%', transform: 'translateY(-50%)' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer flex justify-center items-center"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <ClipLoader color="#fff" size={20} /> : "Đăng Nhập"}
                    </button>
                </form>

                <div className="flex w-full justify-between items-center mt-4">
                    <hr className="border-gray-400 w-1/4" />
                    <p className="text-sm text-gray-600">Hoặc đăng nhập với</p>
                    <hr className="border-gray-400 w-1/4" />
                </div>

                <button className="w-full flex justify-center items-center border border-gray-300 bg-white font-bold py-2 px-4 rounded-md mt-4">
                    <FcGoogle className="text-2xl" />
                    <span className="text-black ml-2">Đăng nhập bằng Google</span>
                </button>

                <p className="mt-4 text-center">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:text-blue-400">Đăng ký</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
