import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products, we will filter by category locally (or via query, but local filter is robust and fast)
        const { data } = await axios.get(`/api/products${searchQuery ? `?keyword=${searchQuery}` : ''}`);
        
        let filteredProducts = data;
        if (categoryQuery !== 'All') {
          filteredProducts = data.filter(
            (p) => p.category.toLowerCase() === categoryQuery.toLowerCase()
          );
        }

        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryQuery]);

  const handleCategorySelect = (category) => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Filter By Category</h5>
            <div className="list-group list-group-flush">
              {['All', 'Electronics', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`list-group-item list-group-item-action border-0 px-0 d-flex justify-content-between align-items-center ${
                    categoryQuery.toLowerCase() === cat.toLowerCase()
                      ? 'text-warning fw-bold'
                      : 'text-dark'
                  }`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                  {categoryQuery.toLowerCase() === cat.toLowerCase() && (
                    <i className="bi bi-check-circle-fill text-warning"></i>
                  )}
                </button>
              ))}
            </div>
            {(searchQuery || categoryQuery !== 'All') && (
              <button
                className="btn btn-outline-dark btn-sm w-100 mt-4"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Catalog */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
              <h2 className="fw-bold mb-0">Our Catalog</h2>
              {searchQuery && (
                <p className="text-muted mb-0 mt-1">
                  Search results for: <span className="fw-semibold text-dark">"{searchQuery}"</span>
                </p>
              )}
            </div>
            <span className="badge bg-dark px-3 py-2 fs-6 mt-2 mt-sm-0">
              {products.length} Products Found
            </span>
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
          ) : products.length === 0 ? (
            <div className="text-center my-5 p-5 bg-light rounded shadow-sm">
              <i className="bi bi-search-heart fs-1 text-muted mb-3"></i>
              <h3>No Products Found</h3>
              <p className="text-muted">We couldn't find any products matching your search or filters.</p>
              <button className="btn btn-warning fw-bold mt-2" onClick={handleClearFilters}>
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product._id} className="col-md-6 col-lg-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
