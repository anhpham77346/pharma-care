"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Medicine = {
  id: number;
  name: string;
  price: number;
  quantity: number; // Available quantity in stock
  description?: string;
  category?: { id: number; name: string };
  expirationDate?: string;
};

type InvoiceItem = {
  medicineId: number;
  quantity: number;
  unitPrice: number;
  name?: string; // For display purposes
  totalPrice?: number; // For display purposes
};

export default function CreateSaleInvoicePage() {
  const { isAuthenticated, loading: authLoading, getToken, user } = useAuth();
  const router = useRouter();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isFetchingMedicines, setIsFetchingMedicines] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch all medicines for the dropdown
  useEffect(() => {
    if (isAuthenticated) {
      const fetchMedicines = async () => {
        setIsFetchingMedicines(true);
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Không thể tải danh sách thuốc');
          }
          setMedicines(data.data || []);
          setError('');
        } catch (err: any) {
          setError(err.message || 'Lỗi khi tải danh sách thuốc.');
          setMedicines([]);
        } finally {
          setIsFetchingMedicines(false);
        }
      };
      fetchMedicines();
    }
  }, [isAuthenticated, getToken]);

  const handleAddItem = () => {
    if (!selectedMedicineId || !quantity) {
      setError('Vui lòng chọn thuốc và nhập số lượng.');
      return;
    }
    const medicine = medicines.find(m => m.id === parseInt(selectedMedicineId));
    if (!medicine) {
      setError('Thuốc không hợp lệ.');
      return;
    }
    const numQuantity = parseInt(quantity);
    if (numQuantity <= 0) {
      setError('Số lượng phải lớn hơn 0.');
      return;
    }
    if (numQuantity > medicine.quantity) {
        setError(`Số lượng tồn kho của ${medicine.name} không đủ (Còn lại: ${medicine.quantity}).`);
        return;
    }

    // Check if medicine already added
    const existingItemIndex = invoiceItems.findIndex(item => item.medicineId === medicine.id);
    if (existingItemIndex > -1) {
        const updatedItems = [...invoiceItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + numQuantity;
        if (newQuantity > medicine.quantity) {
            setError(`Tổng số lượng ${medicine.name} vượt quá tồn kho (Tồn kho: ${medicine.quantity}, Đã thêm: ${updatedItems[existingItemIndex].quantity}).`);
            return;
        }
        updatedItems[existingItemIndex].quantity = newQuantity;
        updatedItems[existingItemIndex].totalPrice = newQuantity * medicine.price;
        setInvoiceItems(updatedItems);
    } else {
        setInvoiceItems([
            ...invoiceItems,
            {
                medicineId: medicine.id,
                quantity: numQuantity,
                unitPrice: medicine.price, // Use fetched medicine price
                name: medicine.name,
                totalPrice: numQuantity * medicine.price,
            },
        ]);
    }
    setSelectedMedicineId('');
    setQuantity('1');
    setError('');
  };

  const handleRemoveItem = (medicineId: number) => {
    setInvoiceItems(invoiceItems.filter(item => item.medicineId !== medicineId));
  };

  const handleSubmitInvoice = async (e: FormEvent) => {
    e.preventDefault();
    if (invoiceItems.length === 0) {
      setError('Hóa đơn phải có ít nhất một sản phẩm.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const token = await getToken();
      const payload = {
        items: invoiceItems.map(item => ({ 
            medicineId: item.medicineId, 
            quantity: item.quantity, 
            unitPrice: item.unitPrice 
        })),
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sale-invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Tạo hóa đơn thất bại.');
      }
      setSuccessMessage(`Tạo hóa đơn #${data.data.invoice.id} thành công!`);
      setInvoiceItems([]); // Clear items after successful submission
      // router.push(`/sale-invoices/${data.data.invoice.id}`); // Optionally redirect
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo hóa đơn.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedMedicineDetails = selectedMedicineId ? medicines.find(m => m.id === parseInt(selectedMedicineId)) : null;
  const totalInvoiceAmount = invoiceItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  if (authLoading || isFetchingMedicines) {
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
        <h1 className="text-2xl font-bold text-[#0f172a]">Tạo hóa đơn bán hàng mới</h1>
        <Link href="/sale-invoices">
          <button className="text-sm text-[#0057ba] hover:text-[#00408a] transition-colors py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            Quay lại danh sách
          </button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmitInvoice} className="space-y-6">
        {/* Add items section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-[#0f172a] mb-4">Thêm sản phẩm vào hóa đơn</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="md:col-span-2">
              <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-1">
                Chọn thuốc <span className="text-red-500">*</span>
              </label>
              <select
                id="medicine"
                value={selectedMedicineId}
                onChange={(e) => setSelectedMedicineId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
              >
                <option value="">-- Chọn thuốc --</option>
                {medicines.map((med) => (
                  <option key={med.id} value={med.id} disabled={med.quantity === 0}>
                    {med.name} (Tồn: {med.quantity}, Giá: {med.price.toLocaleString('vi-VN')} VNĐ)
                  </option>
                ))}
              </select>
              {selectedMedicineDetails && (
                <p className="text-xs text-gray-500 mt-1">
                    Mô tả: {selectedMedicineDetails.description || 'Không có mô tả'}<br/>
                    {selectedMedicineDetails.expirationDate ? `HSD: ${new Date(selectedMedicineDetails.expirationDate).toLocaleDateString('vi-VN')}` : ''}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors h-10 mt-4 md:mt-7 self-start md:self-end cursor-pointer"
              disabled={!selectedMedicineId || !quantity || isLoading}
            >
              Thêm vào hóa đơn
            </button>
          </div>
        </div>

        {/* Invoice items table */}
        {invoiceItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-xl font-semibold text-[#0f172a] mb-4">Các sản phẩm trong hóa đơn</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thuốc</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoiceItems.map((item) => (
                        <tr key={item.medicineId}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(item.medicineId)}
                                className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                                disabled={isLoading}
                            >
                                Xóa
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700 uppercase">Tổng cộng hóa đơn:</td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                {totalInvoiceAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#0057ba] text-white px-6 py-3 rounded-lg hover:bg-[#00408a] transition-colors text-base font-medium cursor-pointer"
            disabled={invoiceItems.length === 0 || isLoading}
          >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                </div>
            ) : 'Xác nhận tạo hóa đơn'}
          </button>
        </div>
      </form>
    </div>
  );
} 