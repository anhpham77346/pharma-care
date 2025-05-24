"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Medicine = {
  id: number;
  name: string;
  price?: number;
  quantity?: number;
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
  totalAmount?: number; // Calculated client-side
};

export default function SaleInvoiceDetailPage() {
  const { isAuthenticated, loading: authLoading, getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id;

  const [invoice, setInvoice] = useState<SaleInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && invoiceId) {
      const fetchInvoiceDetail = async () => {
        setIsLoading(true);
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sale-invoices/${invoiceId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Không thể tải chi tiết hóa đơn');
          }
          const detailedInvoice: SaleInvoice = {
            ...data.data,
            totalAmount: data.data.details.reduce((sum: number, detail: SaleInvoiceDetail) => sum + detail.quantity * detail.unitPrice, 0),
          };
          setInvoice(detailedInvoice);
          setError('');
        } catch (err: any) {
          setError(err.message || 'Có lỗi xảy ra.');
          setInvoice(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoiceDetail();
    }
  }, [isAuthenticated, invoiceId, getToken]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirected by useEffect
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
        <Link href="/sale-invoices">
          <button className="text-[#0057ba] hover:text-[#00408a] cursor-pointer">Quay lại danh sách hóa đơn</button>
        </Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-[#334155]">Không tìm thấy thông tin hóa đơn.</p>
        <Link href="/sale-invoices">
          <button className="mt-4 text-[#0057ba] hover:text-[#00408a] cursor-pointer">Quay lại danh sách hóa đơn</button>
        </Link>
      </div>
    );
  }
  
  const totalAmount = invoice.details.reduce((sum, detail) => sum + detail.quantity * detail.unitPrice, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Chi tiết hóa đơn #{invoice.id}</h1>
            <p className="text-sm text-[#334155]">
              Ngày tạo: {new Date(invoice.invoiceDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
            <p className="text-sm text-[#334155]">
              Nhân viên: {invoice.employee?.fullName || "N/A"}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:text-right">
            <Link href="/sale-invoices">
              <button className="text-sm text-[#0057ba] hover:text-[#00408a] transition-colors py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                Quay lại danh sách
              </button>
            </Link>
          </div> 
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#0f172a] mb-3">Chi tiết sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thuốc
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.details.map((detail, index) => (
                  <tr key={detail.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {detail.medicine?.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {detail.quantity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {detail.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {(detail.quantity * detail.unitPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
          <div className="text-right">
            <p className="text-lg font-semibold text-[#0f172a]">Tổng cộng</p>
            <p className="text-2xl font-bold text-[#0057ba]">
              {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
