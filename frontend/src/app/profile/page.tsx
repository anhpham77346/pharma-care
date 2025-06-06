"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Helper function to format date with leading zeros
const formatDateWithLeadingZeros = (dateString: string) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function ProfilePage() {  
  const { user, isAuthenticated, loading, getToken, refreshUserData } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<{file: File, preview: string} | null>(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    birthDate: "",
    address: "",
    phone: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Kiểm tra trạng thái đăng nhập và chuyển hướng nếu cần
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  // Khởi tạo dữ liệu khi user được tải
  useEffect(() => {
    if (user) {
      // Format the birthDate to YYYY-MM-DD for the date input
      let formattedBirthDate = user.birthDate || "";
      if (user.birthDate) {
        const date = new Date(user.birthDate);
        formattedBirthDate = date.toISOString().split('T')[0];
      }
      
      setProfileData({
        fullName: user.fullName || "",
        birthDate: formattedBirthDate,
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || ""
      });
    }
  }, [user]);

  // Cập nhật thông tin cá nhân
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi cập nhật thông tin");
      }

      // Refresh user data in the context to update the UI without page reload
      await refreshUserData();
      
      setSuccess("Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi đổi mật khẩu");
      }

      setSuccess("Đổi mật khẩu thành công");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle avatar update
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Create a preview and store the file
    const preview = URL.createObjectURL(file);
    setSelectedAvatar({ file, preview });
    setShowAvatarConfirm(true);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelAvatarUpload = () => {
    if (selectedAvatar) {
      URL.revokeObjectURL(selectedAvatar.preview);
      setSelectedAvatar(null);
    }
    setShowAvatarConfirm(false);
  };

  const confirmAvatarUpload = async () => {
    if (!selectedAvatar) return;
    
    try {
      setIsUploadingAvatar(true);
      setShowAvatarConfirm(false);
      setError("");
      setSuccess("");

      // Convert image to base64
      const base64Image = await fileToBase64(selectedAvatar.file);
      
      // Upload to server
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarBase64: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi cập nhật avatar");
      }

      // Refresh user data in the context to update the UI
      await refreshUserData();
      
      setSuccess("Cập nhật avatar thành công");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật avatar");
    } finally {
      setIsUploadingAvatar(false);
      // Clean up the preview URL
      if (selectedAvatar) {
        URL.revokeObjectURL(selectedAvatar.preview);
        setSelectedAvatar(null);
      }
    }
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    if (user) {
      // Format the birthDate to YYYY-MM-DD for the date input (same as in useEffect)
      let formattedBirthDate = user.birthDate || "";
      if (user.birthDate) {
        const date = new Date(user.birthDate);
        formattedBirthDate = date.toISOString().split('T')[0];
      }
      
      setProfileData({
        fullName: user.fullName || "",
        birthDate: formattedBirthDate,
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || ""
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-xl text-[#0f172a]">
          <svg className="animate-spin h-8 w-8 text-[#0057ba] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Sẽ được redirect bởi useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#0f172a]">Hồ sơ cá nhân</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>{success}</p>
          </div>
        )}

        {/* Avatar Confirmation Modal */}
        {showAvatarConfirm && selectedAvatar && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-[#0f172a] mb-4">Xác nhận đổi ảnh đại diện</h3>
              <div className="flex justify-center mb-4">
                <img
                  src={selectedAvatar.preview}
                  alt="Avatar preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-[#0057ba]"
                />
              </div>
              <p className="text-gray-600 mb-4 text-center">
                Bạn có chắc chắn muốn cập nhật ảnh đại diện này không?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelAvatarUpload}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmAvatarUpload}
                  className="px-4 py-2 bg-[#0057ba] text-white rounded-md hover:bg-[#004080] cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#0f172a]">Thông tin cá nhân</h2>
            </div>

            {/* Avatar display section - always visible */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {user?.avatarUrl ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatarUrl}`}
                    alt="Avatar của người dùng"
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#0057ba]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl border-2 border-[#0057ba]">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="mt-2 text-sm text-[#0057ba] hover:text-[#004080] cursor-pointer" onClick={handleAvatarClick}>
                Đổi ảnh đại diện
              </p>
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#0057ba] hover:text-[#004080] flex items-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Chỉnh sửa thông tin cá nhân
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tên đăng nhập</h3>
                    <p className="mt-1 text-[#0f172a]">{user?.username || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Họ tên</h3>
                    <p className="mt-1 text-[#0f172a]">{user?.fullName || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ngày sinh</h3>
                    <p className="mt-1 text-[#0f172a]">
                      {user?.birthDate 
                        ? formatDateWithLeadingZeros(user.birthDate)
                        : "—"}
                    </p>
                  </div>
                  <div></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Địa chỉ email</h3>
                    <p className="mt-1 text-[#0f172a]">{user?.email || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                    <p className="mt-1 text-[#0f172a]">{user?.phone || "—"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Địa chỉ</h3>
                  <p className="mt-1 text-[#0f172a]">{user?.address || "—"}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Địa chỉ email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="phone"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0057ba] text-white rounded-md hover:bg-[#004080] cursor-pointer flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#0f172a]">Đổi mật khẩu</h2>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-[#0057ba] hover:text-[#004080] flex items-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-2l2.586-2.586a1 1 0 00.278-.306 6 6 0 1110.136-3.086zM6.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đổi mật khẩu
                </button>
              ) : null}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0057ba] focus:border-[#0057ba]"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0057ba] text-white rounded-md hover:bg-[#004080] cursor-pointer flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Xác nhận
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">
                Bạn có thể thay đổi mật khẩu của mình bằng cách nhấn vào nút "Đổi mật khẩu".
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 