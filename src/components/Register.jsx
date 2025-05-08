import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Alert, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

import logoImg from "../assets/img/logo3.png";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ruolo: "User",
    codiceFiscale: "",
  });
  const [loading, setLoading] = useState(false);
  const [messaggio, setMessaggio] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "https://supermarketstoreapi.azurewebsites.net/api/account/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la registrazione");
      }

      const data = await res.json();
      setMessaggio(
        `✅ Registrazione completata per ${data.fullName} (${data.ruolo})`
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        ruolo: "User",
        codiceFiscale: "",
      });

      await dispatch(
        login({ email: formData.email, password: formData.password })
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setMessaggio(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login py-3 ">
      <Container
        className="loginCard rounded-4 py-2"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-1">
          Registrati su <img src={logoImg} alt="Logo SpeedMarket" width={120} />
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
            <Form.Label className="">Nome</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="">Cognome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="">Password</Form.Label>
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
            <Form.Label className="">Codice Fiscale</Form.Label>
            <Form.Control
              type="text"
              name="codiceFiscale"
              value={formData.codiceFiscale}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              variant="success"
              type="submit"
              disabled={loading}
              className=" w-50"
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <span>
                  <i className="bi bi-person-fill-add"></i> Registrati
                </span>
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Register;
