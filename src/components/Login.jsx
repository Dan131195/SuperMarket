import { useDispatch } from "react-redux";
import { login } from "../services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password }));
      alert("Login effettuato!");
      navigate("/");
    } catch (error) {
      alert("Login fallito: " + error.message);
    }
  };

  useEffect(() => {
    document.title = "SpeedMarket - Login";
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center login h-100">
      <div className="loginForm">
        <div
          className="card shadow p-4 w-100 loginCard"
          style={{ maxWidth: "400px" }}
        >
          <h3 className="text-center mb-4">Accedi a SpeedMarket</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="esempio@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash" />
                  ) : (
                    <i className="bi bi-eye" />
                  )}
                </button>
              </div>
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-success">
                <i className="bi bi-box-arrow-in-right me-2"></i> Login
              </button>
            </div>

            <p className="text-center small">
              Non hai un account? <a href="/register">Registrati</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
