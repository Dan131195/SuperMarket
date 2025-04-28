import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Table, Alert, Spinner } from "react-bootstrap";
import icon1 from "../assets/images/icon-1.png";
import icon2 from "../assets/images/icon-2.png";
import icon3 from "../assets/images/icon-3.png";
import icon4 from "../assets/images/icon-4.png";

const Profilo = () => {
  const { token } = useSelector((state) => state.auth);

  const [cliente, setCliente] = useState(null);
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [showClientiModal, setShowClientiModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(
    localStorage.getItem("selectedProfileIcon") || icon1
  );

  const listIconsProfile = [icon1, icon2, icon3, icon4];

  let payload = null;
  let userRole = null;
  let userId = null;

  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
      userRole =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      userId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
    } catch (error) {
      console.error("Token non valido", error);
    }
  }

  useEffect(() => {
    document.title = "SpeedMarket - Profilo";

    const fetchCliente = async () => {
      try {
        const res = await fetch(
          `https://localhost:7006/api/cliente/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Errore nel recupero dati profilo");

        const data = await res.json();
        setCliente(data);
      } catch (err) {
        console.error(err);
        setErrore("Errore caricamento profilo");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCliente();
    }
  }, [token, userId]);

  const fetchClienti = async () => {
    try {
      const res = await fetch(`https://localhost:7006/api/cliente`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Errore nel recupero clienti");

      const data = await res.json();
      setClienti(data);
      setShowClientiModal(true);
    } catch (err) {
      console.error(err);
      alert("❌ Errore caricamento lista clienti");
    }
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    localStorage.setItem("selectedProfileIcon", icon);
  };

  return (
    <div className="container py-4">
      <h2 className="text-light mb-4">Il Mio Profilo</h2>

      {loading && (
        <div className="text-center">
          <Spinner
            className="display-1"
            animation="border"
            variant="success"
            style={{ width: "7rem", height: "7rem" }}
          />
        </div>
      )}

      {errore && (
        <div className="container py-5">
          <Alert variant="danger" className="text-center">
            {errore}
          </Alert>
        </div>
      )}

      {userRole === "Admin" || userRole === "SuperAdmin" ? (
        <div className="mb-4">
          <Button variant="info" onClick={fetchClienti}>
            <i className="bi bi-people"></i> Visualizza Tutti i Clienti
          </Button>
        </div>
      ) : (
        cliente && (
          <div className="card shadow p-4">
            <div className="text-center mb-3">
              <img
                src={selectedIcon}
                alt="Icona Profilo"
                width={100}
                height={100}
                className="rounded-circle border border-2"
              />
            </div>

            <h4 className="mb-3 text-primary">
              Benvenuto {cliente.nomeCompleto.split(" ")[0]}!
            </h4>
            <p>
              <strong>Email:</strong> {cliente.email}
            </p>
            <p>
              <strong>Codice Fiscale:</strong> {cliente.codiceFiscale}
            </p>

            <div className="mb-3">
              <h5 className="text-success">Scegli la tua icona profilo:</h5>
              <div className="d-flex justify-content-center gap-3 mt-2">
                {listIconsProfile.map((icon, idx) => (
                  <img
                    key={idx}
                    src={icon}
                    alt={`Icon ${idx}`}
                    width={60}
                    height={60}
                    className={`rounded-circle border ${
                      selectedIcon === icon
                        ? "border-success border-4"
                        : "border-2"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleIconSelect(icon)}
                  />
                ))}
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <Button variant="warning">Modifica Profilo</Button>
              <Button variant="danger">Elimina Account</Button>
            </div>
          </div>
        )
      )}

      {/* Modal Lista Clienti */}
      <Modal
        show={showClientiModal}
        onHide={() => setShowClientiModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Lista Clienti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Codice Fiscale</th>
              </tr>
            </thead>
            <tbody>
              {clienti.map((c) => (
                <tr key={c.clienteId}>
                  <td>{c.nomeCompleto}</td>
                  <td>{c.email}</td>
                  <td>{c.codiceFiscale}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowClientiModal(false)}
          >
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profilo;
