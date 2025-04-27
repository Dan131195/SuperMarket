import { useEffect, useState } from "react";
import {
  Spinner,
  Card,
  ListGroup,
  Badge,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import emptyCart from "../assets/img/empty-cart.png";
import { Link } from "react-router-dom";

const StoricoOrdini = () => {
  const [ordini, setOrdini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ordineSelezionato, setOrdineSelezionato] = useState(null);
  const [modificaOrdineId, setModificaOrdineId] = useState(null);
  const [nuovoStatoId, setNuovoStatoId] = useState("");

  const { user, token } = useSelector((state) => state.auth);
  const userId = user?.id;
  const userRole = user?.role;
  console.log(userRole);

  useEffect(() => {
    document.title = "SpeedMarket - I miei Ordini";

    const fetchOrdini = async () => {
      try {
        const res = await fetch(
          `https://localhost:7006/api/ordine/storico/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Errore nel recupero ordini");
        const data = await res.json();
        setOrdini(data);
      } catch (err) {
        console.error(err);
        setErrore("Errore nel caricamento ordini");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrdini();
    }
  }, [userId, token]);

  const getBadgeColor = (stato) => {
    switch (stato.toLowerCase()) {
      case "in preparazione":
        return "info";
      case "pronto":
        return "success";
      case "ritirato":
        return "danger";
      case "annullato":
        return "warning";
      default:
        return "secondary"; // per qualsiasi altro stato
    }
  };

  const handleShowModal = (ordine) => {
    setOrdineSelezionato(ordine);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOrdineSelezionato(null);
  };

  // Cambia Stato Ordine SOLO per Admin / SuperAdmin
  const handleCambiaStato = (ordineId) => {
    setModificaOrdineId(ordineId);
  };

  const salvaNuovoStato = async (ordineId) => {
    if (!nuovoStatoId) return alert("Seleziona un nuovo stato!");

    try {
      const res = await fetch(
        `https://localhost:7006/api/ordine/${ordineId}/stato`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statoOrdineId: parseInt(nuovoStatoId) }),
        }
      );

      if (!res.ok) throw new Error("Errore nella modifica dello stato");

      alert("✅ Stato modificato!");
      setModificaOrdineId(null);
      setNuovoStatoId("");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Errore nel salvataggio stato");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner
          animation="border"
          variant="success"
          style={{ width: "4rem", height: "4rem" }}
        />
      </div>
    );
  }

  if (errore) {
    return (
      <div className="container py-5">
        <Alert variant="danger" className="text-center">
          {errore}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-light mb-4">I miei Ordini</h2>

      {ordini.length === 0 ? (
        <div className="text-center mt-1">
          <div className="text-center d-flex flex-column flex-md-row justify-content-center align-items-center">
            <img src={emptyCart} alt="Ordini Vuoto" className="w-50 m-auto" />
            <h4 className="text-light fw-semibold emptyCart">
              Ops, non hai ancora effettuato ordini..
            </h4>
          </div>
          <Link
            to="/prodotti"
            className="btn btn-success p-2 d-block w-50 m-auto mt-1"
          >
            Vai a Prodotti
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {ordini.map((ordine) => (
            <div className="col-12 col-md-6 col-lg-4" key={ordine.ordineId}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="d-flex justify-content-between">
                      <span>Ordine #{ordine.ordineId.substring(0, 8)}...</span>
                      <Badge bg={getBadgeColor(ordine.stato)}>
                        {ordine.stato}
                      </Badge>
                    </Card.Title>

                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(ordine.dataOrdine).toLocaleString()}
                    </Card.Subtitle>

                    <h5 className="text-success mt-2">
                      Totale: € {ordine.totale.toFixed(2)}
                    </h5>
                  </div>

                  {modificaOrdineId === ordine.ordineId ? (
                    <div className="d-flex flex-column gap-2 w-100">
                      <select
                        className="form-select"
                        value={nuovoStatoId}
                        onChange={(e) => setNuovoStatoId(e.target.value)}
                      >
                        <option value="">Seleziona stato...</option>
                        <option value="2">Pronto</option>
                        <option value="3">Consegnato</option>
                        <option value="4">Annullato</option>
                      </select>
                      <div className="d-flex gap-1 justify-content-between align-items-center">
                        <Button
                          variant="success"
                          onClick={() => salvaNuovoStato(ordine.ordineId)}
                          disabled={!nuovoStatoId}
                          className="w-50"
                        >
                          Salva
                        </Button>

                        <Button
                          variant="outline-secondary"
                          onClick={() => setModificaOrdineId(null)}
                          className="w-50"
                        >
                          Annulla
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex gap-1 justify-content-between align-items-center">
                      <Button
                        variant="outline-primary fw-bold"
                        className="w-50"
                        onClick={() => handleShowModal(ordine)}
                      >
                        Dettagli
                      </Button>

                      {userRole === "Admin" || userRole === "SuperAdmin" ? (
                        <Button
                          variant="outline-warning fw-bold"
                          className="w-50"
                          onClick={() => handleCambiaStato(ordine.ordineId)}
                        >
                          Cambia Stato
                        </Button>
                      ) : null}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dettaglio Ordine */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Dettaglio Ordine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ordineSelezionato && (
            <>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(ordineSelezionato.dataOrdine).toLocaleString()}
              </p>
              <p>
                <strong>Stato:</strong> {ordineSelezionato.stato}
              </p>

              <ListGroup variant="flush" className="mb-3">
                {ordineSelezionato.prodotti.map((prod, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={`https://localhost:7006${prod.immagineProdotto}`}
                        alt={prod.nomeProdotto}
                        style={{
                          maxWidth: "90vh",
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <div>
                        {prod.nomeProdotto} × {prod.quantita}
                      </div>
                    </div>
                    <div>
                      € {(prod.prezzoUnitario * prod.quantita).toFixed(2)}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <h5 className="text-end text-success">
                Totale: € {ordineSelezionato.totale.toFixed(2)}
              </h5>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoricoOrdini;
