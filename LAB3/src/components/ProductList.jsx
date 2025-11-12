/*
  File: ProductList.jsx
  Thư viện sử dụng:
  - react: useEffect để quản lý vòng đời
  - react-redux: useSelector, useDispatch để truy cập Redux store
  - react-router-dom: Link để điều hướng nội bộ giữa các trang
  - react-bootstrap: Container, Row, Col, Card, Button, Alert, Spinner để dựng UI Bootstrap
  Mục đích: Hiển thị danh sách sản phẩm dạng lưới, điều hướng đến quản lý và chi tiết (sử dụng Redux).
*/
import { useEffect } from 'react'; // Thư viện: React – useEffect quản lý side-effect
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks: truy cập state và dispatch actions
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap'; // Thư viện: react-bootstrap – UI component nhanh, đẹp
import { Link } from 'react-router-dom'; // Thư viện: react-router-dom – điều hướng bằng thẻ Link
import { fetchProducts } from '../store/slices/productSlice'; // Redux action để fetch products

function ProductList() { // Component hiển thị danh sách sản phẩm
  const dispatch = useDispatch(); // Hook để dispatch Redux actions
  const { items: products, loading, error } = useSelector((state) => state.products); // Lấy products, loading, error từ Redux store

  useEffect(() => { // Chạy một lần khi mount: dispatch action để fetch products
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) { // Trạng thái đang tải: hiển thị Spinner
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Loading products...</p>
      </Container>
    );
  }

  if (error) { // Nếu có lỗi: hiển thị Alert
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (products.length === 0) { // Không có sản phẩm: hiển thị thông báo trống
    return (
      <Container className="text-center mt-5" style={{ minHeight: '100vh' }}>
        <div className="bg-dark text-light p-5 rounded">
          <h1 className="display-4 mb-4">Product List</h1>
          <p className="lead">No products found.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}> {/* Layout tổng */}
      <div className="position-relative mb-4"> {/* Header danh sách */}
        <h1 className="text-light mb-0 text-center">Product List</h1> {/* Tiêu đề giữa */}
        <div className="position-absolute end-0 top-0"> {/* Nút ở góc phải */}
          <Link to="/management"> {/* Điều hướng tới trang quản lý */}
            <Button variant="success" size="lg">{/* Nút thêm sản phẩm */}
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4"> {/* Lưới responsive cho card sản phẩm */}
        {products.map((product) => (
          <Col key={product.id}> {/* Cột chứa mỗi sản phẩm */}
            <Card className="h-100 shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #dc3545', borderRadius: '10px' }}> {/* Thẻ sản phẩm giống mẫu: viền đỏ, nền trắng */}
              <Card.Img 
                variant="top" 
                src={product.image} 
                alt={product.name}
                style={{ height: '200px', objectFit: 'contain', padding: '15px', backgroundColor: '#ffffff' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; // Fallback ảnh khi lỗi
                }}
              />
              <Card.Body className="d-flex flex-column"> {/* Nội dung card, dồn nút xuống cuối */}
                <Card.Title style={{ fontSize: '1rem', minHeight: '48px', color: '#dc3545', fontWeight: 600, textAlign: 'justify' }}>
                  {product.name} {/* Tên sản phẩm màu đỏ */}
                </Card.Title>
                <Card.Text style={{ fontSize: '0.85rem', minHeight: '72px', color: '#6c757d', textAlign: 'justify' }}>
                  {product.description} {/* Mô tả sản phẩm */}
                </Card.Text>
                <div className="mt-auto"> {/* Khu vực giá và nút */}
                  <div className="mb-2">
                    <span className="text-decoration-line-through text-muted me-2" style={{ fontSize: '0.95rem' }}>
                      {product.price} đ {/* Giá gốc, gạch ngang */}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="fw-bold" style={{ fontSize: '1.25rem', color: '#dc3545' }}>
                      {product.currentPrice} đ {/* Giá hiện tại, nổi bật */}
                    </span>
                  </div>
                  <Link to={`/product/${product.id}`}> {/* Link tới chi tiết sản phẩm */}
                    <Button variant="danger" className="w-100"> {/* Nút xem chi tiết */}
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList; // Xuất component để dùng ở nơi khác
