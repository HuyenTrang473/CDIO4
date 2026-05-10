import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
    LayoutDashboard, Truck, Warehouse, History, Settings, 
    LogOut, Search, Bell, Plus, BarChart3, Box, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SupplierDashboard = () => {
    const navigate = useNavigate();
    const { userName, userProfile, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const userDisplayName = userProfile?.name || userName || 'Nhà cung cấp';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .supplier-container { font-family: 'Inter', sans-serif; background-color: #F9F6F2; color: #3D2B1F; }
                .sidebar-supplier { box-shadow: 4px 0 24px rgba(61, 43, 31, 0.03); }
                .btn-supplier { background-color: #3D2B1F; transition: all 0.3s ease; }
                .btn-supplier:hover { background-color: #1A110B; transform: translateY(-1px); }
                .card-stats { border: 1px solid #EAE1D6; transition: transform 0.3s ease; }
                .card-stats:hover { transform: translateY(-5px); background-color: #fff; }
            `}} />

            <div className="supplier-container flex min-h-screen">
                {/* SIDEBAR */}
                <aside className="w-64 bg-white border-r border-[#EAE1D6] flex flex-col p-6 sticky top-0 h-screen sidebar-supplier">
                    <div className="mb-10">
                        <h1 className="text-xl font-extrabold tracking-widest uppercase text-[#3D2B1F]">RoastLogic</h1>
                        <p className="text-[10px] font-bold text-[#A89485] tracking-tighter">SUPPLIER PORTAL</p>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <SupplierNavItem icon={<LayoutDashboard size={18}/>} label="Bảng điều khiển" active />
                        <SupplierNavItem icon={<Truck size={18}/>} label="Lệnh giao hàng" />
                        <SupplierNavItem icon={<Warehouse size={18}/>} label="Quản lý kho" />
                        <SupplierNavItem icon={<BarChart3 size={18}/>} label="Báo cáo doanh thu" />
                    </nav>

                    <div className="mt-auto pt-6 border-t border-[#EAE1D6]">
                        <button className="w-full btn-supplier text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider mb-4">
                            <Plus size={16} /> Tạo lô hàng mới
                        </button>
                        <SupplierNavItem icon={<Settings size={18}/>} label="Cấu hình" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all mt-2">
                            <LogOut size={18} /> Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-10 overflow-y-auto">
                    <header className="flex justify-between items-center mb-10">
                        <div className="relative w-1/3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89485]" size={18} />
                            <input type="text" placeholder="Tìm mã vận đơn, mã kho..." className="w-full bg-white border border-[#EAE1D6] rounded-full py-2.5 pl-12 pr-4 text-xs outline-none focus:ring-1 focus:ring-[#3D2B1F]" />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs font-extrabold uppercase tracking-tight">{userDisplayName}</p>
                                <p className="text-[10px] text-[#A89485] font-bold">Mã đối tác: #SUP-2024</p>
                            </div>
                            <div className="w-10 h-10 bg-[#3D2B1F] rounded-full flex items-center justify-center text-white font-bold">{userDisplayName.charAt(0)}</div>
                        </div>
                    </header>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-8 mb-12">
                        <SupplierStatsCard icon={<Box size={20}/>} label="Tổng tồn kho" value="4.250 kg" sub="Đã cập nhật 5p trước" />
                        <SupplierStatsCard icon={<Truck size={20}/>} label="Đang vận chuyển" value="12" sub="8 đơn nội địa, 4 đơn tỉnh" />
                        <SupplierStatsCard icon={<CheckCircle2 size={20}/>} label="Hoàn tất tháng" value="186" sub="+15% so với tháng trước" />
                    </div>

                    {/* TABLE LỆNH GIAO HÀNG */}
                    <section className="bg-white rounded-[2rem] p-10 shadow-sm border border-[#EAE1D6]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest">Lệnh giao hàng mới nhất</h3>
                            <button className="text-[10px] font-bold text-[#A89485] uppercase tracking-wider hover:text-[#3D2B1F]">Xem tất cả</button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black text-[#A89485] uppercase tracking-widest border-b border-gray-50">
                                    <th className="pb-4 text-left">Mã vận đơn</th>
                                    <th className="pb-4 text-left">Loại hàng</th>
                                    <th className="pb-4 text-left">Số lượng</th>
                                    <th className="pb-4 text-left">Ngày lấy</th>
                                    <th className="pb-4 text-right">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                <SupplierOrderRow id="#DO-5512" type="Arabica Premium" qty="200kg" date="15/05/2024" status="Chờ lấy hàng" />
                                <SupplierOrderRow id="#DO-5510" type="Robusta Honey" qty="500kg" date="14/05/2024" status="Đã lấy hàng" />
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>
    );
};

const SupplierNavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#3D2B1F] text-white font-bold' : 'text-[#A89485] hover:bg-gray-50'}`}>
        {icon}
        <span className="text-[13px] font-medium">{label}</span>
    </div>
);

const SupplierStatsCard = ({ icon, label, value, sub }) => (
    <div className="card-stats bg-white/50 p-8 rounded-[2rem]">
        <div className="text-[#3D2B1F] mb-4">{icon}</div>
        <p className="text-[10px] font-black text-[#A89485] uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-3xl font-bold mb-2">{value}</h4>
        <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
    </div>
);

const SupplierOrderRow = ({ id, type, qty, date, status }) => (
    <tr className="border-b border-gray-50 last:border-0">
        <td className="py-5 font-bold tracking-wider">{id}</td>
        <td className="py-5 text-gray-600">{type}</td>
        <td className="py-5 font-bold text-[#3D2B1F]">{qty}</td>
        <td className="py-5 text-[#A89485]">{date}</td>
        <td className="py-5 text-right">
            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${status === 'Đã lấy hàng' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {status}
            </span>
        </td>
    </tr>
);

export default SupplierDashboard;