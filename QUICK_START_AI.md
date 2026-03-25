# ⚡ Quick Start: AI Assistant 24/7

## 🎯 In 5 Minutes

### Step 1: Start the Backend Server (Terminal 1)
```bash
cd server
npm install          # First time only
npm start
```

Expected output:
```
✅ Database connected successfully
✅ Server running on port 5000
📱 API Endpoints:
   POST /api/auth/login
   GET  /api/products
   GET  /api/ai/warehouse-data
   [...]
```

### Step 2: Start the Frontend (Terminal 2)
```bash
cd client
npm install          # First time only  
npm run dev
```

Expected output:
```
  VITE v4.x.x ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

### Step 3: Login to the App
1. Open browser: `http://localhost:5173`
2. Login with your credentials
3. Wait for dashboard to load

### Step 4: Open AI Assistant
1. **Look bottom-right corner** for blue robot button 🤖
2. **Click the robot** to expand widget
3. **Type a question** in Vietnamese or English

### Step 5: Ask AI Questions
Copy-paste one of these to test:

```
"Tồn thấp sp nào?"
```
Expected: Shows products with stock < 50 items

```
"Đơn NCC nào đang chờ?"
```
Expected: Shows pending inbound orders

```
"Doanh thu tuần này?"
```
Expected: Shows weekly/monthly sales

```
"NCC nào tốt?"
```
Expected: Shows supplier rankings

```
"Sắp xếp kho?"
```
Expected: Shows storage optimization tips

---

## 🚀 If It's Not Working

### No Robot Button?
```
❌ Problem: Widget not showing
✅ Solution:
   1. Open DevTools: Press F12
   2. Check Console for errors
   3. Refresh page: F5
   4. Clear cache: Ctrl+Shift+Delete
```

### Button Visible But Won't Open?
```
❌ Problem: Click robot but nothing happens
✅ Solution:
   1. Check DevTools Network tab
   2. Look for failed /api/ai/warehouse-data requests
   3. Verify server is running on port 5000
   4. Check browser console for errors
```

### AI Returns Error Message?
```
❌ Problem: "❌ Không thể tải dữ liệu kho"
✅ Solution:
   1. Check server console for MongoDB errors
   2. Verify MongoDB is running
   3. Ensure you're logged in (valid JWT token)
   4. Try refreshing page
```

### Still Nothing?
```
🔍 Debug Steps:
   1. In DevTools Console, run:
      localStorage.getItem('token')
      → Should show JWT token, not null
   
   2. Check server logs for connection errors
   
   3. Test API directly in browser:
      http://localhost:5000/api/ai/warehouse-data
      → Should show "Unauthorized" error (which is expected)
      → means server is running
```

---

## 📊 Create Test Data (Optional)

If you have no products/suppliers/transactions:

### Method 1: Use Seed File
```bash
# In server directory
node seed.js
```

### Method 2: Manually Add via UI
1. Go to **Sản phẩm** page
2. Click **Thêm sản phẩm**
3. Fill in:
   - Tên: "Arabica Coffee"
   - SKU: "ARIB-001"
   - Tồn kho: 25
   - Giá vốn: 50,000
   - Giá bán: 80,000
   - Đơn vị: kg

4. Add 5-10 products with varying stock levels

### Method 3: MongoDB Directly
```javascript
use warehouse
db.products.insertMany([
  {
    name: "Arabica Coffee",
    sku: "ARIB-001",
    stockQuantity: 25,
    minimumStock: 50,
    costPrice: 50000,
    salePrice: 80000,
    unit: "kg",
    createdAt: new Date()
  },
  // ... more products
])
```

---

## 📋 Testing Checklist

- [ ] Backend server started (npm start in server/)
- [ ] Frontend dev server started (npm run dev in client/)
- [ ] Logged in to dashboard
- [ ] Blue robot button visible (bottom-right)
- [ ] Widget expands on click
- [ ] Can type in input field
- [ ] Send button works
- [ ] Receives AI response within 2-3 seconds
- [ ] Response contains relevant data
- [ ] Can minimize/expand widget
- [ ] Can close widget (X button)

---

## 🎓 Understanding the UI

### Widget Layout
```
┌─ HEADER (Blue gradient) ──────────┐
│ 🤖 AI Assistant 24/7   [-] [X]   │
├───────────────────────────────────┤
│                                   │
│  You:                            │
│  ┌─────────────────────────────┐ │
│  │ Tồn thấp sp nào? (blue)     │ │
│  └─────────────────────────────┘ │
│                                   │
│  AI (gray, left side):           │
│  ┌─────────────────────────────┐ │
│  │ ⚠️ SẢN PHẨM TỒN THẤP        │ │
│  │                             │ │
│  │ 1. Arabica Coffee           │ │
│  │    📦 Tồn: 25 cái           │ │
│  │    💰 Giá trị: 1.2M VNĐ    │ │
│  └─────────────────────────────┘ │
│                                   │
├─ INPUT AREA ─────────────────────┤
│ [Hỏi gì đó...          ] [Send]  │
└───────────────────────────────────┘
```

### Button States

**Closed (default):**
- Blue circle with robot icon
- Floats on bottom-right
- 60x60px size

**Open:**
- Widget expands above button
- 380x500px chat window
- 60x60px button acts as close button (red)

**Minimized:**
- Shows only header bar
- 380x60px
- Saves screen space

---

## 💬 Example Conversations

### Conversation 1: Inventory Check
```
User: "Sp nào tồn ít vậy?"
AI: [Shows 5 low-stock products with values]

User: "Arabica bao nhiêu cái?"
AI: [Shows Arabica details]

User: "NCC nào bán Arabica?"
AI: [Shows supplier contact info]
```

### Conversation 2: Business Analysis
```
User: "Kinh doanh tuần này thế nào?"
AI: [Shows weekly revenue: 120M VNĐ]

User: "Tăng hay giảm so tuần trước?"
AI: [Shows ⬆️ Tăng 25%]

User: "Sp nào bán chạy?"
AI: [Shows top 5 products by sales]
```

### Conversation 3: Order Management
```
User: "Mấy đơn hàng còn chờ?"
AI: [Shows 3 pending POs]

User: "Tổng tiền?"
AI: [Calculates from all pending orders]

User: "Đặt từ NCC nào?"
AI: [Shows supplier breakdown]
```

---

## 🔧 Tips & Tricks

### Speed Up Responses
- Use shorter questions
- Use Vietnamese for better AI understanding
- Ask specific questions (not "everything")

### Save Screen Space
- Click minimize button (down arrow) to hide chat
- Widget stays in minimized state

### Refresh Data
- Close widget (X button)
- Reopen widget
- New data fetches automatically

### Check Connection
- Open DevTools (F12)
- Go to Network tab
- Send an AI query
- Look for /api/ai/* request
- Should see 200 OK status

---

## 📞 Common Questions

**Q: Can I use it on mobile?**  
A: Widget works but may overlap on small screens. For full experience, use desktop.

**Q: Does it save chat history?**  
A: Currently, chat history is session-only. Refresh page = history lost.  
Enhancement for persistence coming soon.

**Q: Is it real AI like ChatGPT?**  
A: No, it's "smart pattern matching" AI. It understands keywords and returns relevant data from your warehouse.  
Could be upgraded to use real LLM in future.

**Q: Can admins only see this?**  
A: Currently, everyone with login can see it (except vendors if restricted in RBAC settings).  
Can be configured in future.

**Q: Does it work offline?**  
A: No, requires internet and server connection.

---

## 🎬 Live Demo Script

Try this sequence to see widget in action (2 minutes):

### Demo Step 1 (30 seconds)
```
1. Point to robot button: "Here's the AI assistant"
2. Click to expand
3. Notice: Header, chat area, input field
```

### Demo Step 2 (1 minute)
```
1. Type: "Tồn thấp sp nào?"
2. Wait for response
3. Show: List of low-stock products
4. Highlight: Real data from database
```

### Demo Step 3 (30 seconds)
```
1. Type: "Doanh thu tuần này?"
2. Show: Revenue stats
3. Point out: Real-time data analysis
```

### Demo Step 4 (30 seconds)
```
1. Click minimize button
2. Show: Compact view
3. Click header to restore
4. Close widget (X button)
5. Show: Button stays visible for quick reopen
```

---

## ✅ Success Metrics

You'll know it's working when:

- ✅ Robot button visible on every page
- ✅ Widget opens smoothly (1 second animation)
- ✅ Questions answered in 1-2 seconds
- ✅ Responses show real warehouse data
- ✅ Widget can minimize/maximize
- ✅ No console errors (F12)
- ✅ API requests show 200 OK status

---

## 🚨 Emergency Reset

If something breaks:

### Option 1: Refresh Everything
```bash
# Terminal 1 (stop server)
Ctrl+C

# Terminal 2 (stop client)
Ctrl+C

# Restart
cd server && npm start
cd client && npm run dev
```

### Option 2: Full Reset
```bash
# Delete node_modules and reinstall
cd server && rm -rf node_modules && npm install && npm start
cd client && rm -rf node_modules && npm install && npm run dev
```

### Option 3: Database Reset
```bash
# Reset MongoDB (WARNING: deletes all data!)
use warehouse
db.dropDatabase()

# Reseed
node seed.js
```

---

## 📚 Next Steps

After confirming it works:

1. **Explore Full Features**
   - Try all 5 question types
   - Test with different data
   - Experiment with follow-up questions

2. **Customize (Optional)**
   - Change widget colors
   - Adjust position (top-left, etc.)
   - Modify AI responses
   - Add new query types

3. **Deploy to Production**
   - Set up environment variables
   - Configure database on production server
   - Deploy backend to hosting
   - Deploy frontend to CDN
   - Enable SSL/HTTPS

---

## 🎉 You're Ready!

**Start the servers and click that robot button!** 🤖

Questions or issues? Check the troubleshooting section above or review AI_ASSISTANT_GUIDE.md for detailed documentation.

Enjoy your AI-powered warehouse management! ✨
