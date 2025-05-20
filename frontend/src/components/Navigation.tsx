"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex gap-6 items-center">
      <Link href="/" className="hover:text-pharmacy-200 transition-colors">
        Trang chủ
      </Link>
      
      {isAuthenticated ? (
        <>
          <Link href="/dashboard" className="hover:text-pharmacy-200 transition-colors">
            Dashboard
          </Link>
          <div className="relative group">
            <button className="hover:text-pharmacy-200 transition-colors flex items-center gap-1">
              {user?.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-secondary hidden group-hover:block z-10 border border-pharmacy-200">
              <Link href="/profile" className="block px-4 py-2 hover:bg-pharmacy-100 transition-colors">
                Hồ sơ
              </Link>
              <Link href="/settings" className="block px-4 py-2 hover:bg-pharmacy-100 transition-colors">
                Cài đặt
              </Link>
              <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-pharmacy-100 text-danger transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="hover:text-pharmacy-200 transition-colors">
            Đăng nhập
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-pharmacy-100 transition-colors"
          >
            Đăng ký
          </Link>
        </>
      )}
    </nav>
  );
}; 