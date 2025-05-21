"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    birthDate: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(", "));
        }
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push("/auth/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#0f172a]">Đăng ký tài khoản</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mb-4">
          <span className="text-red-500">*</span> Trường bắt buộc
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-[#334155] font-medium mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập họ và tên"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block text-[#334155] font-medium mb-2">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#334155] font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập địa chỉ email"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-[#334155] font-medium mb-2">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="phone" className="block text-[#334155] font-medium mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="address" className="block text-[#334155] font-medium mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập địa chỉ"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#334155] font-medium mb-2">
              Mật khẩu <span className="text-red-500">*</span>
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
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-[#334155] font-medium mb-2">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0057ba]"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0057ba] text-white py-2 rounded-lg font-medium hover:bg-[#00408a] disabled:opacity-70 transition-colors cursor-pointer"
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-[#334155]">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-[#0057ba] hover:text-[#00408a] font-medium hover:underline transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 