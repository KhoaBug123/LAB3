/*
  File: App.jsx
  Thư viện sử dụng:
  - react-router-dom: Router, Routes, Route để định tuyến SPA
  - CSS: App.css cho style cục bộ
  Mục đích: Khai báo router và ánh xạ các đường dẫn đến các trang chính của ứng dụng.
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Thư viện: react-router-dom – dùng Router/Routes/Route để điều hướng SPA
import ProductList from './components/ProductList'; // Import component: Trang danh sách sản phẩm
import ProductManagement from './components/ProductManagement'; // Import component: Trang quản lý (thêm/xóa) sản phẩm
import ProductDetail from './components/ProductDetail'; // Import component: Trang chi tiết sản phẩm
import ProductEdit from './components/ProductEdit'; // Import component: Trang chỉnh sửa sản phẩm
import './App.css'; // Import stylesheet cục bộ cho App

function App() { // Component gốc của ứng dụng – khai báo các route
  return (
    <Router> {/* Thư viện điều hướng client-side (SPA) */}
      <div style={{ backgroundColor: '#2b3035', minHeight: '100vh' }}> {/* Nền tối toàn trang */}
        <Routes> {/* Khai báo danh sách route */}
          <Route path="/" element={<ProductList />} /> {/* Trang chủ: danh sách sản phẩm */}
          <Route path="/management" element={<ProductManagement />} /> {/* Trang quản lý sản phẩm */}
          <Route path="/product/:id" element={<ProductDetail />} /> {/* Trang chi tiết theo id động */}
          <Route path="/edit/:id" element={<ProductEdit />} /> {/* Trang chỉnh sửa theo id động */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export mặc định để file khác có thể import App
