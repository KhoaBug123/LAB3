/*
  File: main.jsx
  Thư viện sử dụng:
  - react: StrictMode để phát hiện vấn đề trong dev
  - react-dom/client: createRoot để mount ứng dụng theo API React 18
  - react-redux: Provider để cung cấp Redux store cho toàn bộ ứng dụng
  - bootstrap: CSS của Bootstrap phục vụ react-bootstrap
  - index.css: CSS global của dự án
  Mục đích: Điểm vào ứng dụng, render <App /> vào phần tử #root với Redux Provider.
*/
import { StrictMode } from 'react' // Thư viện React – StrictMode giúp phát hiện vấn đề trong dev
import { createRoot } from 'react-dom/client' // API mới React 18 để mount ứng dụng
import { Provider } from 'react-redux' // Redux Provider để cung cấp store
import 'bootstrap/dist/css/bootstrap.min.css' // CSS của Bootstrap (phục vụ react-bootstrap)
import './index.css' // CSS global của dự án
import App from './App.jsx' // Component gốc của ứng dụng
import { store } from './store/index.js' // Redux store

createRoot(document.getElementById('root')).render( // Tạo root và render App vào #root
  <StrictMode> {/* Kích hoạt kiểm tra nghiêm ngặt trong phát triển */}
    <Provider store={store}> {/* Redux Provider để các component có thể truy cập store */}
      <App /> {/* Render ứng dụng */}
    </Provider>
  </StrictMode>,
)
