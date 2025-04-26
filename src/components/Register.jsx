import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { register } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ruolo: "User",
    codiceFiscale: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registrazione effettuata con successo");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Registrazione fallita");
    }
  };

  useEffect(() => {
    document.title = "SpeedMarket - Registrati";
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center register my-2">
      <div className="card shadow p-4 w-100 " style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Registrati su SpeedMarket</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Cognome</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
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

          <div className="mb-3">
            <label className="form-label">Ruolo</label>
            <select
              className="form-select"
              name="ruolo"
              value={form.ruolo}
              onChange={handleChange}
              required
            >
              <option value="User">User</option>
              <option value="Seller">Seller</option>
            </select>
          </div>

          {form.ruolo === "User" && (
            <div className="mb-3">
              <label className="form-label">Codice Fiscale</label>
              <input
                type="text"
                className="form-control"
                name="codiceFiscale"
                value={form.codiceFiscale}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-success">
              <i className="bi bi-person-plus me-2"></i> Registrati
            </button>
          </div>

          <p className="text-center small">
            Hai già un account? <a href="/login">Accedi</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
