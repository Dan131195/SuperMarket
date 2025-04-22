import { useDispatch } from "react-redux";
import { login } from "../services/authService";
import { useState } from "react";

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password }));
      alert("Login effettuato!");
    } catch (error) {
      alert("Login fallito: " + error.message);
    }
  };

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
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
