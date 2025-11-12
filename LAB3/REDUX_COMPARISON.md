# So Sánh Code Cũ vs Code Mới (Sau Khi Tích Hợp Redux)

## 📋 Tổng Quan

### **CODE CŨ (Trước Redux)**
- Quản lý state bằng `useState` trong từng component
- Mỗi component tự fetch và lưu dữ liệu vào localStorage
- State rời rạc, không có nguồn dữ liệu tập trung
- Dễ bị duplicate code (fetch logic lặp lại ở nhiều component)

### **CODE MỚI (Sau Redux)**
- Quản lý state tập trung bằng Redux store
- Tất cả components dùng chung một nguồn dữ liệu
- Logic fetch/update được tập trung trong Redux slice
- Code dễ maintain và mở rộng hơn

---

## 🔄 So Sánh Chi Tiết

### 1. **Cấu Trúc File**

#### CODE CŨ:
```
src/
├── components/
│   ├── ProductList.jsx          (dùng useState)
│   ├── ProductManagement.jsx     (dùng useState)
│   ├── ProductDetail.jsx         (dùng useState)
│   └── ProductEdit.jsx          (dùng useState)
├── App.jsx
└── main.jsx
```

#### CODE MỚI:
```
src/
├── store/
│   ├── index.js                  ✨ MỚI: Redux store config
│   └── slices/
│       └── productSlice.js       ✨ MỚI: Redux reducer & actions
├── components/
│   ├── ProductList.jsx           (dùng Redux)
│   ├── ProductManagement.jsx    (dùng Redux)
│   ├── ProductDetail.jsx         (dùng Redux)
│   └── ProductEdit.jsx          (dùng Redux)
├── App.jsx
└── main.jsx                      (thêm Redux Provider)
```

---

### 2. **Quản Lý State - ProductList.jsx**

#### CODE CŨ:
```javascript
// ❌ Mỗi component tự quản lý state riêng
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const STORAGE_KEY = 'products_data';

// ❌ Logic fetch lặp lại ở mỗi component
const fetchProducts = async () => {
  try {
    setLoading(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
      return;
    }
    const response = await fetch('/products.json');
    const data = await response.json();
    setProducts(data.products);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products));
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

#### CODE MỚI:
```javascript
// ✅ Dùng Redux hooks để lấy state từ store
const dispatch = useDispatch();
const { items: products, loading, error } = useSelector((state) => state.products);

// ✅ Logic fetch đã được tập trung trong Redux slice
useEffect(() => {
  dispatch(fetchProducts()); // Chỉ cần dispatch action
}, [dispatch]);
```

**Lợi ích:**
- ✅ Code ngắn gọn hơn
- ✅ Logic không bị duplicate
- ✅ State được quản lý tập trung

---

### 3. **Thêm Sản Phẩm - ProductManagement.jsx**

#### CODE CŨ:
```javascript
// ❌ Tự thao tác với state và localStorage
const handleAddProduct = (e) => {
  e.preventDefault();
  // ... validation ...
  
  const newProduct = { /* ... */ };
  const updatedProducts = [...products, newProduct];
  
  setProducts(updatedProducts);                    // ❌ Update local state
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts)); // ❌ Sync localStorage
  setFormData({ name: '', description: '', price: '', currentPrice: '' });
};
```

#### CODE MỚI:
```javascript
// ✅ Dispatch action, Redux tự động xử lý
const handleAddProduct = (e) => {
  e.preventDefault();
  // ... validation ...
  
  const newProduct = { /* ... */ };
  
  dispatch(addProduct(newProduct)); // ✅ Redux tự động update state + localStorage
  setFormData({ name: '', description: '', price: '', currentPrice: '' });
};
```

**Lợi ích:**
- ✅ Code đơn giản hơn
- ✅ Logic business được tập trung trong Redux slice
- ✅ Tự động sync với localStorage

---

### 4. **Xóa Sản Phẩm**

#### CODE CŨ:
```javascript
// ❌ Tự filter và update state
const handleDeleteProduct = () => {
  const filtered = products.filter(product => product.id !== pendingDeleteId);
  setProducts(filtered);                          // ❌ Update local state
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered)); // ❌ Sync localStorage
};
```

#### CODE MỚI:
```javascript
// ✅ Dispatch action đơn giản
const handleDeleteProduct = () => {
  dispatch(deleteProduct(pendingDeleteId)); // ✅ Redux tự động xử lý
};
```

---

### 5. **Cập Nhật Sản Phẩm - ProductEdit.jsx**

#### CODE CŨ:
```javascript
// ❌ Tự map và update array
const confirmSave = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const list = stored ? JSON.parse(stored) : [];
  const updated = list.map(p => p.id === id ? {
    ...p,
    name: formData.name,
    // ...
  } : p);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // ❌ Manual sync
};
```

#### CODE MỚI:
```javascript
// ✅ Dispatch action với data mới
const confirmSave = () => {
  dispatch(updateProduct({
    id: id,
    name: formData.name,
    // ...
  })); // ✅ Redux tự động update
};
```

---

### 6. **main.jsx - Setup**

#### CODE CŨ:
```javascript
// ❌ Không có Redux Provider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### CODE MỚI:
```javascript
// ✅ Wrap với Redux Provider
import { Provider } from 'react-redux';
import { store } from './store/index.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* ✨ Cung cấp store cho toàn bộ app */}
      <App />
    </Provider>
  </StrictMode>
);
```

---

## 🎯 Sự Khác Biệt Về Chức Năng

### **Về UX (User Experience):**
- ✅ **KHÔNG CÓ KHÁC BIỆT** - Người dùng vẫn thấy giao diện và chức năng giống y hệt

### **Về Kiến Trúc Code:**

| Tiêu Chí | Code Cũ | Code Mới |
|----------|---------|----------|
| **State Management** | Local state trong từng component | Centralized Redux store |
| **Data Source** | Mỗi component tự fetch | Store quản lý tập trung |
| **Code Duplication** | Logic fetch lặp lại 4 lần | Logic tập trung 1 nơi |
| **Maintainability** | Khó maintain (sửa phải sửa nhiều chỗ) | Dễ maintain (sửa 1 nơi) |
| **Scalability** | Khó mở rộng | Dễ mở rộng (thêm actions mới) |
| **Testing** | Khó test (state rời rạc) | Dễ test (test Redux logic riêng) |
| **Debugging** | Khó debug (state nằm rải rác) | Dễ debug với Redux DevTools |

---

## 📊 Ví Dụ Cụ Thể: Thêm Sản Phẩm

### **CODE CŨ - Flow:**
```
User click "Add Product"
  ↓
handleAddProduct() trong component
  ↓
Tạo newProduct object
  ↓
setProducts([...products, newProduct])  ← Update local state
  ↓
localStorage.setItem(...)                ← Manual sync localStorage
  ↓
Form reset
  ↓
Component re-render với state mới
```

### **CODE MỚI - Flow:**
```
User click "Add Product"
  ↓
handleAddProduct() trong component
  ↓
dispatch(addProduct(newProduct))        ← Dispatch action
  ↓
Redux slice reducer xử lý:
  - Update state.items
  - Sync localStorage tự động
  ↓
Tất cả components subscribe vào store tự động re-render
```

---

## 🚀 Lợi Ích Của Redux

### 1. **Single Source of Truth**
- Tất cả dữ liệu products nằm ở một nơi (Redux store)
- Không còn tình trạng state không đồng bộ giữa các components

### 2. **Predictable State Updates**
- Mọi thay đổi state đều thông qua actions
- Dễ trace và debug hơn

### 3. **Code Reusability**
- Logic fetch/update chỉ viết 1 lần trong Redux slice
- Tất cả components dùng chung logic đó

### 4. **Redux DevTools**
- Có thể debug state changes trong browser
- Time-travel debugging
- Xem lịch sử actions

### 5. **Dễ Mở Rộng**
- Thêm action mới: chỉ cần thêm vào slice
- Thêm state mới: chỉ cần update initialState
- Không cần sửa code ở nhiều components

---

## 📝 Tóm Tắt

### **Điểm Giống Nhau:**
- ✅ Giao diện người dùng giống hệt
- ✅ Chức năng hoạt động giống nhau
- ✅ Vẫn dùng localStorage để persist data

### **Điểm Khác Nhau:**
- ✅ **Code Cũ**: State rời rạc, logic duplicate, khó maintain
- ✅ **Code Mới**: State tập trung, logic tập trung, dễ maintain và mở rộng

### **Kết Luận:**
Redux không thay đổi chức năng của ứng dụng, nhưng **cải thiện đáng kể về kiến trúc code**, giúp code **dễ maintain, dễ test, và dễ mở rộng** hơn. Đây là lý do Redux được sử dụng trong các dự án lớn và phức tạp.


