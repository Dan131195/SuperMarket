/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/RegisterAdmin.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Alert, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/img/logo3.png";

const RegisterAdmin = () => {
  const token = useSelector((state) => state.auth.token);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ruolo: "Admin",
  });
  const [loading, setLoading] = useState(false);
  const [messaggio, setMessaggio] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role =
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setUserRole(role);

        if (userRole !== "SuperAdmin") {
          navigate("/*");
        }
      } catch (error) {
        console.error("Token non valido", error);
        navigate("/errore");
      }
    } else {
      navigate("/errore");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessaggio(null);

    try {
      const res = await fetch(
        "https://localhost:7006/api/account/registeradmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Errore durante la registrazione admin"
        );
      }

      const data = await res.json();
      setMessaggio(
        `✅ Registrazione Admin completata per ${data.fullName} - ${data.email} (${data.ruolo})`
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        ruolo: "Admin",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessaggio(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login py-3">
      <Container
        className="loginCard rounded-4 py-2"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-1">
          Registra un Admin su <img src={logoImg} alt="Logo" width={120} />
        </h2>

        {messaggio && (
          <Alert
            variant={messaggio.startsWith("✅") ? "success" : "danger"}
            className="text-center"
          >
            {messaggio}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="m-2 p-2">
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ruolo</Form.Label>
            <Form.Select
              name="ruolo"
              value={formData.ruolo}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-50"
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <span>
                  <i className="bi bi-person-fill-add"></i> Crea Admin
                </span>
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default RegisterAdmin;
