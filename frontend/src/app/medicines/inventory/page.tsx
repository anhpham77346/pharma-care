"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Category {
  name: string;
}

interface Medicine {
  id: number;
  name: string;
  quantity: number;
  price: number;
  expirationDate?: string;
  category: Category;
}

const InventoryPage = () => {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  const router = useRouter();
  const { getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    fetchInventory();
  }, [isAuthenticated, router]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/inventory/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();
      const inventoryData = data.data;
      setInventory(inventoryData);
      
      // Extract unique categories
      const categories = [...new Set(inventoryData.map((item: Medicine) => item.category.name))] as string[];
      setUniqueCategories(categories);
      
      setError(null);
    } catch (err) {
      setError("Error loading inventory. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
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

  // Filter medicine based on search term and category filter
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "" || item.category.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort inventory items: low stock first, then alphabetically
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    // Low stock items (less than 10) first
    if (a.quantity < 10 && b.quantity >= 10) return -1;
    if (a.quantity >= 10 && b.quantity < 10) return 1;
    
    // Then sort alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kho thuốc</h1>
          <p className="text-gray-600">Quản lý tồn kho và theo dõi hạn sử dụng</p>
        </div>
        <Link
          href="/medicines"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Quay lại danh sách thuốc
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm thuốc
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                placeholder="Nhập tên thuốc cần tìm..."
              />
            </div>
          </div>
          <div className="md:w-1/4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Lọc theo loại thuốc
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tất cả loại thuốc</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thuốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại thuốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày hết hạn
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedInventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy thuốc nào phù hợp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  sortedInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          item.quantity <= 0 ? 'text-red-600' : 
                          item.quantity < 10 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.expirationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.quantity <= 0 ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Hết hàng
                          </span>
                        ) : item.quantity < 10 ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Còn hàng
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg mb-2">Chú thích</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-4 h-4 inline-block rounded-full bg-green-100 mr-2"></span>
            <span className="text-green-800 font-medium">Còn hàng:</span> 
            <span className="ml-2">Số lượng từ 10 trở lên</span>
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 inline-block rounded-full bg-yellow-100 mr-2"></span>
            <span className="text-yellow-800 font-medium">Sắp hết:</span> 
            <span className="ml-2">Số lượng dưới 10, cần nhập thêm</span>
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 inline-block rounded-full bg-red-100 mr-2"></span>
            <span className="text-red-800 font-medium">Hết hàng:</span> 
            <span className="ml-2">Số lượng bằng 0, cần nhập hàng ngay</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InventoryPage; 