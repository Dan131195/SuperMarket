import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Table, Alert, Spinner } from "react-bootstrap";
import icon1 from "../assets/images/icon-1.png";
import icon2 from "../assets/images/icon-2.png";
import icon3 from "../assets/images/icon-3.png";
import icon4 from "../assets/images/icon-4.png";
import { Link } from "react-router-dom";

const Profilo = () => {
  const { token } = useSelector((state) => state.auth);

  const [cliente, setCliente] = useState(null);
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);

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

    const fetchClienti = async () => {
      try {
        const res = await fetch(`https://localhost:7006/api/cliente`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Errore nel recupero clienti");

        const data = await res.json();
        setClienti(data);
      } catch (err) {
        console.error(err);
        alert("❌ Errore caricamento lista clienti");
      }
    };

    const fetchCliente = async () => {
      setLoading(true);
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

    if (userRole === "User" || userRole === "Seller") {
      fetchCliente();
    } else {
      fetchClienti();
    }
  }, [token, userId]);

  const handleIconSelect = (icon) => {
    // setSelectedIcon(icon);
    localStorage.setItem("selectedProfileIcon", icon);
  };

  return (
    <div className="container py-4">
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
          <h2 className="text-light mb-4">Lista profili</h2>

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
        </div>
      ) : (
        cliente && (
          <div className="container">
            <h2 className="text-light mb-4">Il Mio Profilo</h2>

            <div className="card shadow p-4">
              <h4 className="speedMarket text-center  mb-3">
                Benvenuto {cliente.nome}!
              </h4>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <p className="m-0">
                  <strong>Nome:</strong> {cliente.nome}
                </p>
                <Link>Modifica Profilo</Link>
              </div>
              <p>
                <strong>Cogome:</strong> {cliente.cognome}
              </p>
              <p>
                <strong>Codice Fiscale:</strong> {cliente.codiceFiscale}
              </p>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <p className="m-0">
                  <strong>Email:</strong> {cliente.email}
                </p>
                <Link className="modificaLink">Modifica Email</Link>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <p className="m-0">
                  <strong>Indirizzo:</strong> {cliente.indirizzo}
                </p>
                <Link className="modificaLink">Modifica Indirizzo</Link>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <p className="m-0 ">
                    <strong>Immagine profilo:</strong>
                  </p>
                  <img
                    src={
                      cliente.immagineProfilo
                        ? `https://localhost:7006/${cliente.immagineProfilo}`
                        : icon1
                    }
                    alt="Icona Profilo"
                    width={80}
                    height={80}
                    className="rounded-circle border border-2 ms-2"
                  />
                </div>

                <Link className="modificaLink">Modifica Immagine</Link>
              </div>

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
                      className={`rounded-circle border `}
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
          </div>
        )
      )}
    </div>
  );
};

export default Profilo;
