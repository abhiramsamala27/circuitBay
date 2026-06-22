import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Show only first 3 products as "featured"
        setProducts(data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5 mb-5 position-relative overflow-hidden" style={{ minHeight: '400px', display: 'flex', alignItems: 'center' }}>
        {/* Decorative background image overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=1600&auto=format&fit=crop&q=60')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            opacity: 0.25 
          }}
        />
        <div className="container position-relative z-1">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-4 fw-extrabold mb-3 text-warning">Welcome to CircuitBay</h1>
              <p className="lead fs-4 text-light mb-4">
                Discover the latest premium electronics and computing accessories. Handpicked quality products with fast secure shipping and cash on delivery option.
              </p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-warning btn-lg px-4 fw-bold">
                  Browse Products
                </Link>
                <a href="#categories" className="btn btn-outline-light btn-lg px-4">
                  Categories
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Categories Section */}
        <section id="categories" className="mb-5 py-3">
          <h2 className="text-center fw-bold mb-4">Shop By Category</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card text-bg-dark border-0 overflow-hidden shadow" style={{ height: '200px' }}>
                <img
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60"
                  className="card-img h-100 object-fit-cover opacity-50"
                  alt="Electronics"
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                  <h3 className="card-title fw-bold text-warning">Electronics</h3>
                  <p className="card-text">Upgrade your tech setup with curved monitors, smart fitness watches, external SSDs, and headphones.</p>
                  <Link to="/products?category=Electronics" className="btn btn-warning btn-sm align-self-start fw-bold">
                    View Electronics
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-bg-dark border-0 overflow-hidden shadow" style={{ height: '200px' }}>
                <img
                  src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60"
                  className="card-img h-100 object-fit-cover opacity-50"
                  alt="Accessories"
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                  <h3 className="card-title fw-bold text-warning">Accessories</h3>
                  <p className="card-text">Accessorize your workstation with tactical mechanical keyboards and high DPI ergonomic gaming mice.</p>
                  <Link to="/products?category=Accessories" className="btn btn-warning btn-sm align-self-start fw-bold">
                    View Accessories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-5 py-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Featured Products</h2>
            <Link to="/products" className="btn btn-outline-dark fw-semibold">
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              Error fetching products: {error}
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product._id} className="col-md-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
