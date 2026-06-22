import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?search=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-warning" to="/">
          <i className="bi bi-cpu-fill me-2"></i>CircuitBay
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
          </ul>

          <form className="d-flex mx-auto col-lg-5 col-12 my-2 my-lg-0" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search products..."
                aria-label="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="btn btn-warning" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link position-relative me-3" to="/cart">
                <i className="bi bi-cart3 fs-5 text-light"></i>
                {cartItemsCount > 0 && (
                  <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </li>

            {userInfo ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle btn btn-outline-warning text-dark bg-warning px-3 py-1 mt-2 mt-lg-0"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-user me-1"></i>{userInfo.name.split(' ')[0]}
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="bi bi-receipt me-2"></i>My Orders
                    </Link>
                  </li>
                  {userInfo.isAdmin && (
                    <li>
                      <Link className="dropdown-item fw-semibold text-danger" to="/admin">
                        <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item mt-2 mt-lg-0">
                <Link className="btn btn-warning px-4 py-1" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
