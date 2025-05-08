/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ListaProfili = () => {
  const [clienti, setClienti] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(false);

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const fetchClienti = async () => {
    setLoading(true);
    setErrore(false);

    let payload = null;
    let userRole = null;

    if (token) {
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
        userRole =
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
      } catch (error) {
        console.error("Token non valido", error);
      }
    }
    const userId = payload
      ? payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      : null;

    if (userRole === "User") {
      navigate("/login");
    }
    try {
      const res = await fetch(`https://localhost:7006/api/cliente`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if (!res.ok) throw new Error("Errore nel recupero clienti");
      const data = await res.json();
      setClienti(data);
      setLoading(false);
      setErrore(false);
    } catch (err) {
      console.log(err);
      setErrore(true);
      setLoading(false);
    }
  };

  const handleViewCliente = async (userId) => {
    setErrore(false);
    try {
      const res = await fetch(`https://localhost:7006/api/cliente/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nel recupero dettagli cliente");

      const data = await res.json();
      setSelectedCliente(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setErrore(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClienti();
  }, [token]);

  return (
    <div className="mb-4">
      <h2 className="text-light text-center mb-4">Lista clienti</h2>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="success" />
        </div>
      )}

      {errore && (
        <div className="text-center">
          <Alert variant="danger">Errore nel recupero clienti..</Alert>
        </div>
      )}

      {clienti.length > 0 && (
        <div className="bg-secondary bg-opacity-75 p-2 rounded-3 listaClienti">
          <div className="row align-items-center border-bottom border-2 col-11 m-auto pt-2 speedMarket fw-bold">
            <p className="col-8">Email</p>
          </div>
          <div>
            {clienti.map((c) => (
              <div
                key={c.clienteId}
                className="row align-items-center border-bottom border-1 py-3 col-11 m-auto text-light"
              >
                <p className="col-8 m-0 ">{c.email}</p>
                <p className="col-4 text-center m-0">
                  <Button
                    className="nuovoProdottoBtn"
                    variant="success"
                    size="sm"
                    onClick={() => handleViewCliente(c.userId)}
                  >
                    Info
                  </Button>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Dettagli Cliente */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dettagli Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCliente ? (
            <div>
              <p>
                <strong>Nome:</strong> {selectedCliente.nome}
              </p>
              <p>
                <strong>Cognome:</strong> {selectedCliente.cognome}
              </p>
              <p>
                <strong>Email:</strong> {selectedCliente.email}
              </p>
              <p>
                <strong>Codice Fiscale:</strong> {selectedCliente.codiceFiscale}
              </p>
              <p>
                <strong>Indirizzo:</strong> {selectedCliente.indirizzo}
              </p>
            </div>
          ) : (
            <p>Nessun dettaglio disponibile.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaProfili;
