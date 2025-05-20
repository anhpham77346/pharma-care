"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex gap-4 items-center">
      <Link href="/" className="hover:text-primary">
        Trang chủ
      </Link>
      
      {isAuthenticated ? (
        <>
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <div className="relative group">
            <button className="hover:text-primary flex items-center gap-1">
              {user?.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 hidden group-hover:block z-10">
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Hồ sơ
              </Link>
              <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                Cài đặt
              </Link>
              <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="hover:text-primary">
            Đăng nhập
          </Link>
          <Link href="/auth/register" className="hover:text-primary">
            Đăng ký
          </Link>
        </>
      )}
    </nav>
  );
}; 