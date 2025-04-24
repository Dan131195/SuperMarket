import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/cartSlice";
// import { parseJwt } from "../Utils/jwt";

const Prodotti = () => {
  const dispatch = useDispatch();

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

  const token = useSelector((state) => state.auth.token);

  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Token payload:", payload);

  const userId =
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  console.log(userId);

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

  const aggiungiAlCarrello = async (dto) => {
    const res = await fetch("https://localhost:7006/api/carrello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Errore nell'aggiunta al carrello");
    }
  };

  const aggiornaCarrelloRedux = async () => {
    const res = await fetch(`https://localhost:7006/api/carrello/${userId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setCart(data));
    }
  };

  const handleAddToCart = async (prodotto) => {
    console.log(userId);
    try {
      await aggiungiAlCarrello({
        userId: userId,
        prodottoId: prodotto.prodottoId,
        quantita: quantita,
      });
      setMessaggio(`✅ ${prodotto.nomeProdotto} aggiunto al carrello`);
      await aggiornaCarrelloRedux();
    } catch (err) {
      setMessaggio("❌ " + err.message);
    } finally {
      setTimeout(() => setMessaggio(null), 3000);
      setShowModal(false);
      setQuantita(1);
    }
  };

  const handleShow = (prodotto) => {
    console.log(userId);
    setSelectedProdotto(prodotto);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  if (loadingProdotti || loadingCategorie) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
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
        <div className="d-none d-md-block col-md-3 col-xl-2 h-100 p-0 pe-3 ps-1 sidebar-sticky">
          <h5 className="text-light border-bottom border-4 pb-2">Categorie</h5>
          <div>
            {categorie.map((cat) => (
              <p
                key={cat.categoriaId}
                className="border-bottom border-2 text-white m-0 py-1"
              >
                {cat.nomeCategoria}
              </p>
            ))}
          </div>
        </div>

        <div className="col-md-9 col-xl-10">
          <div className="row">
            <div className="col-12 p-0">
              <h2 className="mb-2 ps-1 text-light">I NOSTRI PRODOTTI</h2>

              {messaggio && (
                <div className="alert alert-success text-center">
                  {messaggio}
                </div>
              )}

              <div className="col-12 d-md-none mb-2 border border-3 p-1 m-auto w-75 px-2 rounded-3">
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
                    {categorie.map((cat) => (
                      <ListGroup.Item
                        key={cat.categoriaId}
                        action
                        className="text-light categoryItem"
                      >
                        {cat.nomeCategoria}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>

              <div className="row m-0 p-1 g-1">
                {prodotti.map((prodotto) => (
                  <div
                    className="col-6 col-md-4  col-xl-2 d-flex mb-1 p-1"
                    key={prodotto.prodottoId}
                  >
                    <div className="card w-100 d-flex flex-column productCard">
                      <img
                        src={`https://localhost:7006${prodotto.immagineFile}`}
                        className="card-img-top w-100 rounded-2 productImage h-50"
                        alt={prodotto.nomeProdotto}
                      />
                      <div className="card-body d-flex flex-column justify-content-between border-top border-3">
                        <h5 className="card-title">{prodotto.nomeProdotto}</h5>
                        <p className="card-text text-muted">
                          {prodotto.categoriaNome}
                        </p>

                        <div className="">
                          <div className="fw-bold">
                            € {prodotto.prezzoProdotto.toFixed(2)}
                          </div>

                          <button
                            className="btn btn-success w-100"
                            onClick={() => handleShow(prodotto)}
                          >
                            <i className="bi bi-cart4 text-light"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <strong>Prezzo:</strong> €
                {selectedProdotto.prezzoProdotto.toFixed(2)}
              </p>
              <p>
                <strong>Disponibilità:</strong> {selectedProdotto.stock} pezzi
              </p>
              <p>
                <strong>Descrizione: </strong>
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
              <div className="d-flex justify-content-between w-100">
                <Button variant="secondary" onClick={handleClose}>
                  Chiudi
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(selectedProdotto)}
                  disabled={!userId || selectedProdotto.stock === 0}
                >
                  <i className="bi bi-cart-plus"></i> Aggiungi al carrello
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Prodotti;
