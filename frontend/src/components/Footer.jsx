import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <span className="fw-semibold">CircuitBay</span> &copy; {currentYear}. Premium Electronics Store.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="text-white me-3 text-decoration-none hover-opacity">
              <i className="bi bi-facebook fs-5"></i>
            </a>
            <a href="#" className="text-white me-3 text-decoration-none hover-opacity">
              <i className="bi bi-twitter fs-5"></i>
            </a>
            <a href="#" className="text-white me-3 text-decoration-none hover-opacity">
              <i className="bi bi-instagram fs-5"></i>
            </a>
            <a href="#" className="text-white text-decoration-none hover-opacity">
              <i className="bi bi-github fs-5"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
