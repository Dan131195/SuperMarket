/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/cartSlice";
import fruitIcon from "../assets/icons/frutta.png";
import allCategoriesIcon from "../assets/icons/all-categories.png";
import defaultIcon from "../assets/icons/default.png";
import breadIcon from "../assets/icons/pane.png";
import meatIcon from "../assets/icons/carne.png";
import drinksIcon from "../assets/icons/bevanda.png";
import milkIcon from "../assets/icons/latticini.png";
import biscuitIcon from "../assets/icons/biscuit.png";
import pastaIcon from "../assets/icons/pasta.png";
import eggIcon from "../assets/icons/uovo.png";
import canIcon from "../assets/icons/dispensa.png";

const Prodotti = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  console.log(token);

  const [prodotti, setProdotti] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [loadingProdotti, setLoadingProdotti] = useState(true);
  const [loadingCategorie, setLoadingCategorie] = useState(true);
  const [errore, setErrore] = useState(null);
  const [showCategorie, setShowCategorie] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProdotto, setSelectedProdotto] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [quantita, setQuantita] = useState(1);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [showMessaggioModal, setShowMessaggioModal] = useState(false);
  const [messaggioContenuto, setMessaggioContenuto] = useState("");

  let payload = null;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Token non valido", error);
    }
  }
  const userId = payload
    ? payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    : null;

  useEffect(() => {
    document.title = "SpeedMarket - Prodotti";

    const fetchCategorie = async () => {
      try {
        const res = await fetch("https://localhost:7006/api/Categoria");
        if (!res.ok) throw new Error("Errore nel recupero delle categorie");
        const data = await res.json();
        setCategorie(data);
      } catch (err) {
        console.log(err);
        setErrore("Errore nel recupero delle categorie");
      } finally {
        setLoadingCategorie(false);
      }
    };

    const fetchProdotti = async () => {
      try {
        const res = await fetch("https://localhost:7006/api/Prodotto");
        if (!res.ok) throw new Error("Errore nel recupero dei prodotti");
        const data = await res.json();
        setProdotti(data);
      } catch (err) {
        console.log(err);
        setErrore("Errore nel recupero dei prodotti");
      } finally {
        setLoadingProdotti(false);
      }
    };

    fetchCategorie();
    fetchProdotti();
  }, []);

  const getCategoriaImage = (nomeCategoria) => {
    switch (nomeCategoria) {
      case "Frutta":
        return fruitIcon;
      case "Pane":
        return breadIcon;
      case "Carne":
        return meatIcon;
      case "Bevande":
        return drinksIcon;
      case "Latticini":
        return milkIcon;
      case "Pasta":
        return pastaIcon;
      case "Biscotti":
        return biscuitIcon;
      case "Dispensa":
        return canIcon;
      case "Uova":
        return eggIcon;
      default:
        return defaultIcon;
    }
  };

  const aggiungiAlCarrello = async (dto) => {
    const res = await fetch("https://localhost:7006/api/carrello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Errore nell'aggiunta al carrello");
    }
  };

  const aggiornaCarrelloRedux = async () => {
    const res = await fetch(`https://localhost:7006/api/carrello/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setCart(data));
    }
  };

  const handleAddToCart = async (prodotto) => {
    if (!token) {
      setMessaggioContenuto(
        "❌ Devi essere loggato per aggiungere al carrello!"
      );
      setShowMessaggioModal(true);
      return;
    }

    try {
      await aggiungiAlCarrello({
        userId: userId,
        prodottoId: prodotto.prodottoId,
        quantita: quantita,
      });
      setMessaggioContenuto(`✅ ${prodotto.nomeProdotto} aggiunto al carrello`);
      await aggiornaCarrelloRedux();
    } catch (err) {
      setMessaggioContenuto("❌ " + err.message);
    } finally {
      setShowMessaggioModal(true);
      setShowModal(false);
      setQuantita(1);
    }
  };

  const handleShow = (prodotto) => {
    setSelectedProdotto(prodotto);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const prodottiFiltrati = categoriaSelezionata
    ? prodotti.filter((p) => p.categoriaNome === categoriaSelezionata)
    : prodotti;

  if (loadingProdotti || loadingCategorie) {
    return (
      <div className="text-center mt-5">
        <Spinner
          animation="border"
          variant="success"
          style={{ width: "7rem", height: "7rem" }}
          className="display-1"
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
    <div className="h-100 p-0">
      <div className="py-3 row h-100 m-0">
        {/*  */}
        {/* Categorie SideBar */}
        <div
          className="d-none d-md-block col-md-3 col-xl-2 h-100 p-0 pe-3 ps-1 sidebar-sticky"
          id="categoryList2"
        >
          <h5 className="text-light border-bottom border-4 pb-2">Categorie</h5>
          <div>
            <p
              className={` text-white m-0 py-1 gap-2 curso-pointer ${
                categoriaSelezionata === null ? " fw-bold fst-italic" : ""
              }`}
              onClick={() => setCategoriaSelezionata(null)}
            >
              <img
                src={allCategoriesIcon}
                alt=""
                width={45}
                className="border border-2 border-light rounded-5 p-1 categoryIcon"
              />{" "}
              Tutte
            </p>
            {categorie.map((cat) => (
              <p
                key={cat.categoriaId}
                className={` text-white m-0 py-2 d-flex align-items-center gap-2 cursor-pointer ${
                  categoriaSelezionata === cat.nomeCategoria
                    ? "fw-bold text-warning fst-italic"
                    : ""
                }`}
                onClick={() => setCategoriaSelezionata(cat.nomeCategoria)}
              >
                <img
                  src={getCategoriaImage(cat.nomeCategoria)}
                  alt={cat.nomeCategoria}
                  width={45}
                  className="border border-2 border-light rounded-5 categoryIcon p-1"
                />
                {cat.nomeCategoria}
              </p>
            ))}
          </div>
        </div>

        <div className="col-md-9 col-xl-10">
          <div className="row">
            <div className="col-12 p-0">
              <h2 className="mb-2 ps-3 ps-lg-2 text-light">
                I NOSTRI PRODOTTI
              </h2>

              {messaggio && (
                <div className="alert alert-success text-center">
                  {messaggio}
                </div>
              )}

              <div className="col-12 d-md-none mb-2 border border-3 p-1 m-auto px-2 rounded-3 CategoriesContainerSM">
                <div className="d-flex justify-content-between align-items-center py-2 px-2">
                  <h5 className="text-light m-0 ps-2">Categorie</h5>
                  <i
                    className={`bi ${
                      showCategorie ? "bi-caret-up-fill" : "bi-caret-down-fill"
                    } border border-2 px-1 cursor-pointer text-light rounded-2`}
                    onClick={() => setShowCategorie(!showCategorie)}
                    role="button"
                  />
                </div>

                {showCategorie && (
                  <ListGroup id="categoryList" className="scrollable-list">
                    {/* Tutte */}
                    <ListGroup.Item
                      action
                      className={`text-light categoryItem ${
                        categoriaSelezionata === null
                          ? "fw-bold text-warning"
                          : ""
                      } d-flex align-items-center gap-2`}
                      onClick={() => setCategoriaSelezionata(null)}
                    >
                      <img src={allCategoriesIcon} alt="Tutte" width={24} />
                      Tutte
                    </ListGroup.Item>

                    {/* Mappa categorie */}
                    {categorie.map((cat) => (
                      <ListGroup.Item
                        key={cat.categoriaId}
                        action
                        className={`text-light categoryItem ${
                          categoriaSelezionata === cat.nomeCategoria
                            ? "fw-bold text-danger"
                            : ""
                        } d-flex align-items-center gap-2`}
                        onClick={() =>
                          setCategoriaSelezionata(cat.nomeCategoria)
                        }
                      >
                        <img
                          src={getCategoriaImage(cat.nomeCategoria)}
                          alt={cat.nomeCategoria}
                          width={36}
                          className="border border-2 border-light p-1 rounded-5"
                        />
                        {cat.nomeCategoria}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>

              {/* Prodotti */}
              <div className="row m-0 p-1 p-lg-0 ">
                {prodottiFiltrati.map((prodotto) => (
                  <div
                    className="col-6 col-sm-4 col-xl-3 col-xxl-2 d-flex mb-1 p-2 p-lg-1"
                    key={prodotto.prodottoId}
                  >
                    <div className="card w-100 d-flex flex-column productCard">
                      <div className="w-100 bg-white p-1">
                        <img
                          src={`https://localhost:7006${prodotto.immagineFile}`}
                          className="card-img-top m-auto rounded-2 productImage"
                          alt={prodotto.nomeProdotto}
                        />
                      </div>

                      <div className="card-body d-flex flex-column justify-content-between border-top border-3">
                        <h6 className="card-title">{prodotto.nomeProdotto}</h6>
                        <p className="card-text text-muted">
                          {prodotto.categoriaNome}
                        </p>
                        <div>
                          <div className="fw-bold">
                            € {prodotto.prezzoProdotto.toFixed(2)}
                          </div>
                          <button
                            className="btn btn-success w-100 mt-2"
                            onClick={() => handleShow(prodotto)}
                          >
                            <i className="bi bi-cart4 text-light"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {prodottiFiltrati.length === 0 && (
                  <div className="text-center text-light mt-4">
                    Nessun prodotto trovato.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedProdotto && (
          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProdotto.nomeProdotto}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={`https://localhost:7006${selectedProdotto.immagineFile}`}
                alt={selectedProdotto.nomeProdotto}
                className="img-fluid mb-3 rounded m-auto w-100"
              />
              <p>
                <strong>Categoria:</strong> {selectedProdotto.categoriaNome}
              </p>
              <p>
                <strong>Prezzo:</strong> €{" "}
                {selectedProdotto.prezzoProdotto.toFixed(2)}
              </p>
              <p>
                <strong>Disponibilità:</strong> {selectedProdotto.stock} pezzi
              </p>
              <p>
                <strong>Descrizione:</strong>{" "}
                {selectedProdotto.descrizioneProdotto}
              </p>
            </Modal.Body>
            <Modal.Footer className="d-flex flex-column align-items-stretch gap-2">
              <div className="d-flex align-items-center gap-2 w-100">
                <label className="form-label m-0">Quantità:</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ maxWidth: "80px" }}
                  min={1}
                  max={selectedProdotto?.stock || 1}
                  value={quantita}
                  onChange={(e) => setQuantita(Number(e.target.value))}
                />
                <span className="text-muted">
                  Disponibili: {selectedProdotto?.stock}
                </span>
              </div>
              <div>
                <div className="d-flex justify-content-between w-100">
                  <Button variant="secondary" onClick={handleClose}>
                    Chiudi
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleAddToCart(selectedProdotto)}
                    disabled={!token || selectedProdotto.stock === 0}
                  >
                    <i className="bi bi-cart-plus"></i> Aggiungi al carrello
                  </Button>
                </div>

                {!token && (
                  <div className="m-0">
                    <p className="text-danger text-end mt-1 mb-0 pe-1">
                      Effettua il Login !
                    </p>
                  </div>
                )}
              </div>
            </Modal.Footer>
          </Modal>
        )}
        <Modal
          show={showMessaggioModal}
          onHide={() => setShowMessaggioModal(false)}
          className=" bg-white bg-opacity-25 "
          centered
        >
          <Modal.Header closeButton className="bg-dark border-0">
            <Modal.Title className="text-light">Messaggio</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center bg-dark text-light">
            {messaggioContenuto}
          </Modal.Body>
          <Modal.Footer className="bg-dark border-0">
            <Button
              variant="danger"
              onClick={() => setShowMessaggioModal(false)}
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Prodotti;
