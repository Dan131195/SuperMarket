import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Spinner, Alert, ListGroup } from "react-bootstrap";

const ProdottiConSidebar = () => {
  const [prodotti, setProdotti] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [loadingProdotti, setLoadingProdotti] = useState(true);
  const [loadingCategorie, setLoadingCategorie] = useState(true);
  const [errore, setErrore] = useState(null);
  const [showCategorie, setShowCategorie] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProdotto, setSelectedProdotto] = useState(null);

  useEffect(() => {
    document.title = "SpeedMarket - Prodotti";

    const fetchCategorie = async () => {
      try {
        const res = await fetch("https://localhost:7006/api/Categoria");
        if (!res.ok) throw new Error("Errore nel recupero delle categorie");
        const data = await res.json();
        setCategorie(data);
      } catch (err) {
        console.error(err);
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
        console.error(err);
        setErrore("Errore nel recupero dei prodotti");
      } finally {
        setLoadingProdotti(false);
      }
    };

    fetchCategorie();
    fetchProdotti();
  }, []);

  const handleShow = (prodotto) => {
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
    <div className="h-100">
      <div className="container-fluid py-3 d-flex h-100">
        <div className="d-none d-md-block col-md-3 col-lg-3 col-xl-2 h-100 border-end me-2">
          <h5 className="text-light border-bottom border-4 pb-2">Categorie</h5>
          <div>
            {categorie.map((cat) => (
              <p
                key={cat.categoriaId}
                className="border-bottom border-2 text-white m-0 py-2"
              >
                {cat.nomeCategoria}
              </p>
            ))}
          </div>
        </div>
        <div className="col-md-9 col-lg-9 col-xl-10">
          <div className="row">
            <div className="col-12">
              <h2 className="mb-2 text-light">I NOSTRI PRODOTTI</h2>

              <div className="col-12 d-md-none mb-2 border border-3 p-1 px-2 rounded-3">
                <div className="d-flex justify-content-between align-items-center  py-2 px-2 ">
                  <h5 className="text-light m-0">Categorie</h5>
                  <i
                    className={` bi ${
                      showCategorie ? "bi-caret-up-fill" : "bi-caret-down-fill"
                    } border border-2 px-1 cursor-pointer text-light rounded-2`}
                    onClick={() => setShowCategorie(!showCategorie)}
                    role="button"
                  />
                </div>
                <div className="mt-1">
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
              </div>
              <div className="row g-3 g-lg-2">
                {prodotti.map((prodotto) => (
                  <div
                    className="col-6 col-md-4 col-lg-3 col-xl-2 d-flex mb-1"
                    key={prodotto.prodottoId}
                  >
                    <div className="card w-100 d-flex flex-column productCard">
                      <img
                        src={`https://localhost:7006${prodotto.immagineFile}`}
                        className="card-img-top w-100 rounded-2  productImage h-50"
                        alt={prodotto.nomeProdotto}
                      />
                      <div className="card-body d-flex flex-column justify-content-between border-top border-3">
                        <h5 className="card-title">{prodotto.nomeProdotto}</h5>
                        <p className="card-text text-muted">
                          {prodotto.categoriaNome}
                        </p>
                        <p className="d-none d-xl-block">
                          {prodotto.descrizioneProdotto}
                        </p>
                        <div className="">
                          <div className="fw-bold">
                            € {prodotto.prezzoProdotto.toFixed(2)}
                          </div>
                          <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
                            <button className="btn btn-success w-50">
                              <i className="bi bi-cart4"></i>
                            </button>
                            <button
                              className="btn btn-warning w-50"
                              onClick={() => handleShow(prodotto)}
                            >
                              <i class="bi bi-info-circle text-light"></i>
                            </button>
                          </div>
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
                style={{ objectFit: "cover", width: "25%" }}
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
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Chiudi
              </Button>
              <Button variant="primary">
                <i className="bi bi-cart-plus"></i> Aggiungi al carrello
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProdottiConSidebar;
