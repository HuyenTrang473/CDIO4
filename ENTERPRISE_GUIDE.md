# 🏪 Warehouse Management System - Enterprise Edition
## Hệ Thống Quản Lý Kho - Phiên Bản Doanh Nghiệp

---

## 📋 Tổng Quan Hệ Thống

### Kiến trúc Module

```
├── 🔐 RBAC (Role-Based Access Control)
│   └── RBACContext.jsx - Phân quyền theo vai trò
│
├── 📊 Executive Dashboard (ReportsPage)
│   ├── AI Insights Engine
│   ├── KPI Cards (Turnover, Health Score, Top Vendor)
│   ├── Advanced Filters (Vendor + Category)
│   └── Approval Workflow (>10M)
│
├── 🔍 Search Intelligence
│   └── SearchIntelligencePage.jsx - Tìm kiếm ngữ nghĩa + Product 360°
│
├── 🤖 AI Assistant Pro
│   └── AIAssistantPage.jsx - Chat tiếng Việt 24/7 với context memory
│
└── 🧑‍💼 Role-Specific Features
    ├── Owner: Executive Dashboard + Strategic Reports
    ├── IT Admin: System Ops + AI Management
    ├── Warehouse Staff: Inbound/Outbound + Cycle Count + Slotting
    └── Vendor: Self-Service Portal + Scorecard
```

---

## 👥 Phân Quyền (RBAC System)

### 1. Vai trò (Roles)
```
┌─────────────────┬──────────────────────────────────────┐
│ Role            │ Mô tả                                │
├─────────────────┼──────────────────────────────────────┤
│ OWNER           │ CEO/Chủ doanh nghiệp                 │
│ IT_ADMIN        │ Quản trị hệ thống                    │
│ WAREHOUSE_STAFF │ Nhân viên kho                        │
│ VENDOR          │ Nhà cung cấp (Portal)                │
└─────────────────┴──────────────────────────────────────┘
```

### 2. Quyền hạn (Permissions)
**Dashboard & Reports:**
- `VIEW_EXECUTIVE_DASHBOARD` - Xem dashboard cao cấp
- `VIEW_WAREHOUSE_REPORTS` - Xem báo cáo kho
- `EXPORT_REPORTS` - Xuất báo cáo Excel/PDF/BI

**Products:**
- `CRUD_PRODUCT` - Tạo/Sửa/Xóa sản phẩm
- `VIEW_PRODUCT_360` - Xem thông tin sản phẩm đầy đủ

**Stock Operations:**
- `INBOUND_GOODS` - Nhập kho
- `OUTBOUND_GOODS` - Xuất kho
- `CYCLE_COUNT` - Kiểm kho
- `SLOTTING` - Tối ưu vị trí kệ

**AI Features:**
- `USE_AI_CHAT` - Chat với AI
- `ADVANCED_AI_ANALYTICS` - AI phân tích nâng cao
- `MANAGE_AI` - Quản lý AI (cost, prompts)

---

## 🎯 Các Chức Năng Chính

### A. 🔐 Executive Dashboard (ReportsPage)

**1. AI Business Intelligence Engine**
- ⚠️ Cảnh báo thời gian thực (stock out, low inventory)
- 💡 Cơ hội kinh doanh (seasonal trends, demand spikes)
- ✅ Khuyến nghị hành động (supplier negotiation, restock timing)

**2. KPI Cards**
```
📈 Tỷ lệ Luân chuyển Kho (Turnover Ratio)
   = Giá trị xuất / Giá trị tồn kho
   Target: > 3 (3 vòng quay/năm)

💪 Điểm Sức Khỏe Kho (Stock Health Score)
   = % sản phẩm không bị hết hàng
   Target: > 95%

⭐ Top Nhà Cung Cấp
   = Nhà cung cấp với giá trị giao dịch cao nhất

🚚 Thời gian Giao Hàng TB
   = Trung bình ngày giao từ đơn đặt
   Target: < 20 ngày
```

**3. Advanced Filters**
- Lọc theo: Vendor + Category + Stock Status + Price Range
- Sort: Tên / Giá / Tồn kho
- Real-time product count update

**4. Approval Workflow**
```
Decision Tree:
Giao dịch > 10M
├─ Nếu > 50M: 🔴 Rủi ro cao → Cần phê duyệt
├─ Nếu 10-50M: 🟡 Rủi ro trung → Auto-approve nếu vendor score > 90%
└─ Nếu < 10M: ✅ Auto-approve
```

---

### B. 🔍 Search Intelligence Page

**1. Semantic Search + Multi-Criteria Filters**
```
Tìm kiếm theo:
├─ Tên sản phẩm
├─ SKU / Barcode
├─ Nhà cung cấp (Vendor)
└─ Giá / Tồn kho

Bộ lọc:
├─ 👥 Nhà cung cấp
├─ 📦 Loại sản phẩm
├─ 🟢 Trạng thái tồn kho (Có sẵn / Tồn thấp / Hết hàng)
├─ 💰 Khoảng giá
└─ 📈 Sắp xếp theo (Tên / Giá / Tồn)
```

**2. Product 360° Modal**
Display info:
```
┌─────────────────────────────────────┐
│ 📦 CHI TIẾT SẢN PHẨM 360°           │
├─────────────────────────────────────┤
│ • Tên & SKU & Barcode               │
│ • Nhà cung cấp & Loại               │
│ • Giá gốc / Giá bán                 │
│ • Tồn hiện tại / Tối thiểu          │
│ • Hạn sử dụng                       │
│ • Vị trí kệ (Location)              │
│ • Margin lợi nhuận                  │
│ • QR Code                           │
└─────────────────────────────────────┘
```

---

### C. 🤖 AI Assistant Pro Page

**1. Vietnamese Context-Aware Chat**
Templates (nhanh tay):
- 📊 "So sánh tồn kho SP A vs B tháng trước vs tháng này"
- 📈 "Dự báo cần nhập bao nhiêu SP X dựa trên biến động bán?"
- 🏆 "Nhà cung cấp nào có tỷ lệ giao hàng đúng hạn cao nhất?"
- 📦 "Sản phẩm nào nên để ở kệ gần nhất theo tần suất bán?"

**2. Context Memory**
- Lưu 30 cuộc trò chuyện gần nhất
- AI nhớ ngữ cảnh kho hàng của bạn
- Support complex multi-turn queries

**3. Analytics Queries (Examples)**
```
User: "Dự báo tháng sau cần nhập bao nhiêu sp X?"
AI Response:
  📊 Tốc độ tiêu thụ SP X: 50 cái/ngày
  🎯 Dự báo tháng sau: 1,500 cái
  💰 Chi phí: ~150 triệu VNĐ
  ✅ Thời điểm nhập: Tuần 1 tháng sau
```

---

## 🔧 Cài Đặt & Sử Dụng

### 1. Setup RBACProvider (main.jsx / App.jsx)
```jsx
import { RBACProvider } from './context/RBACContext';

<RBACProvider>
  <App />
</RBACProvider>
```

### 2. Sử dụng RBAC Hook
```jsx
import { useRBAC } from './context/RBACContext';

const MyComponent = () => {
  const { hasPermission, hasRole, logAudit } = useRBAC();
  
  if (!hasPermission('VIEW_EXECUTIVE_DASHBOARD')) {
    return <AccessDenied />;
  }
  
  const handleApprovalChange = (action) => {
    logAudit('APPROVE_ORDER', { orderId: 123, action });
  };
};
```

### 3. Thêm Route (Router config)
```jsx
<Route path="/dashboard" element={<ReportsPage />} />
<Route path="/search" element={<SearchIntelligencePage />} />
<Route path="/ai-assistant" element={<AIAssistantPage />} />
```

---

## 📊 Database Schema Updates

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  sku: String,
  barcode: String,
  category: String,
  vendor: String,
  costPrice: Number,
  sellingPrice: Number,
  stockQuantity: Number,
  minimumStock: Number,
  unit: String,
  expiryDate: Date,
  location: String,  // NEW: Vị trí kệ (A1, B3, C10)
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection - Add Role
```javascript
{
  _id: ObjectId,
  username: String,
  role: String, // 'owner' | 'it_admin' | 'warehouse_staff' | 'vendor'
  permissions: [String], // Custom permissions override
  createdAt: Date
}
```

### Transactions Collection - Add Approval
```javascript
{
  _id: ObjectId,
  productId: ObjectId,
  quantity: Number,
  type: String, // 'in' | 'out'
  approvedBy: ObjectId, // NEW
  approvalStatus: String, // 'pending' | 'approved' | 'rejected'
  approvalNotes: String,
  createdAt: Date
}
```

### AuditLog Collection - NEW
```javascript
{
  _id: ObjectId,
  timestamp: Date,
  user: String,
  role: String,
  action: String, // 'APPROVE_ORDER', 'EXPORT_REPORT', etc
  details: Object,
  ipAddress: String,
  createdAt: Date
}
```

---

## 🚀 API Endpoints (Backend)

```bash
# Products
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

# Transactions
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id/approve

# Vendors
GET    /api/vendors/:vendorId/scorecard
GET    /api/vendors/:vendorId/performance

# Reports
GET    /api/reports/kpis?dateRange=month
GET    /api/reports/vendor-performance
POST   /api/reports/export?format=excel|pdf

# Audit
GET    /api/audit-log?user=admin&action=APPROVE_ORDER

# AI
POST   /api/ai/query
GET    /api/ai/conversation/:id
POST   /api/ai/training-data
```

---

## 📈 KPI Metrics

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| **Inventory Turnover Ratio** | COGS / Avg Inventory | 3.0x/year | Monthly |
| **Stock Health Score** | % Products Available | >95% | Real-time |
| **Vendor On-Time Rate** | Delivered on time / Total | >95% | Monthly |
| **Avg Lead Time** | Σ Days from PO to receipt | <20 days | Monthly |
| **Stock-Out Rate** | Days out / Total days | <2% | Real-time |
| **ABC Utilization** | % A-items in A-location | >90% | Weekly |

---

## 🔒 Security & Audit Trail

**Audit Log Tracks:**
```
✅ User login / logout
✅ CRUD operations (Product, Vendor, User)
✅ Approval actions (approve/reject/modify)
✅ Report exports
✅ Configuration changes
✅ Access violations
```

**Access Control:**
- Row-level: Vendors only see their POs
- Column-level: Warehouse staff can't see cost prices
- Time-based: Reports auto-anonymize data > 1 year

---

## 💡 Tips & Best Practices

1. **Vendor Scorecard Usage**
   - Review monthly to identify underperformers
   - Use AI insights to negotiate SLAs
   - Flag vendors < 90% on-time rate

2. **AI Assistant Best Queries**
   - Be specific: "Compare SKU ABC123 sales vs inventory trends Q1-Q2"
   - Use date ranges: "Show top 10 products by margin for Jan 1-30"
   - Ask predictions: "Which category needs restock in 2 weeks?"

3. **Approval Workflow**
   - Set thresholds higher for new vendors
   - Use risk badges to quick-assess large orders
   - Document rejection reasons for vendor feedback

4. **Slotting Optimization**
   - Run ABC analysis monthly
   - Place top 20% items (A) in closest locations
   - Automate slow-movers to remote shelves

---

## 📞 Support & Troubleshooting

### Permission Denied Error?
```jsx
// Check RBAC Context is wrapping your app
// Verify user.role matches one of: owner, it_admin, warehouse_staff, vendor
```

### Search Not Working?
```jsx
// Ensure products are loaded in state
// Check filters aren't too restrictive
// Try clearing all filters first
```

### AI Responses Slow?
```
// May be API timeout - check network
// Consider caching common queries
// Implement pagination for large datasets
```

---

## 📝 License & Version
**Version:** 1.0.0-Enterprise Edition
**Last Updated:** 2026-03-24
**Framework:** React + Node.js + MongoDB
