import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Coffee,
  FileText,
  Users,
  Search,
  Bell,
  LogOut,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CustomerDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userProfile, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userDisplayName = userProfile?.name || userName || "Khách hàng";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goTo = (path) => () => navigate(path);
  const isActive = (pathPrefix) => location.pathname.startsWith(pathPrefix);

  return (
    <>
      {/* PHẦN CSS TRỰC TIẾP TRONG JSX */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                .dashboard-container {
                    font-family: 'Inter', sans-serif;
                    background-color: #FDF8F3;
                    color: #3D2B1F;
                }

                .sidebar-shadow {
                    box-shadow: 4px 0 24px rgba(61, 43, 31, 0.02);
                }

                .custom-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: #EFE3D5;
                    border-radius: 10px;
                }

                .banner-overlay {
                    background: linear-gradient(90deg, rgba(44, 24, 16, 0.9) 0%, rgba(44, 24, 16, 0.3) 100%);
                }

                .btn-primary {
                    background-color: #3D2B1F;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-primary:hover {
                    background-color: #000000;
                    transform: translateY(-1px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .status-card {
                    transition: all 0.3s ease;
                    border: 1px solid #EFE3D5;
                }
                .status-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(61, 43, 31, 0.05);
                    background-color: #ffffff;
                }

                .order-row {
                    transition: background-color 0.2s;
                }
                .order-row:hover {
                    background-color: #F9F6F4;
                }

                .search-focus:focus {
                    background-color: #ffffff !important;
                    box-shadow: 0 0 0 2px #3D2B1F;
                }
            `,
        }}
      />

      <div className="dashboard-container flex min-h-screen">
        {/* SIDEBAR - Khớp image_f5a9f6.jpg */}
        <aside className="w-64 bg-white border-r border-[#EFE3D5] flex flex-col p-6 sticky top-0 h-screen sidebar-shadow">
          <div className="mb-10">
            <h1 className="text-xl font-extrabold tracking-widest uppercase text-[#3D2B1F]">
              RoastLogic
            </h1>
            <p className="text-[10px] font-bold text-[#A89485] tracking-tighter">
              ENTERPRISE TIER
            </p>
          </div>

          <nav className="flex-1 space-y-1 custom-scroll overflow-y-auto">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Tổng quan"
              active={isActive("/customer/dashboard")}
              onClick={goTo("/customer/dashboard")}
            />
            <NavItem
              icon={<Package size={18} />}
              label="Đơn hàng"
              active={isActive("/customer/orders")}
              onClick={goTo("/customer/orders/inbound")}
            />
            <NavItem
              icon={<Coffee size={18} />}
              label="Sản phẩm"
              active={isActive("/customer/products")}
              onClick={goTo("/customer/products")}
            />
            <NavItem
              icon={<FileText size={18} />}
              label="Sổ cái"
              active={isActive("/customer/reports")}
              onClick={goTo("/customer/reports")}
            />
            <NavItem
              icon={<Users size={18} />}
              label="Danh bạ"
              active={isActive("/customer/contacts")}
              onClick={goTo("/customer/contacts")}
            />
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-[#EFE3D5]">
            <button
              onClick={goTo("/customer/orders/inbound")}
              className="w-full btn-primary text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider mb-4"
            >
              <Plus size={16} /> Đơn hàng mới
            </button>
            <NavItem
              icon={<HelpCircle size={18} />}
              label="Hỗ trợ"
              onClick={goTo("/customer/reports")}
            />
            <NavItem
              icon={<Settings size={18} />}
              label="Cài đặt"
              active={isActive("/customer/settings")}
              onClick={goTo("/customer/settings")}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all mt-2"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10 overflow-y-auto">
          {/* TOP HEADER */}
          <header className="flex justify-between items-center mb-10">
            <div className="relative w-1/3">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89485]"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng, sản phẩm..."
                className="search-focus w-full bg-[#EFE3D5] border-none rounded-full py-2.5 pl-12 pr-4 text-xs outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-8">
              <div className="relative cursor-pointer">
                <Bell size={20} className="text-[#3D2B1F]" />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex items-center gap-3 bg-white p-1 pr-5 rounded-full shadow-sm border border-[#EFE3D5] cursor-pointer hover:bg-gray-50">
                <div className="w-9 h-9 bg-[#3D2B1F] rounded-full flex items-center justify-center text-[#FDF8F3] font-bold text-sm">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-extrabold uppercase tracking-tight">
                  {userDisplayName}
                </span>
              </div>
            </div>
          </header>
          <div className="min-h-[calc(100vh-180px)]">{children}</div>
        </main>
      </div>
    </>
  );
};

// Component con
const NavItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? "bg-[#FDF8F3] text-[#3D2B1F] font-bold shadow-sm" : "text-[#A89485] hover:bg-gray-50"}`}
  >
    {icon}
    <span className="text-[13px] font-medium tracking-tight">{label}</span>
  </button>
);

export const NotificationItem = ({ icon, color, text, desc, time }) => (
  <div className="flex gap-4 group cursor-pointer">
    <div
      className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
    >
      {icon}
    </div>
    <div className="border-b border-gray-50 pb-4 w-full">
      <h4 className="text-[11px] font-extrabold uppercase tracking-tight mb-1">
        {text}
      </h4>
      <p className="text-[10px] text-gray-500 mb-1 leading-relaxed line-clamp-1">
        {desc}
      </p>
      <span className="text-[9px] text-[#A89485] font-bold uppercase tracking-tighter">
        {time}
      </span>
    </div>
  </div>
);

export const StatusCard = ({ count, label, tag, tagColor }) => (
  <div className="status-card bg-[#FDF8F3]/50 p-10 rounded-[2rem] relative">
    <span
      className={`absolute top-6 right-6 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${tagColor}`}
    >
      {tag}
    </span>
    <h4 className="text-5xl font-bold mb-4 tracking-tighter">{count}</h4>
    <p className="text-[11px] text-[#A89485] font-medium leading-relaxed max-w-[140px]">
      {label}
    </p>
  </div>
);

export const OrderRow = ({ id, product, date, price, status }) => (
  <tr className="order-row border-b border-gray-50 last:border-0 group">
    <td className="py-6 font-bold text-xs tracking-widest">{id}</td>
    <td className="py-6 text-xs font-medium text-gray-600">{product}</td>
    <td className="py-6 text-xs text-[#A89485]">{date}</td>
    <td className="py-6 font-bold text-sm text-[#3D2B1F]">{price}</td>
    <td className="py-6 text-right">
      <span
        className={`text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest ${
          status === "Hoàn thành"
            ? "bg-[#EFE3D5] text-[#3D2B1F]"
            : status === "Đang giao"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
        }`}
      >
        {status}
      </span>
    </td>
  </tr>
);

export default CustomerDashboard;
