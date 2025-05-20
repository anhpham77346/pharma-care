"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Use login function from AuthContext to handle token and redirection
      toast.success("Đăng nhập thành công!");
      
      const token = data.data.token;
      
      if (!token) {
        console.error("Token not found in response:", data);
        throw new Error("Không tìm thấy token xác thực trong phản hồi");
      }
      
      login(token);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#0f172a]">Đăng nhập</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-[#334155] font-medium mb-2">
              Tên người dùng
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập tên người dùng"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-[#334155] font-medium mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập mật khẩu"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0057ba] text-white py-2 rounded-lg font-medium hover:bg-[#00408a] disabled:opacity-70 transition-colors cursor-pointer"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-[#334155]">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-[#0057ba] hover:text-[#00408a] font-medium hover:underline transition-colors">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 