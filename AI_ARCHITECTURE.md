# 🏗️ AI Assistant Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Dashboard / Warehouse Pages                   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │   🤖 AI Assistant Widget (Bottom Right)         │  │   │
│  │  │                                                  │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │ Chat Messages Display                    │   │  │   │
│  │  │  │ - User questions on right (blue)        │   │  │   │
│  │  │  │ - AI responses on left (gray)            │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                  │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │ Input Field + Send Button                │   │  │   │
│  │  │  │ 💬 "Tồn thấp sp nào?"                   │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
              ↓↑
         HTTP/HTTPS with JWT
         Authorization Header
              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Route: /api/ai/*                                             │
│  Middleware: authMiddleware.protect                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           AI Controller (aiController.js)              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ 1. getWarehouseData()         → Complete data        │   │
│  │ 2. getLowStockAlert()         → Low stock products   │   │
│  │ 3. getPendingOrders()         → Inbound orders       │   │
│  │ 4. getRevenueStats()          → Sales analytics      │   │
│  │ 5. getSupplierAnalytics()     → Supplier ranking     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    ↓↑ (Queries)                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MongoDB Database                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ ├─ Products Collection                               │   │
│  │ │  ├─ name, sku, stockQuantity                       │   │
│  │ │  ├─ costPrice, salePrice                          │   │
│  │ │  ├─ minimumStock, unit                            │   │
│  │ │  └─ supplier (reference to Supplier)              │   │
│  │ │                                                    │   │
│  │ ├─ Suppliers Collection                             │   │
│  │ │  ├─ name, contactName, phone, email              │   │
│  │ │  └─ address                                       │   │
│  │ │                                                    │   │
│  │ ├─ Transactions Collection                          │   │
│  │ │  ├─ product (reference to Product)               │   │
│  │ │  ├─ type ('in' or 'out')                         │   │
│  │ │  ├─ quantity, price, notes                        │   │
│  │ │  └─ timestamps (createdAt, updatedAt)            │   │
│  │ │                                                    │   │
│  │ └─ Users Collection (for authentication)            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Example

### User Asks: "Tồn thấp sp nào?"

```
1. USER INPUT
   └─ Clicks on AI Widget
   └─ Types: "Tồn thấp sp nào?"
   └─ Presses Enter

        ↓

2. WIDGET PROCESSING (React)
   ├─ AIAssistantWidget.jsx captures input
   ├─ Calls handleSendMessage()
   ├─ Shows "✍️ Đang suy nghĩ..." loading state
   └─ Calls generateAIResponse(userMessage)

        ↓

3. DATA FETCHING
   ├─ If dataCache is empty → fetchWarehouseData()
   │  └─ HTTP GET /api/ai/warehouse-data
   │     + Header: Authorization: Bearer {JWT_TOKEN}
   │
   ├─ Extract and format product list
   └─ Cache data in state for reuse

        ↓

4. SERVER PROCESSING
   ├─ Express receives GET /api/ai/warehouse-data
   ├─ Middleware authMiddleware.protect()
   │  ├─ Extract token from header
   │  ├─ Verify JWT signature
   │  └─ Attach user to request
   │
   ├─ Route to aiController.getWarehouseData()
   │  ├─ Query MongoDB Products
   │  │  └─ Find all with population of supplier/category
   │  ├─ Query MongoDB Suppliers
   │  ├─ Query MongoDB Transactions
   │  └─ Format data for response
   │
   └─ Return JSON with all data

        ↓

5. AI LOGIC
   ├─ generateAIResponse receives formatted data
   ├─ Analyzes user message: "tồn thấp"
   ├─ Filters products where quantity < 50
   ├─ Builds response with:
   │  ├─ Product name & SKU
   │  ├─ Current stock quantity
   │  ├─ Total value (qty × price)
   │  └─ Preferred supplier info
   │
   └─ Format with emojis and Unicode bullets

        ↓

6. RESPONSE DISPLAY
   ├─ Message appears in chat
   ├─ Shows in formatted box
   ├─ User can read insights
   └─ Ready for next question

        ↓

7. USER SEES
   ⚠️ SẢN PHẨM TỒN THẤP

   1. Arabica Coffee (SKU-001)
      📦 Tồn: 25 cái
      💰 Tổng giá trị: 1,250,000 VNĐ
      🏭 NCC: Mr. Hòa Supplier

   [Additional products...]

   💡 Khuyến nghị: Đặt ngay từ nhà cung cấp!
```

---

## Component Relationships

```
DashboardLayout
    ↓ (imports)
    └─ AIAssistantWidget
        ├─ State: isOpen, isMinimized, messages, input, loading
        ├─ State: dataCache (performance optimization)
        │
        ├─ Methods:
        │  ├─ fetchWarehouseData() → calls /api/ai/warehouse-data
        │  ├─ generateAIResponse(msg) → AI logic
        │  └─ handleSendMessage() → UI update
        │
        ├─ UI:
        │  ├─ Toggle Button (always visible)
        │  ├─ Chat Window (expandable)
        │  ├─ Message Display (scrollable)
        │  ├─ Input Field (with send button)
        │  └─ Header (minimize/close)
        │
        └─ Effects:
           ├─ useEffect → scroll to bottom on new message
           ├─ useEffect → fetch data on widget open
           └─ useEffect → cleanup on unmount
```

---

## File Structure

```
warehouse-mini-project/
├── 🆕 AI_ASSISTANT_GUIDE.md ← You are here!
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── DashboardLayout.jsx (MODIFIED - added widget)
│       │   └── 🆕 AIAssistantWidget.jsx (NEW - main widget)
│       │
│       ├── context/
│       │   └── AuthContext.jsx (uses existing auth)
│       │
│       └── pages/
│           └── AIAssistantPage.jsx (full-page version)
│
└── server/
    ├── app.js (MODIFIED - added AI routes)
    │
    ├── controllers/
    │   ├── 🆕 aiController.js (NEW - AI logic)
    │   └── [other controllers]
    │
    ├── routes/
    │   ├── 🆕 aiRoutes.js (NEW - AI endpoints)
    │   └── [other routes]
    │
    ├── middleware/
    │   └── authMiddleware.js (uses existing auth)
    │
    ├── models/
    │   ├── Product.js
    │   ├── Supplier.js
    │   ├── Transaction.js
    │   └── User.js
    │
    └── config/
        └── db.config.js
```

---

## Workflow Summary

```
USER INTERACTION
    ↓
TYPE QUESTION
    ↓
SEND MESSAGE
    ↓
FETCH DATA FROM /api/ai/*
    ↓
PROCESS WITH AI LOGIC
    ↓
GENERATE RESPONSE
    ↓
DISPLAY IN CHAT
    ↓
USER SEES ANSWER
    ↓
ASK FOLLOW-UP (loop)
```

---

## Authentication Flow

```
1. User logs in → receives JWT token
   └─ Stored in localStorage by AuthContext

2. AIAssistantWidget opens
   └─ Reads token from AuthContext

3. Makes API call to /api/ai/*
   ├─ Adds header: Authorization: Bearer {TOKEN}
   └─ Sent to server

4. Server receives request
   ├─ authMiddleware.protect() validates token
   ├─ If valid → proceeds to controller
   └─ If invalid → returns 401 Unauthorized

5. Controller executes
   ├─ User is attached to request
   ├─ Can implement role-based filtering if needed
   └─ Returns data

6. Widget receives response
   ├─ Formats for UI display
   └─ Shows to user
```

---

## Error Handling Strategy

```
LAYER 1: Widget Level
    ├─ Try/catch in generateAIResponse()
    ├─ Try/catch in fetchWarehouseData()
    └─ Shows: "❌ Lỗi xử lý. Vui lòng thử lại."

LAYER 2: Fallback to Individual Endpoints
    ├─ If /api/ai/warehouse-data fails
    ├─ Try: /api/products, /api/suppliers, /api/transactions
    └─ Data formatted into cache for processing

LAYER 3: Server Level
    ├─ Controller error handling
    ├─ Returns 500 with error message
    └─ Client shows user-friendly message

LAYER 4: Database Level
    ├─ MongoDB connection errors
    ├─ Query failures
    └─ Caught by server and sent to client
```

---

## Performance Optimizations

```
1. DATA CACHING
   ├─ dataCache state stores fetched data
   ├─ Reused for multiple AI queries
   └─ Reduces API calls

2. LAZY LOADING
   ├─ Data fetched only when widget opens
   ├─ Not on every page load
   └─ Improves initial app load time

3. REQUEST DEBOUNCING
   ├─ Multiple queries in short time
   ├─ Only last question processed
   └─ Prevents server overload

4. RESPONSE CACHING
   ├─ Similar questions get cached responses
   ├─ AI logic runs once, result reused
   └─ Faster response to follow-ups
```

---

## Scalability Considerations

For production deployment:

1. **Rate Limiting**
   ```javascript
   // Add to aiRoutes.js
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 1 * 60 * 1000, // 1 minute
     max: 30 // 30 requests per minute
   });
   router.use(limiter);
   ```

2. **Caching Layer**
   ```javascript
   // Use Redis for distributed caching
   // Cache expensive aggregations
   ```

3. **Database Indexing**
   ```javascript
   // Add indexes to frequently queried fields
   productSchema.index({ stockQuantity: 1 });
   productSchema.index({ supplier: 1 });
   ```

4. **Load Balancing**
   ```javascript
   // Deploy multiple server instances
   // Behind load balancer
   ```

---

## Security Checklist

- ✅ JWT authentication on all AI endpoints
- ✅ Authorization middleware validates token
- ✅ No sensitive data in error messages
- ✅ Input validation on AI queries
- ✅ SQL injection prevention (using Mongoose)
- ✅ XSS prevention (React auto-escapes)
- ✅ Admin audit logging (optional enhancement)

---

## Testing Guide

### Test Case 1: Widget Visibility
```
1. Login to application
2. Navigate to any page (/, /products, /reports, etc.)
3. Look bottom-right corner for robot button
4. ✅ Button should be visible and clickable
```

### Test Case 2: Open/Close Widget
```
1. Click robot button
2. ✅ Widget should expand with smooth animation
3. Click close (X) button
4. ✅ Widget should collapse
```

### Test Case 3: Send Message
```
1. Open widget
2. Type: "Tồn thấp sp nào?"
3. Press Enter or click send button
4. ✅ Message appears in blue on right
5. ✅ Loading indicator shows briefly
6. ✅ AI response appears in gray on left
```

### Test Case 4: Multiple Queries
```
1. Ask: "Tồn thấp sp nào?"
2. Ask: "Đơn NCC nào đang chờ?"
3. Ask: "Doanh thu tuần này?"
4. ✅ All responses display correctly
5. ✅ Chat history maintains context
```

### Test Case 5: Minimize/Restore
```
1. Open widget
2. Click minimize (down arrow)
3. ✅ Widget shows only header
4. ✅ Input field hidden
5. Click header to restore
6. ✅ Full widget shows again
```

---

## Support & Troubleshooting

### Issue: Widget not appearing
```
Debug:
1. Open DevTools (F12)
2. Check Console for errors
3. Ensure DashboardLayout.jsx imports AIAssistantWidget
4. Verify component is rendered in JSX
```

### Issue: API returns 401
```
Debug:
1. Check token is valid
2. Verify authMiddleware.protect() in AI routes
3. Ensure token sent in Authorization header
4. Check JWT_SECRET in .env matches
```

### Issue: No data displayed
```
Debug:
1. Verify MongoDB is running
2. Check database has sample data
3. Test API endpoints with Postman
4. Review server logs for query errors
```

---

**🎉 Implementation Complete!**

Your warehouse now has AI power on every page! 🤖✨
