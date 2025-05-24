"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Medicine {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

const MedicineDetailPage = () => {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { getToken, isAuthenticated, loading: authLoading } = useAuth();
  
  const medicineId = params.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && medicineId) {
      fetchMedicineDetails();
    }
  }, [isAuthenticated, authLoading, medicineId, router]);

  const fetchMedicineDetails = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/${medicineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Không tìm thấy thông tin thuốc");
        }
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch medicine details" }));
        throw new Error(errorData.message || "Failed to fetch medicine details");
      }

      const data = await response.json();
      setMedicine(data.data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error loading medicine details. Please try again later.");
      }
      console.error(err);
      setMedicine(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = async () => {
    if (!medicine) return;
    setShowDeleteModal(true);
  };

  const executeDeleteMedicine = async () => {
    if (!medicine) return;
    setShowDeleteModal(false);

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/${medicine.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete medicine");
        return;
      }

      toast.success(data?.message ||"Xóa thuốc thành công");
      router.push("/medicines");
    } catch (err) {
      console.error("Error deleting medicine:", err);
      toast.error("An error occurred while deleting the medicine");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Link 
          href="/medicines"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Quay lại danh sách thuốc
        </Link>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Không tìm thấy thông tin thuốc</p>
        </div>
        <Link 
          href="/medicines"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Quay lại danh sách thuốc
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Chi tiết thuốc</h1>
        <div className="flex space-x-3">
          <Link
            href="/medicines"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Quay lại
          </Link>
          <Link
            href={`/medicines/edit/${medicine.id}`}
            className="bg-[#0057ba] hover:bg-[#00408a] text-white px-4 py-2 rounded-lg transition-colors flex items-center cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Chỉnh sửa
          </Link>
          <button
            onClick={handleDeleteMedicine}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Xóa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-[#0f172a]">{medicine.name}</h2>
            <div className="mt-2 flex items-center space-x-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {medicine.category.name}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                ${medicine.quantity <= 0 ? 'bg-red-100 text-red-800' : 
                  medicine.quantity < 10 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                {medicine.quantity <= 0 ? 'Hết hàng' : 
                 medicine.quantity < 10 ? 'Sắp hết' : 
                 'Còn hàng'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Giá bán:</div>
                  <div className="font-medium text-blue-600">{formatCurrency(medicine.price)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Số lượng tồn kho:</div>
                  <div className="font-medium">{medicine.quantity}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Ngày hết hạn:</div>
                  <div className="font-medium">{medicine.expirationDate ? formatDate(medicine.expirationDate) : "N/A"}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Loại thuốc:</div>
                  <div className="font-medium">{medicine.category.name}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin thêm</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Ngày tạo:</div>
                  <div className="font-medium">{formatDate(medicine.createdAt)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Ngày cập nhật:</div>
                  <div className="font-medium">{formatDate(medicine.updatedAt)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">ID:</div>
                  <div className="font-medium">{medicine.id}</div>
                </div>
              </div>
            </div>
          </div>

          {medicine.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Mô tả</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{medicine.description}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="flex">
              <Link
                href="/medicines/inventory"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Xem tồn kho
              </Link>
              <Link
                href={`/medicines/edit/${medicine.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Chỉnh sửa thuốc
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && medicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0f172a]">Xác nhận xóa thuốc</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[#334155] mb-6">
              Bạn có chắc chắn muốn xóa thuốc <span className="font-semibold text-gray-800">{medicine.name}</span>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md cursor-pointer transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition-colors"
                onClick={executeDeleteMedicine}
              >
                Xóa thuốc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineDetailPage; 