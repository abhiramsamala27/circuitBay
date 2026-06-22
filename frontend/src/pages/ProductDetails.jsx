import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCartSubmit = () => {
    addToCart(product, qty);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
      navigate('/cart');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Error loading product: {error}
        </div>
        <Link to="/products" className="btn btn-outline-dark">
          <i className="bi bi-arrow-left me-2"></i>Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container py-5">
      <Link to="/products" className="btn btn-light mb-4 shadow-sm">
        <i className="bi bi-arrow-left me-2"></i>Back to Browse
      </Link>

      {addedMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Added to cart!</strong> Redirecting to your cart...
        </div>
      )}

      <div className="row g-5">
        {/* Product Image */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm overflow-hidden rounded bg-light">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid w-100 object-fit-contain"
              style={{ maxHeight: '450px' }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="col-lg-6">
          <div className="ps-lg-3">
            <span className="badge bg-secondary mb-2">{product.category}</span>
            <h1 className="fw-extrabold mb-3">{product.name}</h1>
            <hr />
            <h3 className="fw-bold text-dark mb-4">${product.price.toFixed(2)}</h3>
            <p className="text-muted fs-5 lh-base mb-4">{product.description}</p>
            <hr />

            {/* Inventory Status & Actions */}
            <div className="card shadow-sm border-0 p-4 bg-light my-4">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <span className="fw-semibold text-muted">Availability</span>
                {product.countInStock > 0 ? (
                  <span className="badge bg-success px-3 py-2 fs-6">In Stock ({product.countInStock} available)</span>
                ) : (
                  <span className="badge bg-danger px-3 py-2 fs-6">Out of Stock</span>
                )}
              </div>

              {product.countInStock > 0 && (
                <>
                  <div className="d-flex justify-content-between mb-4 align-items-center">
                    <span className="fw-semibold text-muted">Select Quantity</span>
                    <select
                      className="form-select w-50"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-warning w-100 py-3 fw-bold fs-5 shadow-sm"
                    onClick={handleAddToCartSubmit}
                  >
                    <i className="bi bi-cart-plus-fill me-2"></i>Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
