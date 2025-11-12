/*
  File: ProductDetail.jsx
  Thư viện sử dụng:
  - react: useEffect để quản lý vòng đời
  - react-redux: useSelector, useDispatch để truy cập Redux store
  - react-router-dom: useParams, useNavigate để lấy id từ URL và điều hướng
  - react-bootstrap: Container, Card, Button, Spinner, Alert để dựng UI theo Bootstrap
  Mục đích: Hiển thị trang chi tiết một sản phẩm theo id, tính % giảm giá, và điều hướng giữa các trang (sử dụng Redux).
*/
import { useEffect } from 'react'; // React hooks: quản lý effect
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks: truy cập state và dispatch actions
import { useParams, useNavigate } from 'react-router-dom'; // Lấy tham số URL và điều hướng trang
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap'; // UI components từ react-bootstrap
import { fetchProducts } from '../store/slices/productSlice'; // Redux action để fetch products

function ProductDetail() { // Trang chi tiết sản phẩm theo id (sử dụng Redux)
  const { id } = useParams(); // Lấy id động từ URL
  const navigate = useNavigate(); // Dùng để chuyển trang bằng code
  const dispatch = useDispatch(); // Hook để dispatch Redux actions
  const { items: products, loading, error } = useSelector((state) => state.products); // Lấy products, loading, error từ Redux store

  // Lấy danh sách products từ Redux store và tìm sản phẩm theo id
  useEffect(() => { // Gọi khi mount hoặc khi id thay đổi
    if (products.length === 0) {
      dispatch(fetchProducts()); // Nếu chưa có products trong store, fetch từ API
    }
  }, [dispatch, products.length]);

  const product = products.find(p => p.id === id); // Tìm sản phẩm theo id từ Redux store

  const calculateDiscount = () => { // Tính % giảm giá dựa trên giá gốc và giá hiện tại
    if (!product) return 0; // Chưa có sản phẩm thì trả 0
    const originalPrice = parseFloat(product.price.replace(/\./g, '')); // Bỏ dấu chấm, parse số
    const currentPrice = parseFloat(product.currentPrice.replace(/\./g, '')); // Bỏ dấu chấm, parse số
    const discount = ((originalPrice - currentPrice) / originalPrice * 100).toFixed(0); // Tính % và làm tròn 0 chữ số
    return discount; // Trả về chuỗi phần trăm
  };

  if (loading) { // Hiển thị spinner khi đang tải dữ liệu
    return (
      <Container className="text-center mt-5" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}>
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error || (!loading && !product)) { // Nếu có lỗi hoặc không tìm thấy dữ liệu sau khi đã load xong
    return (
      <Container className="mt-5" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}>
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error || 'Product not found'}</p>
          <Button variant="outline-danger" onClick={() => navigate('/')}> {/* Quay về danh sách */}
            Back to Product List
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}> {/* Layout tổng của trang chi tiết */}
      <Card className="shadow-lg mx-auto" style={{ maxWidth: '900px', backgroundColor: '#343a40', color: 'white' }}> {/* Khung nội dung */}
        <Card.Header className="text-center" style={{ backgroundColor: '#2b3035', padding: '20px' }}> {/* Tiêu đề */}
          <h2 className="mb-0">{product.name}</h2>
        </Card.Header>
        <Card.Body className="p-5"> {/* Nội dung chính */}
          <div className="text-center mb-4"> {/* Ảnh sản phẩm */}
            <img 
              src={product.image}
              alt={product.name}
              style={{ 
                maxWidth: '400px', 
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; // Ảnh fallback nếu lỗi
              }}
            />
          </div>
          
          <div className="mb-4"> {/* Mô tả chi tiết */}
            <p className="lead" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              {product.description}
            </p>
          </div>

          <div className="mb-3"> {/* Giá gốc */}
            <h4>Price: <span className="text-decoration-line-through text-muted">{product.price} đ</span></h4>
          </div>

          <div className="mb-3"> {/* Giá hiện tại */}
            <h4>Current Price: <span className="text-warning fw-bold" style={{ fontSize: '1.5rem' }}>{product.currentPrice} đ</span></h4>
          </div>

          <div className="mb-4"> {/* Tỉ lệ giảm */}
            <h4>Discount: <span className="text-success">{calculateDiscount()} %</span></h4>
          </div>

          <div className="d-flex gap-3 justify-content-center"> {/* Các nút điều hướng */}
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/')}
              style={{ minWidth: '150px' }}
            >
              Back Home
            </Button>
            <Button 
              variant="danger" 
              size="lg"
              onClick={() => navigate(`/edit/${product.id}`)}
              style={{ minWidth: '150px' }}
            >
              Edit
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetail; // Xuất mặc định để dùng trong router
