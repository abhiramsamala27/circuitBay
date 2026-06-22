import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  // Form states for Add/Edit product
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoadingProducts(false);
    } catch (err) {
      console.error(err);
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
      setLoadingOrders(false);
    } catch (err) {
      console.error(err);
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setProductId('');
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setCategory('Electronics');
    setCountInStock('');
    setFormError('');
    setFormSuccess('');
  };

  const editButtonHandler = (product) => {
    setIsEditing(true);
    setShowForm(true);
    setProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name || !price || !description || !image || !category || countInStock === '') {
      setFormError('All fields are required.');
      return;
    }

    const productPayload = {
      name,
      price: Number(price),
      description,
      image,
      category,
      countInStock: Number(countInStock),
    };

    try {
      if (isEditing) {
        await axios.put(`/api/products/${productId}`, productPayload);
        setFormSuccess('Product updated successfully!');
      } else {
        await axios.post('/api/products', productPayload);
        setFormSuccess('Product created successfully!');
      }
      
      resetForm();
      fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 className="fw-bold mb-0">Admin Dashboard</h1>
        {!showForm && activeTab === 'products' && (
          <button
            className="btn btn-warning fw-bold mt-2 mt-sm-0"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <i className="bi bi-plus-lg me-1"></i>Add New Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold border-0 py-2.5 px-4 ${activeTab === 'products' ? 'active text-warning bg-dark rounded-top' : 'text-dark'}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="bi bi-boxes me-2"></i>Inventory
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold border-0 py-2.5 px-4 ${activeTab === 'orders' ? 'active text-warning bg-dark rounded-top' : 'text-dark'}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-receipt me-2"></i>Store Orders
          </button>
        </li>
      </ul>

      {/* Form Section */}
      {showForm && activeTab === 'products' && (
        <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold mb-0 text-secondary">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button className="btn btn-close" onClick={resetForm}></button>
          </div>

          {formError && (
            <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mechanical Keyboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 89.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">Count In Stock</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 15"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Product Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="e.g. https://images.unsplash.com/... or /images/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Product specifications and layout details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-warning fw-bold text-dark px-4 shadow-sm">
                  {isEditing ? 'Save Product' : 'Create Product'}
                </button>
                <button type="button" className="btn btn-outline-secondary px-4" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'products' ? (
        <div className="card shadow-sm border-0 bg-light p-4">
          <h3 className="fw-bold mb-3 text-secondary">Catalog Inventory</h3>
          {loadingProducts ? (
            <div className="text-center my-4">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted">No products found in the database. Seed database or create some.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th className="text-center">Stock</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded object-fit-cover"
                          style={{ width: '40px', height: '40px' }}
                        />
                      </td>
                      <td className="fw-semibold text-truncate" style={{ maxWidth: '250px' }}>
                        {product.name}
                      </td>
                      <td className="fw-bold">${product.price.toFixed(2)}</td>
                      <td>
                        <span className="badge bg-secondary">{product.category}</span>
                      </td>
                      <td className="text-center">
                        <span className={`fw-bold ${product.countInStock > 0 ? 'text-success' : 'text-danger'}`}>
                          {product.countInStock}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-dark btn-sm me-2"
                          onClick={() => editButtonHandler(product)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteHandler(product._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="card shadow-sm border-0 bg-light p-4">
          <h3 className="fw-bold mb-3 text-secondary">All Customer Orders</h3>
          {loadingOrders ? (
            <div className="text-center my-4">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted">No orders placed on the system yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th className="text-center">Paid</th>
                    <th className="text-center">Delivered</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-monospace text-secondary small">{order._id}</span>
                      </td>
                      <td>{order.user ? order.user.name : 'Unknown User'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">${order.totalPrice.toFixed(2)}</td>
                      <td className="text-center">
                        {order.isPaid ? (
                          <span className="badge bg-success-subtle text-success py-1.5 px-3">
                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger py-1.5 px-3">Pending</span>
                        )}
                      </td>
                      <td className="text-center">
                        {order.isDelivered ? (
                          <span className="badge bg-success-subtle text-success py-1.5 px-3">
                            Delivered
                          </span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning-emphasis py-1.5 px-3">Processing</span>
                        )}
                      </td>
                      <td className="text-end">
                        <Link to={`/orders/${order._id}`} className="btn btn-outline-dark btn-sm">
                          Details / Fulfil
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
