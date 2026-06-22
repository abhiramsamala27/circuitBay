import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

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
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 bg-light text-center">
          <i className="bi bi-receipt-cutoff fs-1 text-muted mb-3"></i>
          <h3>No Orders Found</h3>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-warning fw-bold mt-2">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="card shadow-sm border-0 bg-light p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
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
                          Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning-emphasis py-1.5 px-3">Processing</span>
                      )}
                    </td>
                    <td className="text-end">
                      <Link to={`/orders/${order._id}`} className="btn btn-outline-dark btn-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
