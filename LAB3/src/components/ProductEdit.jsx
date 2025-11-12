/*
  File: ProductEdit.jsx
  Thư viện sử dụng:
  - react: useState, useEffect để quản lý state và vòng đời
  - react-redux: useSelector, useDispatch để truy cập Redux store
  - react-router-dom: useParams, useNavigate để lấy id từ URL và điều hướng
  - react-bootstrap: Container, Card, Form, Button, Row, Col, Spinner, Alert, Modal để dựng UI theo Bootstrap
  Mục đích: Hiển thị trang chỉnh sửa thông tin một sản phẩm, xác nhận trước khi lưu (sử dụng Redux).
*/
import { useState, useEffect } from 'react'; // React hooks: state, effect
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks: truy cập state và dispatch actions
import { useParams, useNavigate } from 'react-router-dom'; // Lấy id từ URL và điều hướng
import { Container, Card, Form, Button, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap'; // UI từ react-bootstrap
import { fetchProducts, updateProduct } from '../store/slices/productSlice'; // Redux actions

function ProductEdit() { // Trang chỉnh sửa thông tin sản phẩm (sử dụng Redux)
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi lưu
  const dispatch = useDispatch(); // Hook để dispatch Redux actions
  const { items: products, loading, error } = useSelector((state) => state.products); // Lấy products, loading, error từ Redux store
  const [formData, setFormData] = useState({ // State dữ liệu form
    name: '',
    description: '',
    price: '',
    currentPrice: ''
  });
  const [success, setSuccess] = useState(null); // Thông báo thành công
  const [confirmOpen, setConfirmOpen] = useState(false); // Modal xác nhận lưu
  
  const formatVND = (raw) => { // Chuẩn hóa tiền tệ: chỉ số và chấm ngăn cách mỗi 3 số
    if (raw == null) return '';
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length === 0) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Lấy dữ liệu sản phẩm để điền vào form từ Redux store
  useEffect(() => { // Gọi khi mount hoặc khi id/products thay đổi
    if (products.length === 0) {
      dispatch(fetchProducts()); // Nếu chưa có products trong store, fetch từ API
    } else {
      const foundProduct = products.find(p => p.id === id); // Tìm sản phẩm theo id
      if (foundProduct) {
        setFormData({ // Đổ dữ liệu vào form
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price,
          currentPrice: foundProduct.currentPrice
        });
      }
    }
  }, [dispatch, id, products]);

  const handleInputChange = (e) => { // Cập nhật state theo trường form đang thay đổi
    const { name, value } = e.target;
    const nextValue = (name === 'price' || name === 'currentPrice') ? formatVND(value) : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const handleSubmit = (e) => { // Xử lý lưu form (sử dụng Redux)
    e.preventDefault(); // Ngăn reload
    
    if (!formData.name || !formData.description || !formData.price || !formData.currentPrice) {
      alert('Please fill in all fields'); // Kiểm tra bắt buộc
      return;
    }

    // Mở modal xác nhận trước khi lưu
    setConfirmOpen(true);
  };

  const closeConfirm = () => setConfirmOpen(false);

  const confirmSave = () => { // Người dùng xác nhận lưu (sử dụng Redux)
    // Cập nhật sản phẩm trong Redux store
    dispatch(updateProduct({
      id: id,
      name: formData.name,
      description: formData.description,
      price: formatVND(formData.price),
      currentPrice: formatVND(formData.currentPrice)
    }));
    setSuccess('Product updated successfully!');
    setConfirmOpen(false);
    setTimeout(() => {
      navigate(`/product/${id}`);
    }, 1200);
  };

  if (loading) { // Đang tải dữ liệu: hiển thị spinner toàn trang
    return (
      <Container className="text-center mt-5" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}>
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Loading product...</p>
      </Container>
    );
  }

  const foundProduct = products.find(p => p.id === id);
  
  if (error || (!loading && !foundProduct)) { // Có lỗi hoặc không tìm thấy sản phẩm: hiển thị cảnh báo và nút quay lại
    return (
      <Container className="mt-5" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}>
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error || 'Product not found'}</p>
          <Button variant="outline-danger" onClick={() => navigate('/')}>
            Back to Product List
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}> {/* Bố cục trang chỉnh sửa */}
      <Card className="shadow-lg mx-auto" style={{ maxWidth: '800px', backgroundColor: '#343a40', color: 'white' }}> {/* Khung form */}
        <Card.Header className="text-center" style={{ backgroundColor: '#2b3035', padding: '20px' }}> {/* Tiêu đề */}
          <h2 className="mb-0">Edit Product</h2>
        </Card.Header>
        <Card.Body className="p-5"> {/* Thân form */}
          {success && (
            <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
              {success}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}> {/* Submit sẽ gọi handleSubmit */}
            <Form.Group className="mb-4"> {/* Trường Name */}
              <Form.Label className="text-light fw-bold">Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                size="lg"
                style={{ backgroundColor: 'white', color: 'black' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-4"> {/* Trường Description */}
              <Form.Label className="text-light fw-bold">Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                size="lg"
                style={{ backgroundColor: 'white', color: 'black' }}
              />
            </Form.Group>
            
            <Row className="mb-4"> {/* Hàng gồm Price và Current Price */}
              <Col md={6}> {/* Price */}
                <Form.Group>
                  <Form.Label className="text-light fw-bold">Price:</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    size="lg"
                    style={{ backgroundColor: 'white', color: 'black' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}> {/* Current Price */}
                <Form.Group>
                  <Form.Label className="text-light fw-bold">Current Price:</Form.Label>
                  <Form.Control
                    type="text"
                    name="currentPrice"
                    value={formData.currentPrice}
                    onChange={handleInputChange}
                    size="lg"
                    style={{ backgroundColor: 'white', color: 'black' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex gap-3 justify-content-center mt-4"> {/* Nút hành động */}
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
                type="submit"
                size="lg"
                style={{ minWidth: '150px' }}
              >
                Save Product
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {/* Modal xác nhận lưu thay đổi */}
      <Modal show={confirmOpen} onHide={closeConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save these changes?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirm}>Cancel</Button>
          <Button variant="danger" onClick={confirmSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductEdit; // Xuất component để router sử dụng
