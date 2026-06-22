import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, userInfo, error, setError, loading } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    // If user is already logged in, send them to the redirect path or homepage
    if (userInfo) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [userInfo, navigate, redirect]);

  // Clean context error on mount/unmount
  useEffect(() => {
    setError(null);
    return () => setError(null);
  }, [setError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Errors handled by AuthContext
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-4 overflow-hidden bg-light p-4">
            <div className="card-body">
              <h2 className="fw-bold text-center mb-4">Sign In</h2>

              {formError && (
                <div className="alert alert-danger py-2 px-3 small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {formError}
                </div>
              )}

              {error && (
                <div className="alert alert-danger py-2 px-3 small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> {error}
                </div>
              )}

              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100 py-2.5 fw-bold text-dark mb-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted small">New Customer? </span>
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : '/register'}
                  className="text-warning text-decoration-none fw-bold small hover-underline"
                >
                  Register Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
