/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Table,
  Spinner,
  Alert,
  Form,
  Badge,
  Modal,
  Image,
  ListGroup,
} from "react-bootstrap";

const StoricoOrdiniLista = () => {
  const { token } = useSelector((state) => state.auth);
  const [ordini, setOrdini] = useState([]);
  const [ordiniFiltrati, setOrdiniFiltrati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroStato, setFiltroStato] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [ordineSelezionato, setOrdineSelezionato] = useState(null);

  let payload = null;
  let userRole = null;

  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
      userRole =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
      console.error("Token non valido", error);
    }
  }

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
        return "secondary";
    }
  };

  useEffect(() => {
    const fetchOrdini = async () => {
      try {
        const res = await fetch(
          `https://supermarketstoreapi.azurewebsites.net/api/ordine/storico`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Errore recupero ordini");

        const data = await res.json();
        setOrdini(data);
        setOrdiniFiltrati(data);
      } catch (err) {
        console.error(err);
        setErrore("Errore caricamento ordini");
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "Admin" || userRole === "SuperAdmin") {
      fetchOrdini();
    }
  }, [token, userRole]);

  const handleCambiaStato = async (ordineId, nuovoStatoId) => {
    const conferma = window.confirm(
      `Sei sicuro di voler cambiare lo stato dell'ordine ${ordineId}?`
    );
    if (!conferma) return;

    try {
      const res = await fetch(
        `https://supermarketstoreapi.azurewebsites.net/api/ordine/${ordineId}/stato`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statoOrdineId: nuovoStatoId }),
        }
      );

      if (!res.ok) throw new Error("Errore cambio stato");

      alert("✅ Stato aggiornato");
      const updatedRes = await fetch(
        `https://supermarketstoreapi.azurewebsites.net/api/ordine/storico`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedData = await updatedRes.json();
      setOrdini(updatedData);
      setOrdiniFiltrati(updatedData);
    } catch (err) {
      console.error(err);
      alert("❌ Errore cambio stato ordine");
    }
  };

  const handleFiltro = () => {
    let filtrati = [...ordini];

    if (filtroEmail) {
      filtrati = filtrati.filter((o) =>
        o.userEmail?.toLowerCase().includes(filtroEmail.toLowerCase())
      );
    }

    if (filtroStato) {
      filtrati = filtrati.filter((o) =>
        o.stato?.toLowerCase().includes(filtroStato.toLowerCase())
      );
    }

    setOrdiniFiltrati(filtrati);
  };

  const handleVisualizzaDettagli = (ordine) => {
    setOrdineSelezionato(ordine);
    setShowModal(true);
  };

  useEffect(() => {
    handleFiltro();
  }, [filtroEmail, filtroStato, ordini]);

  const handlePrint = () => {
    const printContent = document.getElementById("printable-area");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const aggiungiOre = (data, ore) => {
    const nuovaData = new Date(data);
    nuovaData.setHours(nuovaData.getHours() + ore);
    return nuovaData;
  };

  return (
    <div className="container text-light mt-4">
      <h2>Lista Ordini (Admin)</h2>

      <div className="mb-3 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Filtra per email cliente"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Filtra per stato ordine"
          value={filtroStato}
          onChange={(e) => setFiltroStato(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="success" />
        </div>
      ) : errore ? (
        <Alert variant="danger" className="mt-4">
          {errore}
        </Alert>
      ) : (
        <Table
          striped
          bordered
          hover
          variant="dark"
          responsive
          className="mt-3"
        >
          <thead>
            <tr>
              <th>Ordine ID</th>
              <th className="d-none d-lg-table-cell">Utente (Email)</th>
              <th className="d-none d-lg-table-cell">Data</th>
              <th className="d-none d-lg-table-cell">Totale</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {ordiniFiltrati.map((ordine) => (
              <tr key={ordine.ordineId}>
                <td>{ordine.ordineId}</td>
                <td className="d-none d-lg-table-cell">
                  {ordine.userEmail || ordine.userId}
                </td>
                <td className="d-none d-lg-table-cell">
                  {aggiungiOre(ordine.dataOrdine, 2).toLocaleString()}
                </td>
                <td className="d-none d-lg-table-cell">
                  € {ordine.totale.toFixed(2)}
                </td>
                <td>
                  <Badge bg={getBadgeColor(ordine.stato)}>{ordine.stato}</Badge>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    onChange={(e) =>
                      handleCambiaStato(
                        ordine.ordineId,
                        parseInt(e.target.value)
                      )
                    }
                  >
                    <option value="">Cambia stato</option>
                    <option value="1">In Preparazione</option>
                    <option value="2">Pronto</option>
                    <option value="3">Ritirato</option>
                    <option value="4">Annullato</option>
                  </Form.Select>
                  <Button
                    variant="info"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleVisualizzaDettagli(ordine)}
                  >
                    Dettagli
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* MODALE DETTAGLI ORDINE */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Dettagli Ordine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="printable-area">
            {ordineSelezionato ? (
              <>
                <p>
                  <strong>Ordine ID:</strong> {ordineSelezionato.ordineId}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(ordineSelezionato.dataOrdine).toLocaleDateString()}
                </p>
                <p>
                  <strong>Ritiro:</strong>{" "}
                  {aggiungiOre(
                    ordineSelezionato.dataOrdine,
                    3
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Totale:</strong> €{" "}
                  {ordineSelezionato.totale.toFixed(2)}
                </p>
                <ListGroup variant="flush">
                  {ordineSelezionato.prodotti.map((prodotto, idx) => (
                    <ListGroup.Item
                      key={idx}
                      className="d-flex align-items-center"
                    >
                      <Image
                        src={`https://supermarketstoreapi.azurewebsites.net${prodotto.immagineProdotto}`}
                        alt={prodotto.nomeProdotto}
                        rounded
                        width={60}
                        height={60}
                        className="me-3"
                      />
                      <div>
                        <div>
                          <strong>{prodotto.nomeProdotto}</strong>
                        </div>
                        <div>Quantità: {prodotto.quantita}</div>
                        <div>
                          Prezzo unitario: €{" "}
                          {prodotto.prezzoUnitario.toFixed(2)}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            ) : (
              <p>Nessun dettaglio disponibile.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={() => handlePrint()}>
            Stampa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoricoOrdiniLista;
