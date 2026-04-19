import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { userName, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    avatar: '👤'
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    } else {
      // Fallback data
      setProfileData({
        name: userName || 'Người dùng',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        phone: localStorage.getItem('userPhone') || '0123456789',
        role: localStorage.getItem('userRole') || 'Nhân viên',
        department: localStorage.getItem('userDepartment') || 'Kho hàng',
        avatar: '👤'
      });
    }
  }, [isOpen, userName, userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userPhone', profileData.phone);
    localStorage.setItem('userRole', profileData.role);
    localStorage.setItem('userDepartment', profileData.department);
    setIsEditing(false);
    alert('✅ Cập nhật thông tin thành công!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUser /> Thông Tin Cá Nhân
          </h2>
          <button
            onClick={onClose}
            className="text-xl hover:bg-orange-600 p-2 rounded"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{profileData.avatar}</div>
            <p className="text-gray-600 text-sm">Hệ thống quản lý kho hàng</p>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Tên</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full mt-1 p-3 border rounded-lg ${
                  isEditing ? 'bg-white border-orange-400' : 'bg-gray-100 border-gray-300'
                } focus:outline-none`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full mt-1 p-3 border rounded-lg ${
                  isEditing ? 'bg-white border-orange-400' : 'bg-gray-100 border-gray-300'
                } focus:outline-none`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaPhone /> Điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full mt-1 p-3 border rounded-lg ${
                  isEditing ? 'bg-white border-orange-400' : 'bg-gray-100 border-gray-300'
                } focus:outline-none`}
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBuilding /> Vai trò
              </label>
              <input
                type="text"
                name="role"
                value={profileData.role}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full mt-1 p-3 border rounded-lg ${
                  isEditing ? 'bg-white border-orange-400' : 'bg-gray-100 border-gray-300'
                } focus:outline-none`}
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBuilding /> Phòng ban
              </label>
              <input
                type="text"
                name="department"
                value={profileData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full mt-1 p-3 border rounded-lg ${
                  isEditing ? 'bg-white border-orange-400' : 'bg-gray-100 border-gray-300'
                } focus:outline-none`}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Trạng thái: <strong>Hoạt động</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Lần đăng nhập cuối: Ngôm nay
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                <FaEdit /> Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaSave /> Lưu
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
