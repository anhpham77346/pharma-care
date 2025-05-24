"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Medicine = {
  id: number;
  name: string;
  price?: number; // Optional as it's in details
  quantity?: number; // Optional as it's in details
};

type Employee = {
  id: number;
  fullName: string;
};

type SaleInvoiceDetail = {
  id: number;
  quantity: number;
  unitPrice: number;
  medicineId: number;
  saleInvoiceId: number;
  medicine: Medicine;
};

type SaleInvoice = {
  id: number;
  invoiceDate: string;
  employeeId: number;
  employee: Employee;
  details: SaleInvoiceDetail[];
  totalAmount?: number; // Calculated client-side or could be from API
};

export default function SaleInvoicesPage() {
  const { isAuthenticated, loading, getToken } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<SaleInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchInvoices = async (startDate: string, endDate: string) => {
    if (!isAuthenticated) return;
    // Ensure startDate and endDate are always provided by the caller (e.g. useEffect or handleSearch)
    if (!startDate || !endDate) {
        setError("Ngày bắt đầu và ngày kết thúc là bắt buộc để tìm kiếm.");
        setIsLoading(false);
        setInvoices([]);
        return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/sale-invoices/search`;
      const params = new URLSearchParams();
      params.append("startDate", startDate);
      params.append("endDate", endDate);
      url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi tải danh sách hóa đơn");
      }

      const invoicesWithTotal = data.data.map((invoice: SaleInvoice) => ({
        ...invoice,
        totalAmount: invoice.details.reduce((sum, detail) => sum + detail.quantity * detail.unitPrice, 0),
      }));
      setInvoices(invoicesWithTotal);
      setError("");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải danh sách hóa đơn");
      setInvoices([]); // Clear invoices on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const today = new Date();
      const endDateDefault = formatDate(today);
      
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      const startDateDefault = formatDate(threeMonthsAgo);

      setSearchStartDate(startDateDefault);
      setSearchEndDate(endDateDefault);
      fetchInvoices(startDateDefault, endDateDefault);
    }
  }, [isAuthenticated]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchStartDate || !searchEndDate) {
      setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    setError("");
    fetchInvoices(searchStartDate, searchEndDate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Quản lý hóa đơn bán hàng</h1>
          <p className="text-[#334155]">Tìm kiếm và xem lịch sử hóa đơn</p>
        </div>
        <Link href="/sale-invoices/create">
          <button className="bg-[#0057ba] text-white px-4 py-2 rounded-lg hover:bg-[#00408a] transition-colors flex items-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tạo hóa đơn mới
          </button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="searchStartDate" className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              id="searchStartDate"
              value={searchStartDate}
              onChange={(e) => setSearchStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
              required
            />
          </div>
          <div>
            <label htmlFor="searchEndDate" className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              id="searchEndDate"
              value={searchEndDate}
              onChange={(e) => setSearchEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#0057ba] text-white px-4 py-2 rounded-lg hover:bg-[#00408a] transition-colors h-10 md:mt-0 mt-4 cursor-pointer"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

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
          {invoices.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[#334155]">Không tìm thấy hóa đơn nào cho khoảng thời gian đã chọn.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Hóa đơn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.invoiceDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.employee?.fullName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {invoice.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/sale-invoices/${invoice.id}`}>
                        <button className="text-[#0057ba] hover:text-[#00408a] cursor-pointer">
                          Xem chi tiết
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
} 