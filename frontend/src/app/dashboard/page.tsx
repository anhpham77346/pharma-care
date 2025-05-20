"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Chuyển hướng nếu người dùng chưa đăng nhập
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-xl text-[#0f172a]">
          <svg className="animate-spin h-8 w-8 text-[#0057ba] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Sẽ chuyển hướng bởi useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#0f172a]">Chào mừng, {user?.name}</h1>
        <p className="text-[#334155]">Quản lý nhà thuốc của bạn với Pharma Care</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card quản lý thuốc */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#0057ba] hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-[#0f172a]">Quản lý thuốc</h2>
              <p className="text-[#334155] mb-4">Quản lý kho thuốc, danh mục và thông tin chi tiết</p>
              <Link href="/medicines" className="text-[#0057ba] hover:text-[#00408a] flex items-center transition-colors">
                Xem chi tiết
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0057ba]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card quản lý nhà cung cấp */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#e11d48] hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-[#0f172a]">Nhà cung cấp</h2>
              <p className="text-[#334155] mb-4">Quản lý thông tin nhà cung cấp và đơn hàng</p>
              <Link href="/suppliers" className="text-[#e11d48] hover:text-[#be123c] flex items-center transition-colors">
                Xem chi tiết
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#e11d48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card quản lý nhân viên */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#4b5563] hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-[#0f172a]">Nhân viên</h2>
              <p className="text-[#334155] mb-4">Quản lý nhân viên và phân quyền</p>
              <Link href="/employees" className="text-[#4b5563] hover:text-[#374151] flex items-center transition-colors">
                Xem chi tiết
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 