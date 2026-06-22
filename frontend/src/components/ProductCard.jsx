import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow transition border-0">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          className="card-img-top object-fit-cover"
          alt={product.name}
          style={{ height: '220px' }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-secondary">{product.category}</span>
          {product.countInStock > 0 ? (
            <span className="badge bg-success-subtle text-success">In Stock</span>
          ) : (
            <span className="badge bg-danger-subtle text-danger">Out of Stock</span>
          )}
        </div>
        <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
          <h5 className="card-title fw-bold text-truncate mb-2" title={product.name}>
            {product.name}
          </h5>
        </Link>
        <p className="card-text text-muted small text-truncate-2-lines mb-3" style={{ height: '40px', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5 fw-bold text-dark">${product.price.toFixed(2)}</span>
            <div className="btn-group btn-group-sm">
              <Link to={`/products/${product._id}`} className="btn btn-outline-dark">
                Details
              </Link>
              {product.countInStock > 0 && (
                <button className="btn btn-warning" onClick={handleAddToCart}>
                  <i className="bi bi-cart-plus me-1"></i>Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
