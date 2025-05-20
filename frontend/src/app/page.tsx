import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between py-12 mb-16">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Quản lý nhà thuốc hiệu quả với Pharma Care
          </h1>
          <p className="text-lg mb-6 text-secondary/80">
            Hệ thống quản lý toàn diện giúp bạn quản lý thuốc, nhà cung cấp, và nhân viên một cách dễ dàng và hiệu quả.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/auth/register" 
              className="bg-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Đăng ký ngay
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-white border border-pharmacy-300 text-secondary px-6 py-3 rounded-lg font-medium hover:bg-pharmacy-100 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-72 md:h-96 bg-pharmacy-100 rounded-lg overflow-hidden border-2 border-pharmacy-200">
            {/* Placeholder for pharmacy image - replace with actual image */}
            <div className="absolute inset-0 flex items-center justify-center text-pharmacy-700">
              <span className="text-xl flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
                <span className="mt-2">Hình ảnh nhà thuốc</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-secondary">Tính năng chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-pharmacy-200 hover:border-primary transition-colors">
            <div className="bg-pharmacy-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary">Quản lý kho thuốc</h3>
            <p className="text-secondary/80">Theo dõi tồn kho, hạn sử dụng và thông tin chi tiết về các loại thuốc.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-pharmacy-200 hover:border-primary transition-colors">
            <div className="bg-pharmacy-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary">Quản lý bán hàng</h3>
            <p className="text-secondary/80">Xử lý đơn hàng, thanh toán và theo dõi doanh số bán hàng.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-pharmacy-200 hover:border-primary transition-colors">
            <div className="bg-pharmacy-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary">Quản lý nhân viên</h3>
            <p className="text-secondary/80">Quản lý thông tin, phân quyền và theo dõi hiệu suất nhân viên.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Bắt đầu sử dụng Pharma Care ngay hôm nay</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-pharmacy-100">
          Tối ưu hóa quy trình làm việc của nhà thuốc và nâng cao hiệu quả kinh doanh với hệ thống quản lý toàn diện của chúng tôi.
        </p>
        <Link 
          href="/auth/register" 
          className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-pharmacy-100 transition-colors"
        >
          Đăng ký miễn phí
        </Link>
      </section>
    </div>
  );
}
