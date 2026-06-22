import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext);

  // Shipping Address Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const checkoutHandler = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!address || !city || !postalCode || !country) {
      setFormError('Please fill in all shipping address fields.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod: 'Cash on Delivery',
        totalPrice,
      };

      const { data } = await axios.post('/api/orders', orderData);
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        setOrderSuccess(false);
        navigate(`/orders`);
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 bg-light">
          <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
          <h2 className="fw-bold">Your Cart is Empty</h2>
          <p className="text-muted fs-5">Fill it with premium gadgets and workspace gear!</p>
          <Link to="/products" className="btn btn-warning btn-lg fw-bold px-4 mt-3">
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Shopping Cart</h1>

      {orderSuccess && (
        <div className="alert alert-success p-4 mb-4 shadow" role="alert">
          <h4 className="alert-heading fw-bold"><i className="bi bi-check-circle-fill me-2"></i>Order Placed Successfully!</h4>
          <p className="mb-0">Thank you for your purchase. We are redirecting you to your order history...</p>
        </div>
      )}

      <div className="row g-4">
        {/* Cart Items List */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="border-bottom text-muted small uppercase">
                    <th>Product</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product} className="border-bottom">
                      <td>
                        <div className="d-flex align-items-center py-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded object-fit-cover me-3"
                            style={{ width: '60px', height: '60px' }}
                          />
                          <div>
                            <Link to={`/products/${item.product}`} className="text-decoration-none text-dark fw-semibold">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="text-center fw-bold">${item.price.toFixed(2)}</td>
                      <td className="text-center">
                        <select
                          className="form-select form-select-sm mx-auto"
                          style={{ width: '80px' }}
                          value={item.qty}
                          onChange={(e) => addToCart(item, Number(e.target.value))}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm border-0"
                          onClick={() => removeFromCart(item.product)}
                        >
                          <i className="bi bi-trash3 fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping form */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h4 className="fw-bold mb-3 border-bottom pb-2">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span className="fw-semibold">${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span className="fw-semibold">
                {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Sales Tax (15% GST)</span>
              <span className="fw-semibold">${taxPrice.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5 text-dark">Order Total</span>
              <span className="fw-bold fs-5 text-dark">${totalPrice.toFixed(2)}</span>
            </div>

            {userInfo ? (
              <form onSubmit={checkoutHandler}>
                <h5 className="fw-bold mb-3 mt-4 text-secondary">Shipping Address</h5>
                {formError && (
                  <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> {formError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Street Address</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="123 Main St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">City</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Postal Code</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Country</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="USA"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 bg-white p-3 border rounded shadow-xs">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cod"
                      checked
                      readOnly
                    />
                    <label className="form-check-label fw-semibold text-dark" htmlFor="cod">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100 py-2.5 fw-bold text-dark shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    'Place Order (Cash on Delivery)'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center mt-3">
                <Link
                  to="/login?redirect=cart"
                  className="btn btn-warning w-100 py-2 fw-bold text-dark shadow-sm"
                >
                  Login to Checkout
                </Link>
                <p className="text-muted mt-2 small">You must be logged in to complete your purchase.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
