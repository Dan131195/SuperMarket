/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import icon1 from "../assets/images/icon-1.png";
import { useNavigate } from "react-router-dom";

import wallpaper1 from "../assets/img/wallpaper1.jpg";
import wallpaper2 from "../assets/img/wallpaper2.jpg";
import wallpaper3 from "../assets/img/wallpaper3.jpg";

const Profilo = () => {
  const { token } = useSelector((state) => state.auth);
  const [cliente, setCliente] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    codiceFiscale: "",
    indirizzo: "",
  });
  const [errore, setErrore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const listWallpaper = [wallpaper1, wallpaper2, wallpaper3];

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]
        );
        setUserId(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        );
      } catch (error) {
        console.error("Token non valido", error);
        navigate("/login");
      }
    }
  }, [token]);

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://supermarketstoreapi.azurewebsites.net/api/cliente/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Errore nel recupero dati profilo");

      const data = await res.json();
      setCliente(data);
      setErrore(false);
      console.log(data);
    } catch (err) {
      console.log(err);
      setErrore(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      nome: cliente.nome,
      cognome: cliente.cognome,
      email: cliente.email,
      codiceFiscale: cliente.codiceFiscale,
      indirizzo: cliente.indirizzo,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("Nome", editForm.nome);
      formData.append("Cognome", editForm.cognome);
      formData.append("Email", editForm.email);
      formData.append("CodiceFiscale", editForm.codiceFiscale);
      formData.append("Indirizzo", editForm.indirizzo);
      if (editForm.immagineFile) {
        formData.append("ImmagineFile", editForm.immagineFile);
      }

      const res = await fetch(
        `https://supermarketstoreapi.azurewebsites.net/api/cliente/${cliente.clienteId}/modifica`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Errore aggiornamento profilo");

      alert("✅ Profilo aggiornato!");
      setShowEditModal(false);
      fetchCliente();
    } catch (err) {
      console.error(err);
      alert("❌ Errore aggiornamento profilo");
    }
  };

  const wallpaper = () => {
    const wallpaper = Math.floor(Math.random() * listWallpaper.length);
    return listWallpaper[wallpaper];
  };

  useEffect(() => {
    document.title = "SpeedMarket - Profilo";

    fetchCliente();
  }, [userId]);

  return (
    <div className="container py-4">
      {errore && (
        <div className="container py-5">
          <Alert variant="danger" className="text-center">
            Errore nel caricamento del profilo..
          </Alert>
        </div>
      )}

      {loading && (
        <div className="text-center w-100">
          <Spinner variant="success"></Spinner>
          <p className="text-center fs-6">Caricamento profilo in corso..</p>
        </div>
      )}

      {cliente && (
        <div className="m-auto profilePage">
          <h1 className="text-light mb-4">Il Mio Profilo</h1>
          <div className="card shadow">
            <div className="w-100 mb-1 position-relative">
              <img src={wallpaper()} alt="" className="w-100" height={150} />
              <div className="position-absolute profileImg">
                <img
                  src={
                    cliente.immagineProfilo == null
                      ? icon1
                      : `https://supermarketstoreapi.azurewebsites.net/${cliente.immagineProfilo}`
                  }
                  alt="Icona Profilo"
                  width={80}
                  height={80}
                  className="rounded-circle border border-2 ms-2 bg-light"
                />
              </div>
            </div>
            <div className="p-4 profileContainer text-light">
              <h4 className=" mb-3">Ciao {cliente.nome}!</h4>
              <p>
                <strong className="speedMarket">Nome: </strong>
                <span>{cliente.nome}</span>
              </p>
              <p>
                <strong className="speedMarket">Cognome: </strong>{" "}
                <span>{cliente.cognome}</span>
              </p>
              <p>
                <strong className="speedMarket">Email: </strong>{" "}
                <span>{cliente.email}</span>
              </p>
              <p>
                <strong className="speedMarket">Codice Fiscale: </strong>{" "}
                <span>{cliente.codiceFiscale}</span>
              </p>
              <p>
                <strong className="speedMarket">Indirizzo: </strong>{" "}
                <span>{cliente.indirizzo}</span>
              </p>
              <div className="text-end">
                <Button variant="primary" onClick={() => handleOpenEditModal()}>
                  Modifica Profilo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label className="m-2">Nome</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nome"
              value={editForm.nome}
              onChange={(e) =>
                setEditForm({ ...editForm, nome: e.target.value })
              }
            />
            <label className="m-2">Cognome</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Cognome"
              value={editForm.cognome}
              onChange={(e) =>
                setEditForm({ ...editForm, cognome: e.target.value })
              }
            />
            <label className="m-2">Email</label>
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />
            <label className="m-2">Codice Fiscale</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Codice Fiscale"
              value={editForm.codiceFiscale}
              onChange={(e) =>
                setEditForm({ ...editForm, codiceFiscale: e.target.value })
              }
            />
            <label className="m-2">Indirizzo</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Indirizzo"
              value={editForm.indirizzo}
              onChange={(e) =>
                setEditForm({ ...editForm, indirizzo: e.target.value })
              }
            />
            <label className="m-2">Immagine del profilo</label>
            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) =>
                setEditForm({ ...editForm, immagineFile: e.target.files[0] })
              }
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annulla
          </Button>
          <Button variant="success" onClick={handleSaveEdit}>
            Salva Modifiche
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profilo;
