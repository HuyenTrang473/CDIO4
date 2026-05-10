import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Truck, Warehouse, FileText, Users, 
    Search, Bell, LogOut, Settings, HelpCircle, 
    Plus, Map, ChevronRight, Filter, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                .vendor-container {
                    font-family: 'Inter', sans-serif;
                    background-color: #FDF8F3;
                    color: #3D2B1F;
                }

                .sidebar-shadow {
                    box-shadow: 4px 0 24px rgba(61, 43, 31, 0.02);
                }

                .card-base {
                    background: #ffffff;
                    border: 1px solid #EFE3D5;
                    border-radius: 12px;
                    padding: 24px;
                }

                .status-progress {
                    height: 6px;
                    background: #EFE3D5;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 12px;
                }
                .progress-fill {
                    height: 100%;
                    background: #4A6741;
                    border-radius: 10px;
                }

                .btn-dark {
                    background-color: #3D2B1F;
                    color: #FDF8F3;
                    transition: all 0.3s;
                }
                .btn-dark:hover {
                    background-color: #000000;
                }

                .chart-bar {
                    background: #EFE3D5;
                    width: 40px;
                    border-radius: 4px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    overflow: hidden;
                }
                .chart-fill {
                    background: #4A6741;
                    width: 100%;
                    transition: height 1s ease-in-out;
                }

                .log-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-top: 6px;
                }

                .table-vendor th {
                    text-align: left;
                    padding: 16px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #A89485;
                    letter-spacing: 0.1em;
                    border-bottom: 1px solid #F3F0EE;
                }
                .table-vendor td {
                    padding: 20px 16px;
                    font-size: 12px;
                }
            `}} />

            <div className="vendor-container flex min-h-screen">
                {/* SIDEBAR */}
                <aside className="w-64 bg-white border-r border-[#EFE3D5] flex flex-col p-6 sticky top-0 h-screen sidebar-shadow">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3D2B1F] rounded-lg flex items-center justify-center">
                            <Warehouse size={20} className="text-[#FDF8F3]" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-widest uppercase">RoastLogic</h1>
                            <p className="text-[9px] font-bold text-[#A89485] tracking-tighter">ENTERPRISE TIER</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <NavItem icon={<LayoutDashboard size={18}/>} label="Tổng quan" active />
                        <NavItem icon={<Truck size={18}/>} label="Giao hàng" />
                        <NavItem icon={<Warehouse size={18}/>} label="Tồn kho" />
                        <NavItem icon={<FileText size={18}/>} label="Sổ cái" />
                        <NavItem icon={<Users size={18}/>} label="Danh bạ" />
                    </nav>

                    <div className="mt-auto space-y-2 pt-6 border-t border-[#EFE3D5]">
                        <button className="w-full btn-dark py-3.5 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider mb-4 shadow-sm">
                            Đơn hàng mới
                        </button>
                        <NavItem icon={<HelpCircle size={18}/>} label="Hỗ trợ" />
                        <NavItem icon={<Settings size={18}/>} label="Cài đặt" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-600 font-bold text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-lg mt-2">
                            <LogOut size={18} /> Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-10 overflow-y-auto">
                    {/* TOP HEADER */}
                    <header className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Trang chủ nhà cung cấp</h2>
                        <div className="flex items-center gap-8">
                            <div className="relative w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89485]" size={16} />
                                <input type="text" placeholder="Tìm kiếm đơn hàng, mã SKU..." className="w-full bg-[#EFE3D5]/50 border-none rounded-lg py-2.5 pl-11 pr-4 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#3D2B1F]" />
                            </div>
                            <Bell size={20} className="text-[#3D2B1F] cursor-pointer" />
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-xs font-black uppercase tracking-tighter leading-none">{user?.ten || 'Nguyễn Văn A'}</p>
                                    <p className="text-[9px] font-bold text-[#A89485] uppercase tracking-widest mt-1">Quản trị viên kho</p>
                                </div>
                                <div className="w-10 h-10 bg-[#EFE3D5] rounded-full border-2 border-white overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Vendor&background=3D2B1F&color=fff" alt="avatar" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* TOP KPI CARDS */}
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="card-base relative">
                            <span className="absolute top-6 right-6 bg-[#E8F5E9] text-[#4A6741] text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter border border-[#4A6741]/20">Ưu tiên cao</span>
                            <div className="w-10 h-10 bg-[#FDF8F3] border border-[#EFE3D5] rounded-lg flex items-center justify-center mb-4 text-[#3D2B1F]">
                                <AlertCircle size={20} />
                            </div>
                            <p className="text-[10px] font-black text-[#A89485] uppercase tracking-[0.15em] mb-1">Cần phê duyệt</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold">12</h3>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Đơn mới</span>
                            </div>
                            <div className="mt-6 flex justify-between items-center border-t border-gray-50 pt-4">
                                <span className="text-[9px] text-gray-400 font-bold uppercase italic">Cập nhật 5 phút trước</span>
                                <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">Xử lý ngay <ChevronRight size={14}/></button>
                            </div>
                        </div>

                        <div className="card-base relative">
                            <span className="absolute top-6 right-6 bg-[#FFF3E0] text-[#E65100] text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter border border-[#E65100]/20">Cần nhập kho</span>
                            <div className="w-10 h-10 bg-[#FDF8F3] border border-[#EFE3D5] rounded-lg flex items-center justify-center mb-4 text-[#3D2B1F]">
                                <Truck size={20} />
                            </div>
                            <p className="text-[10px] font-black text-[#A89485] uppercase tracking-[0.15em] mb-1">Trạng thái cung ứng</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold">94%</h3>
                                <span className="text-sm font-bold text-[#4A6741] uppercase tracking-tighter">Ổn định</span>
                            </div>
                            <div className="status-progress">
                                <div className="progress-fill" style={{ width: '94%' }}></div>
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden bg-[#2C1810] text-[#FDF8F3] p-10 flex flex-col justify-between">
                            <img src="https://www.transparenttextures.com/patterns/dark-wood.png" className="absolute inset-0 opacity-10" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-[#A89485] uppercase tracking-[0.2em] mb-2">Kho tổng RoastLogic</p>
                                <h3 className="text-2xl font-bold leading-tight">Phân khu A-12<br/>Đang vận hành tối ưu</h3>
                            </div>
                            <div className="relative z-10 flex justify-between items-end mt-12">
                                <div>
                                    <p className="text-[9px] font-bold text-[#A89485] uppercase mb-1">Dung lượng hiện tại</p>
                                    <p className="text-2xl font-bold">1,240 <span className="text-xs font-light">m³</span></p>
                                </div>
                                <div className="w-12 h-12 bg-[#FDF8F3] rounded-xl flex items-center justify-center text-[#3D2B1F] shadow-lg cursor-pointer hover:scale-105 transition-transform">
                                    <Map size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN VISUALS */}
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        {/* CHART SECTION */}
                        <div className="col-span-3 card-base">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h4 className="text-xl font-black tracking-tight">Hiệu suất Giao hàng</h4>
                                    <p className="text-[11px] text-[#A89485] font-medium mt-1">Phân tích tỉ lệ giao đúng hạn trong 30 ngày qua</p>
                                </div>
                                <div className="flex bg-[#FDF8F3] border border-[#EFE3D5] p-1 rounded-lg">
                                    <button className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all">Tuần</button>
                                    <button className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md bg-[#3D2B1F] text-white">Tháng</button>
                                </div>
                            </div>
                            <div className="flex justify-between items-end h-64 px-4">
                                <ChartBar label="W1" height="60%" fill="75%" />
                                <ChartBar label="W2" height="85%" fill="80%" />
                                <ChartBar label="W3" height="70%" fill="60%" />
                                <ChartBar label="W4" height="90%" fill="95%" />
                                <ChartBar label="W5" height="100%" fill="85%" />
                                <ChartBar label="W6" height="80%" fill="70%" />
                                <ChartBar label="W7" height="75%" fill="90%" />
                            </div>
                        </div>

                        {/* LOGS SECTION */}
                        <div className="card-base flex flex-col">
                            <h4 className="text-sm font-black uppercase tracking-widest mb-8">Nhật ký hệ thống</h4>
                            <div className="space-y-6 flex-1">
                                <LogItem color="bg-green-600" title="Lô hàng #SKU-293 đã xuất kho" time="14:20 • Đã xác nhận" />
                                <LogItem color="bg-red-600" title="Thiếu hụt tồn kho Arabica G1" time="11:05 • Cảnh báo" />
                                <LogItem color="bg-blue-600" title="Cập nhật giá Robusta kỳ hạn" time="09:30 • Thông báo" />
                                <LogItem color="bg-green-600" title="Phê duyệt đối tác giao vận mới" time="Hôm qua • Hoàn tất" />
                            </div>
                            <button className="w-full bg-[#FDF8F3] text-[10px] font-black uppercase tracking-widest py-3 mt-6 rounded-lg border border-[#EFE3D5] hover:bg-white transition-all">Xem toàn bộ lịch sử</button>
                        </div>
                    </div>

                    {/* RECENT ORDERS TABLE */}
                    <section className="card-base">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-sm font-black uppercase tracking-[0.15em]">Danh sách Đơn hàng Chờ Phê Duyệt</h4>
                            <button className="flex items-center gap-2 bg-[#FDF8F3] border border-[#EFE3D5] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                <Filter size={14}/> Bộ lọc
                            </button>
                        </div>
                        <table className="w-full table-vendor">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Sản phẩm</th>
                                    <th>Ngày đặt</th>
                                    <th>Số lượng</th>
                                    <th>Giá trị</th>
                                    <th className="text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <OrderRow id="#ORD-9821" product="Arabica Ethiopia Yirgacheffe" date="15/10/2023" qty="500 kg" price="450,000,000 đ" />
                                <OrderRow id="#ORD-9819" product="Robusta Vietnam Special" date="14/10/2023" qty="1,200 kg" price="320,000,000 đ" />
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>
    );
};

// Sub-components
const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#FDF8F3] text-[#3D2B1F] font-black shadow-sm' : 'text-[#A89485] hover:bg-gray-50'}`}>
        {icon}
        <span className="text-[13px] tracking-tight">{label}</span>
    </div>
);

const LogItem = ({ color, title, time }) => (
    <div className="flex gap-4 group cursor-pointer">
        <div className={`log-dot ${color} shrink-0`}></div>
        <div>
            <h5 className="text-[11px] font-black leading-tight mb-1 group-hover:text-black transition-colors">{title}</h5>
            <p className="text-[9px] text-[#A89485] font-bold uppercase tracking-tight">{time}</p>
        </div>
    </div>
);

const ChartBar = ({ label, height, fill }) => (
    <div className="flex flex-col items-center gap-4 h-full">
        <div className="chart-bar" style={{ height: height }}>
            <div className="chart-fill" style={{ height: fill }}></div>
        </div>
        <span className="text-[10px] font-black text-[#A89485]">{label}</span>
    </div>
);

const OrderRow = ({ id, product, date, qty, price }) => (
    <tr className="hover:bg-[#FDF8F3] transition-colors group">
        <td className="font-bold text-xs tracking-widest">{id}</td>
        <td>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#EFE3D5]/40 rounded-md flex items-center justify-center text-[#3D2B1F]">
                    <FileText size={14} />
                </div>
                <span className="font-bold">{product}</span>
            </div>
        </td>
        <td className="text-[#A89485] font-medium">{date}</td>
        <td className="text-gray-600 font-medium">{qty}</td>
        <td className="font-black text-sm">{price}</td>
        <td className="text-right">
            <button className="text-[10px] font-black uppercase tracking-widest text-[#4A6741] border border-[#4A6741]/30 px-4 py-1.5 rounded-full hover:bg-[#4A6741] hover:text-white transition-all">Phê duyệt</button>
        </td>
    </tr>
);

export default VendorDashboard;