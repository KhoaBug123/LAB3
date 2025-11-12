/*
  File: ProductManagement.jsx
  Thư viện sử dụng:
  - react: useState, useEffect để quản lý state và vòng đời
  - react-redux: useSelector, useDispatch để truy cập Redux store
  - react-router-dom: Link để điều hướng nội bộ
  - react-bootstrap: Container, Row, Col, Form, Button, Table, Alert, Modal để dựng UI theo Bootstrap
  Mục đích: Trang quản trị phía client cho phép thêm, xóa sản phẩm khỏi danh sách hiện tại (sử dụng Redux).
*/
import { useState, useEffect } from 'react'; // React hooks: quản lý state & lifecycle
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks: truy cập state và dispatch actions
import { Container, Row, Col, Form, Button, Table, Alert, Modal } from 'react-bootstrap'; // Thư viện UI: react-bootstrap
import { Link } from 'react-router-dom'; // Điều hướng nội bộ bằng Link
import { fetchProducts, addProduct, deleteProduct } from '../store/slices/productSlice'; // Redux actions

function ProductManagement() { // Trang quản trị: thêm/xóa sản phẩm (sử dụng Redux)
  const dispatch = useDispatch(); // Hook để dispatch Redux actions
  const { items: products } = useSelector((state) => state.products); // Lấy danh sách sản phẩm từ Redux store
  const [formData, setFormData] = useState({ // State form thêm mới
    name: '',
    description: '',
    price: '',
    currentPrice: ''
  });
  const [error, setError] = useState(null); // Thông báo lỗi form/hệ thống
  const [success, setSuccess] = useState(null); // Thông báo thành công thao tác
  const [confirmOpen, setConfirmOpen] = useState(false); // Hiện modal xác nhận
  const [pendingDeleteId, setPendingDeleteId] = useState(null); // Lưu id cần xóa

  const formatVND = (raw) => { // Chuẩn hóa tiền tệ: chỉ số và chấm ngăn cách mỗi 3 số
    if (raw == null) return '';
    const digits = String(raw).replace(/\D/g, ''); // Bỏ mọi ký tự không phải số
    if (digits.length === 0) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thêm dấu chấm mỗi 3 số từ phải sang trái
  };

  useEffect(() => { // Lấy danh sách ban đầu từ Redux store
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e) => { // Cập nhật state form theo tên trường
    const { name, value } = e.target;
    const nextValue = (name === 'price' || name === 'currentPrice') ? formatVND(value) : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const handleAddProduct = (e) => { // Xử lý thêm mới 1 sản phẩm (sử dụng Redux)
    e.preventDefault(); // Chặn reload form
    
    if (!formData.name || !formData.description || !formData.price || !formData.currentPrice) {
      setError('Please fill in all fields'); // Validate đơn giản: bắt buộc đủ trường
      return;
    }

    const maxExistingId = products.reduce((max, p) => { // Tìm id lớn nhất hiện có
      const numericId = parseInt(p.id, 10);
      return Number.isNaN(numericId) ? max : Math.max(max, numericId);
    }, 0);

    const newProduct = { // Tạo object sản phẩm mới
      id: String(maxExistingId + 1), // Sinh id mới dựa trên id lớn nhất + 1
      name: formData.name,
      description: formData.description,
      price: formatVND(formData.price), // Bảo đảm định dạng chuẩn khi lưu
      currentPrice: formatVND(formData.currentPrice), // Bảo đảm định dạng chuẩn khi lưu
      image: 'https://via.placeholder.com/200x200?text=New+Product'
    };

    dispatch(addProduct(newProduct)); // Dispatch action để thêm sản phẩm vào Redux store
    setFormData({ name: '', description: '', price: '', currentPrice: '' }); // Reset form
    setSuccess('Product added successfully!'); // Hiển thị thông báo thành công
    setError(null); // Xóa lỗi nếu có
    
    setTimeout(() => setSuccess(null), 3000); // Tự tắt thông báo sau 3s
  };

  const openDeleteConfirm = (id) => { // Mở modal xác nhận xóa
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => { // Đóng modal
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleDeleteProduct = () => { // Xác nhận xóa trong modal (sử dụng Redux)
    if (!pendingDeleteId) return;
    dispatch(deleteProduct(pendingDeleteId)); // Dispatch action để xóa sản phẩm khỏi Redux store
    setSuccess('Product deleted successfully!'); // Banner thành công
    setTimeout(() => setSuccess(null), 3000);
    closeDeleteConfirm();
  };

  return (
    <Container fluid className="py-4" style={{ minHeight: '100vh', backgroundColor: '#2b3035' }}> {/* Khung trang quản trị */}
      <div className="mb-3"> {/* Nút quay lại */}
        <Link to="/">
          <Button variant="secondary">
            ← Back to Product List
          </Button>
        </Link>
      </div>
      {/* Add Product Form */}
      <div className="text-light p-4 mb-4" style={{ backgroundColor: '#343a40', maxWidth: '1400px', margin: '0 auto' }}> {/* Khối form thêm */}
        <h2 className="text-center mb-4 py-3" style={{ backgroundColor: '#2b3035', borderRadius: '8px' }}>
          Add Product
        </h2>
        
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>} {/* Thông báo lỗi */}
        {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>} {/* Thông báo thành công */}

        <Form onSubmit={handleAddProduct}> {/* Form thêm sản phẩm */}
          <Row className="mb-3 align-items-center">
            <Col md={2} className="text-end">
              <Form.Label className="text-light mb-0">Name:</Form.Label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                size="lg"
              />
            </Col>
          </Row>

          <Row className="mb-3 align-items-center">
            <Col md={2} className="text-end">
              <Form.Label className="text-light mb-0">Description:</Form.Label>
            </Col>
            <Col md={10}>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                size="lg"
              />
            </Col>
          </Row>

          <Row className="mb-3 align-items-center">
            <Col md={2} className="text-end">
              <Form.Label className="text-light mb-0">Price:</Form.Label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter original price"
                size="lg"
              />
            </Col>
          </Row>

          <Row className="mb-4 align-items-center">
            <Col md={2} className="text-end">
              <Form.Label className="text-light mb-0">Current Price:</Form.Label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                name="currentPrice"
                value={formData.currentPrice}
                onChange={handleInputChange}
                placeholder="Enter current price"
                size="lg"
              />
            </Col>
          </Row>

          <div className="text-center"> {/* Nút submit */}
            <Button variant="primary" type="submit" size="lg" style={{ minWidth: '200px' }}>
              Add Product
            </Button>
          </div>
        </Form>
      </div>

      {/* Product List Table */}
      <div className="p-4" style={{ backgroundColor: '#ffffff', maxWidth: '1400px', margin: '0 auto' }}> {/* Bảng sản phẩm nền trắng */}
        <h2 className="text-center text-light mb-4 py-3" style={{ backgroundColor: '#2b3035', borderRadius: '8px' }}>
          Product List
        </h2>
        
        {products.length === 0 ? (
          <p className="text-center text-dark">No products found.</p>
        ) : (
          <div className="table-responsive"> {/* Bảng responsive */}
            <Table striped={true} bordered={true} hover={true} className="mb-0"> {/* Bảng nền trắng (mặc định) */}
              <thead>
                <tr style={{ backgroundColor: '#2b3035' }}>
                  <th className="text-center" style={{ width: '5%' }}>#</th>
                  <th className="text-center" style={{ width: '20%' }}>Name</th>
                  <th className="text-center" style={{ width: '35%' }}>Description</th>
                  <th className="text-center" style={{ width: '13%' }}>Price</th>
                  <th className="text-center" style={{ width: '13%' }}>Current<br/>Price</th>
                  <th className="text-center" style={{ width: '14%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}> {/* Mỗi dòng là 1 sản phẩm */}
                    <td className="text-center">{index + 1}</td> {/* STT */}
                    <td>{product.name}</td> {/* Tên */}
                    <td>{product.description}</td> {/* Mô tả */}
                    <td className="text-center"> {/* Giá gốc */}
                      <span className="text-decoration-line-through">
                        {product.price} đ
                      </span>
                    </td>
                    <td className="text-center"> {/* Giá hiện tại */}
                      <span style={{ color: '#000000' }}>
                        {product.currentPrice} đ
                      </span>
                    </td>
                    <td className="text-center"> {/* Hành động */}
                      <div className="d-flex flex-column gap-2 align-items-center">
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => openDeleteConfirm(product.id)}
                          style={{ minWidth: '80px' }}
                        >
                          Delete
                        </Button>
                        <Link to={`/edit/${product.id}`}>
                          <Button 
                            variant="warning" 
                            size="sm"
                            style={{ minWidth: '80px', color: '#000' }}
                          >
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      <Modal show={confirmOpen} onHide={closeDeleteConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteConfirm}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteProduct}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductManagement; // Xuất component cho router
