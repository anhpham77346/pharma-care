"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="flex gap-6 items-center text-white">
      <Link href="/" className="hover:text-gray-200 transition-colors">
        Trang chủ
      </Link>
      
      {isAuthenticated ? (
        <>
          <Link href="/dashboard" className="hover:text-gray-200 transition-colors">
            Dashboard
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button 
              className="cursor-pointer hover:text-gray-200 transition-colors flex items-center gap-2"
              onClick={toggleDropdown}
            >
              <div className="flex-shrink-0">
                {user?.avatarUrl ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatarUrl}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-white"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-sm font-medium">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="hidden sm:inline">{user?.fullName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-[#0f172a] z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-sm truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Hồ sơ cá nhân
                </Link>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="hover:text-gray-200 transition-colors">
            Đăng nhập
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-white text-[#0057ba] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Đăng ký
          </Link>
        </>
      )}
    </nav>
  );
}; 