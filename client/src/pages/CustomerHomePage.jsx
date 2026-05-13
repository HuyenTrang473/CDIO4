import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Coffee } from "lucide-react";
import { NotificationItem, StatusCard, OrderRow } from "./CustomerDashboard";

const CustomerHomePage = () => {
  const navigate = useNavigate();
  const goTo = (path) => () => navigate(path);

  return (
    <>
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 relative h-[340px] rounded-[2.5rem] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Coffee background"
          />
          <div className="absolute inset-0 banner-overlay"></div>
          <div className="relative z-10 p-16 h-full flex flex-col justify-center text-[#FDF8F3] max-w-lg">
            <h2 className="text-4xl font-bold mb-4 leading-[1.1]">
              Chào mừng trở lại,
              <br />
              Estate Member.
            </h2>
            <p className="text-sm opacity-70 mb-10 leading-relaxed font-light">
              Nâng tầm trải nghiệm cà phê của bạn với những lựa chọn tốt nhất từ
              các trang trại cao cấp trên toàn thế giới.
            </p>
            <div className="flex gap-4">
              <button
                onClick={goTo("/customer/orders/inbound")}
                className="bg-white text-[#3D2B1F] px-8 py-3.5 rounded-xl font-extrabold text-[11px] uppercase tracking-widest hover:bg-[#FDF8F3] transition-colors shadow-lg"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={goTo("/customer/products")}
                className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl font-extrabold text-[11px] uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Khám phá mới
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#EFE3D5]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-extrabold text-sm uppercase tracking-widest">
              Thông báo mới
            </h3>
            <span className="bg-green-100 text-green-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
              4 TIN MỚI
            </span>
          </div>
          <div className="space-y-8">
            <NotificationItem
              icon={<Package size={16} className="text-orange-600" />}
              color="bg-orange-50"
              text="Đơn hàng #RL-9021 đang giao"
              desc="Tài xế đang vận chuyển đến địa chỉ của bạn."
              time="10 phút trước"
            />
            <NotificationItem
              icon={<Coffee size={16} className="text-green-600" />}
              color="bg-green-50"
              text="Ưu đãi độc quyền Estate"
              desc="Giảm 15% cho dòng Robusta Honey mới."
              time="2 giờ trước"
            />
          </div>
          <button className="w-full text-center text-[10px] font-extrabold uppercase tracking-[0.2em] mt-10 text-[#A89485] hover:text-[#3D2B1F] transition-colors">
            Tất cả thông báo
          </button>
        </div>
      </div>

      <section className="mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[10px] font-black text-[#A89485] uppercase tracking-[0.25em] mb-2">
              Hoạt động vận hành
            </p>
            <h3 className="text-2xl font-bold tracking-tight">
              Trạng thái đơn hàng
            </h3>
          </div>
          <button
            onClick={goTo("/customer/orders/inbound")}
            className="text-[11px] font-bold underline decoration-2 underline-offset-4 text-[#A89485] hover:text-[#3D2B1F]"
          >
            Lịch sử đơn hàng
          </button>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <StatusCard
            count="03"
            label="Đơn hàng đang trong giai đoạn rang & đóng gói"
            tag="Đang xử lý"
            tagColor="bg-orange-100 text-orange-700"
          />
          <StatusCard
            count="02"
            label="Đơn hàng đang trên đường tới địa điểm của bạn"
            tag="Đang giao"
            tagColor="bg-green-100 text-green-700"
          />
          <StatusCard
            count="14"
            label="Tổng số đơn hàng thành công trong tháng này"
            tag="Hoàn thành"
            tagColor="bg-[#EFE3D5] text-[#3D2B1F]"
          />
        </div>
      </section>

      <section className="mt-16 bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#EFE3D5]">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8">
          Đơn hàng gần đây
        </h3>
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black text-[#A89485] uppercase tracking-widest border-b border-gray-100">
              <th className="pb-6 text-left">Mã đơn hàng</th>
              <th className="pb-6 text-left">Sản phẩm</th>
              <th className="pb-6 text-left">Ngày đặt</th>
              <th className="pb-6 text-left">Tổng tiền</th>
              <th className="pb-6 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <OrderRow
              id="#RL-9024"
              product="Arabica Cầu Đất (500g) x2"
              date="Hôm nay, 14:20"
              price="1.100.000đ"
              status="Đang xử lý"
            />
            <OrderRow
              id="#RL-8911"
              product="Robusta Honey (1kg)"
              date="12 Th05, 2024"
              price="640.000đ"
              status="Đang giao"
            />
            <OrderRow
              id="#RL-8802"
              product="Mix Pack (Taster Box)"
              date="08 Th05, 2024"
              price="450.000đ"
              status="Hoàn thành"
            />
          </tbody>
        </table>
      </section>
    </>
  );
};

export default CustomerHomePage;
