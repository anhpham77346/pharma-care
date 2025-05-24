"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type MedicineCategory = {
  id: number;
  name: string;
  description: string;
};

export default function MedicineCategoriesPage() {
  const { isAuthenticated, loading, getToken } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<MedicineCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<MedicineCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Kiểm tra trạng thái đăng nhập và chuyển hướng nếu cần
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  // Lấy danh sách loại thuốc
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicine-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi tải danh sách loại thuốc");
      }

      setCategories(data.data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải danh sách loại thuốc");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
  };

  // Thêm loại thuốc mới
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicine-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi thêm loại thuốc");
      }

      setShowAddModal(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi thêm loại thuốc");
    }
  };

  // Cập nhật loại thuốc
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;
    
    try {
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicine-categories/${currentCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi cập nhật loại thuốc");
      }

      setShowEditModal(false);
      resetForm();
      setCurrentCategory(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật loại thuốc");
    }
  };

  // Xóa loại thuốc
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    try {
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicine-categories/${currentCategory.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi xóa loại thuốc");
      }

      setShowDeleteModal(false);
      setCurrentCategory(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi xóa loại thuốc");
    }
  };

  // Mở modal chỉnh sửa
  const openEditModal = (category: MedicineCategory) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowEditModal(true);
  };

  // Mở modal xóa
  const openDeleteModal = (category: MedicineCategory) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Sẽ được redirect bởi useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Quản lý danh mục thuốc</h1>
          <p className="text-[#334155]">Quản lý các loại thuốc trong hệ thống</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-[#0057ba] text-white px-4 py-2 rounded-lg hover:bg-[#00408a] transition-colors flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Thêm loại thuốc
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
          <svg className="animate-spin h-6 w-6 text-[#0057ba] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[#334155]">Chưa có loại thuốc nào. Bắt đầu bằng cách thêm loại thuốc mới.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên loại thuốc
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {category.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-[#0057ba] hover:text-[#00408a] mr-3 cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal thêm loại thuốc */}
      {showAddModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30 backdrop-blur"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-[#0f172a]">Thêm loại thuốc mới</h3>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Tên loại thuốc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md cursor-pointer"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0057ba] hover:bg-[#00408a] rounded-md cursor-pointer"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa loại thuốc */}
      {showEditModal && currentCategory && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30 backdrop-blur"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-[#0f172a]">Sửa loại thuốc</h3>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-name">
                  Tên loại thuốc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-description">
                  Mô tả
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md cursor-pointer"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0057ba] hover:bg-[#00408a] rounded-md cursor-pointer"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && currentCategory && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30 backdrop-blur"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2 text-[#0f172a]">Xác nhận xóa</h3>
            <p className="mb-6 text-[#334155]">
              Bạn có chắc chắn muốn xóa loại thuốc <span className="font-semibold">{currentCategory.name}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
                onClick={handleDeleteCategory}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 