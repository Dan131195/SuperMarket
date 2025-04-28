import { useDispatch } from "react-redux";
import { login } from "../services/authService";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "../assets/img/logo3.png";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(false);

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password }));
      navigate("/");
    } catch (error) {
      console.error(error);
      setMessage(true);
    }
  };

  useEffect(() => {
    document.title = "SpeedMarket - Login";
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center login h-100">
      <div className="loginCard p-4 rounded-3">
        <div
          className=" bg-transparent p-3 w-100"
          style={{ maxWidth: "400px" }}
        >
          <h3 className="text-center mb-4">
            Accedi a <img src={logoImg} alt="Logo SpeedMarket" width={100} />
          </h3>

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

            {message && (
              <p className="text-danger text-center">Credenziali non valide!</p>
            )}

            <p className="text-center small">
              Non hai un account?{" "}
              <Link to="/registrazione" className="text-decoration-underline">
                Registrati
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
