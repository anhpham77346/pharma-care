"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
              className="hover:text-gray-200 transition-colors flex items-center gap-1"
              onClick={toggleDropdown}
            >
              {user?.fullName}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-[#0f172a] z-10 border border-gray-200">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Hồ sơ
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Cài đặt
                </Link>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
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