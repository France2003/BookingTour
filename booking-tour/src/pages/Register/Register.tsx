import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Register({ url }: { url: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [sdt, setSdt] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    const validateSdt = (sdt: string) => /^(?:\+84|0)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])\d{7}$/.test(sdt);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!validateEmail(email)) {
            toast.error("📧 Email không hợp lệ!");
            setLoading(false);
            return;
        }
        if (!validatePassword(password)) {
            toast.error("🔑 Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.");
            setLoading(false);
            return;
        }
        if (!validateSdt(sdt)) {
            toast.error("📱 Số điện thoại không hợp lệ!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3001/api/auth/register`, { 
                phone: sdt, 
                email, 
                password 
            });
            if (response.status === 201) {
                toast.success("✅ Đăng ký thành công! Chuyển hướng...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                toast.error("❌ Đăng ký thất bại, vui lòng thử lại!");
            }
        } catch (error: any) {
            console.error("Lỗi API:", error?.response?.data || error.message);
            toast.error(error?.response?.data?.message || "❌ Lỗi máy chủ, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    }, [email, sdt, password, navigate]);

    return (
        <div className="register min-h-screen flex items-center justify-center bg-gray-900 text-black">
            <Helmet>
                <title>Đăng ký</title>
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Đăng ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                        <input
                            className="w-full px-3 py-2 border rounded-md"
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            className="w-full px-3 py-2 border rounded-md"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                        <input
                            className="w-full px-3 py-2 border rounded-md"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="absolute inset-y-0 top-[30px] right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>
                </form>
                <div className='flex w-full justify-between items-center mt-[15px]'>
                    <hr className='border border-[#707577] w-[80px]' />
                    <p className='text-[15px]'>Hoặc đăng nhập/đăng ký với</p>
                    <hr className='border border-[#707577] w-[80px]' />
                </div>
                <button className='w-full flex justify-center items-center border border-[#c1c4c6] cursor-pointer bg-white font-bold py-2 px-4 rounded-md mt-[15px]'>
                    <FcGoogle className='text-[25px]' />
                    <span className='text-black ml-[10px] border-[#c1c4c6]'>
                        Đăng nhập bằng Google
                    </span>
                </button>
                <p className="mt-4 text-center">
                    Đã có tài khoản? <Link to={`/login`} className="text-blue-500 hover:text-blue-400">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
