import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderDetails = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const deliverHandler = async () => {
    setActionLoading(true);
    try {
      await axios.put(`/api/orders/${id}/deliver`);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
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
          Error loading order: {error}
        </div>
        <Link to="/orders" className="btn btn-outline-dark">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div>
          <h1 className="fw-bold mb-1">Order Details</h1>
          <p className="text-muted mb-0">
            Order Reference: <span className="font-monospace fw-semibold text-dark">{order._id}</span>
          </p>
        </div>
        <Link to={userInfo.isAdmin ? '/admin' : '/orders'} className="btn btn-light shadow-sm mt-3 mt-sm-0">
          <i className="bi bi-arrow-left me-2"></i>Back
        </Link>
      </div>

      <div className="row g-4">
        {/* Left column details */}
        <div className="col-lg-8">
          {/* Shipping details */}
          <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
            <h4 className="fw-bold mb-3"><i className="bi bi-geo-alt-fill text-warning me-2"></i>Shipping Details</h4>
            <p className="mb-2"><strong>Name:</strong> {order.user.name}</p>
            <p className="mb-3"><strong>Email:</strong> {order.user.email}</p>
            <p className="mb-3">
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="alert alert-success py-2 mb-0" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-warning py-2 mb-0" role="alert">
                <i className="bi bi-clock-history me-2"></i>Status: In Transit / Not Delivered
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
            <h4 className="fw-bold mb-3"><i className="bi bi-credit-card-fill text-warning me-2"></i>Payment Details</h4>
            <p className="mb-3"><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="alert alert-success py-2 mb-0" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>Paid on {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-danger py-2 mb-0" role="alert">
                <i className="bi bi-cash me-2"></i>Status: Pending Payment (Pay on Delivery)
              </div>
            )}
          </div>

          {/* Ordered items list */}
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h4 className="fw-bold mb-3"><i className="bi bi-box-seam-fill text-warning me-2"></i>Items Ordered</h4>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="border-bottom text-muted small">
                    <th>Product</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item._id} className="border-bottom">
                      <td>
                        <div className="d-flex align-items-center py-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded object-fit-cover me-3"
                            style={{ width: '45px', height: '45px' }}
                          />
                          <span className="fw-semibold small">{item.name}</span>
                        </div>
                      </td>
                      <td className="text-center">${item.price.toFixed(2)}</td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-end fw-bold">${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column sidebar: Order pricing & Actions */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light mb-4">
            <h4 className="fw-bold mb-3 border-bottom pb-2">Order Billing</h4>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Items Subtotal</span>
              <span className="fw-semibold">
                ${(order.totalPrice - (order.totalPrice > 100 ? 0 : 10) - (order.totalPrice - (order.totalPrice > 100 ? 0 : 10)) / 1.15 * 0.15).toFixed(2)}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Total Amount</span>
              <span className="fw-bold fs-4 text-dark">${order.totalPrice.toFixed(2)}</span>
            </div>

            {/* Admin Marks as Delivered Action */}
            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <button
                type="button"
                className="btn btn-warning w-100 py-2.5 fw-bold text-dark mt-3 shadow-sm"
                onClick={deliverHandler}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  'Mark as Delivered'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
