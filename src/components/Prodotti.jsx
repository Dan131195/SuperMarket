/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

import fruitIcon from "../assets/icons/frutta.png";
import allCategoriesIcon from "../assets/icons/all-categories.png";
import defaultIcon from "../assets/icons/default.png";
import breadIcon from "../assets/icons/pane.png";
import meatIcon from "../assets/icons/carne.png";
import drinksIcon from "../assets/icons/bevanda.png";
import milkIcon from "../assets/icons/latticini.png";
import biscuitIcon from "../assets/icons/biscuit.png";
import pastaIcon from "../assets/icons/pasta.png";
import eggIcon from "../assets/icons/egg.png";
import canIcon from "../assets/icons/dispensa.png";
import vegetableIcon from "../assets/icons/verdure.png";
import salumeIcon from "../assets/icons/salume.png";
import snacksIcon from "../assets/icons/snack.png";
import condimentsIcon from "../assets/icons/condimenti.png";
import breakfastIcon from "../assets/icons/colazione.png";
import frozenIcon from "../assets/icons/surgelati.png";

import notFound from "../assets/img/notFound.png";

const Prodotti = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  console.log(token);

  const [prodotti, setProdotti] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [loadingProdotti, setLoadingProdotti] = useState(true);
  const [loadingCategorie, setLoadingCategorie] = useState(true);
  const [errore, setErrore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProdotto, setSelectedProdotto] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [quantita, setQuantita] = useState(1);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [showMessaggioModal, setShowMessaggioModal] = useState(false);
  const [messaggioAggiunta, setMessaggioAggiunta] = useState(false);
  const [erroreAggiunta, seterroreContenuto] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProdotto, setEditingProdotto] = useState(null);

  const [nomeProdotto, setNomeProdotto] = useState("");
  const [prezzoProdotto, setPrezzoProdotto] = useState("");
  const [stock, setStock] = useState("");
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [descrizioneProdotto, setDescrizioneProdotto] = useState("");
  const [immagineFile, setImmagineFile] = useState(null);

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
  const userId = payload
    ? payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    : null;

  const fetchCategorie = async () => {
    try {
      const res = await fetch(
        "https://supermarketstoreapi.azurewebsites.net/api/Categoria"
      );
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
      const res = await fetch(
        "https://supermarketstoreapi.azurewebsites.net/api/Prodotto"
      );
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

  useEffect(() => {
    document.title = "SpeedMarket - Prodotti";

    fetchCategorie();
    fetchProdotti();
  }, []);

  const resetForm = () => {
    setNomeProdotto("");
    setPrezzoProdotto("");
    setStock("");
    setNomeCategoria("");
    setDescrizioneProdotto("");
    setImmagineFile(null);
    setEditingProdotto(null);
  };

  const handleCreaProdotto = async (e) => {
    resetForm();
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("NomeProdotto", nomeProdotto);
      formData.append("PrezzoProdotto", prezzoProdotto);
      formData.append("Stock", stock);
      formData.append("NomeCategoria", nomeCategoria);
      formData.append("DescrizioneProdotto", descrizioneProdotto);
      formData.append("ImmagineFile", immagineFile);

      const res = await fetch(
        "https://supermarketstoreapi.azurewebsites.net/api/prodotto",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Errore durante la creazione del prodotto");

      alert("✅ Prodotto creato con successo!");
      resetForm();
      setShowCreateModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Errore nella creazione");
    }
  };

  const handleModificaProdotto = async (e) => {
    e.preventDefault();
    try {
      const body = {
        nomeProdotto,
        prezzoProdotto: parseFloat(prezzoProdotto),
        stock: parseInt(stock),
        nomeCategoria,
        descrizioneProdotto,
      };

      const res = await fetch(
        `https://supermarketstoreapi.azurewebsites.net/api/prodotto/${editingProdotto.prodottoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Errore durante la modifica del prodotto");

      alert("✅ Prodotto modificato con successo!");
      resetForm();
      setShowCreateModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Errore nella modifica");
    }
  };

  const handleEditProdotto = (prodotto) => {
    setEditingProdotto(prodotto);
    setNomeProdotto(prodotto.nomeProdotto);
    setPrezzoProdotto(prodotto.prezzoProdotto);
    setStock(prodotto.stock);
    setNomeCategoria(prodotto.categoriaNome);
    setDescrizioneProdotto(prodotto.descrizioneProdotto);
    setShowCreateModal(true);
  };

  const handleDeleteProdotto = async (prodottoId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      try {
        const res = await fetch(
          `https://supermarketstoreapi.azurewebsites.net/api/prodotto/${prodottoId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Errore durante eliminazione prodotto");

        alert("✅ Prodotto eliminato con successo!");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("❌ Errore eliminazione prodotto");
      }
    }
  };

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
      case "Salumi":
        return salumeIcon;
      case "Verdura":
        return vegetableIcon;
      case "Snack":
        return snacksIcon;
      case "Condimenti":
        return condimentsIcon;
      case "Colazione":
        return breakfastIcon;
      case "Surgelati":
        return frozenIcon;
      default:
        return defaultIcon;
    }
  };

  const aggiungiAlCarrello = async (dto) => {
    const res = await fetch(
      "https://supermarketstoreapi.azurewebsites.net/api/carrello",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      }
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Errore nell'aggiunta al carrello");
    }
  };

  const aggiornaCarrelloRedux = async () => {
    const res = await fetch(
      `https://supermarketstoreapi.azurewebsites.net/api/carrello/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      dispatch(setCart(data));
    }
  };

  const handleAddToCart = async (prodotto) => {
    if (!token) {
      setShowMessaggioModal(true);
      return;
    }

    try {
      await aggiungiAlCarrello({
        userId: userId,
        prodottoId: prodotto.prodottoId,
        quantita: quantita,
      });
      setMessaggioAggiunta(`✅ ${prodotto.nomeProdotto} aggiunto al carrello`);
      await aggiornaCarrelloRedux();
      fetchProdotti();
    } catch (err) {
      seterroreContenuto("❌ " + err.message);
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

  let prodottiFiltrati = categoriaSelezionata
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
    <div>
      <div className="text-white ps-1 mb-3 w-100 d-none d-md-block breadCrumbProdotti">
        {categoriaSelezionata ? (
          <div className="m-auto prodottiContainer">
            <p className="text-white d-inline">Home / </p>
            <p className="text-white d-inline">Prodotti / </p>
            <span className="speedMarket border-bottom fw-bold">
              {categoriaSelezionata}
            </span>{" "}
          </div>
        ) : (
          <div className="m-auto prodottiContainer">
            <p className="text-white d-inline">Home / </p>
            <span className="speedMarket border-bottom fw-bold">Prodotti</span>
          </div>
        )}
      </div>
      <div className="m-auto prodottiContainer">
        <div className="py-3 py-lg-0 row m-0">
          {/*  */}
          {/* Categorie SideBar */}
          <div
            className="d-none d-md-block col-md-3 col-xl-2  h-100 p-0 pe-3 ps-1 sidebar-sticky"
            id="categoryList2"
          >
            <h5 className="text-light ">Categorie</h5>
            <hr className="speedMarket border-3 opacity-100" />
            <div>
              <p
                className={` text-white m-0 py-1 gap-2 cursor-pointer  ${
                  categoriaSelezionata === null
                    ? " fw-bold fst-italic speedMarket"
                    : ""
                }`}
                onClick={() => setCategoriaSelezionata(null)}
              >
                <img
                  src={allCategoriesIcon}
                  alt=""
                  width={45}
                  className="border border-2 border-light rounded-5 p-1 categoryIcon me-md-1 me-lg-2"
                />{" "}
                Tutte
              </p>
              {categorie.map((cat) => (
                <p
                  key={cat.categoriaId}
                  className={` text-white m-0 py-2 d-flex align-items-center gap-2 cursor-pointer ${
                    categoriaSelezionata === cat.nomeCategoria
                      ? "fw-bold text-warning fst-italic speedMarket"
                      : ""
                  }`}
                  onClick={() => setCategoriaSelezionata(cat.nomeCategoria)}
                >
                  <img
                    src={getCategoriaImage(cat.nomeCategoria)}
                    alt={cat.nomeCategoria}
                    width={45}
                    className="border border-2 border-light rounded-5 categoryIcon p-1 me-md-1 me-lg-2"
                  />
                  {cat.nomeCategoria}
                </p>
              ))}
            </div>
          </div>

          <div className="col-md-9 col-xl-10 ">
            <div className="row">
              <div className="col-12 p-0 position-relative">
                {/* Categorie Carousel */}
                <div
                  id="stickyCategories"
                  className="col-12 d-md-none mb-2 w-100 ps-1 py-3 rounded-3 CategoriesContainerSM"
                >
                  <div>
                    <div
                      id="categoryCarousel"
                      className="d-flex pb-2 overflow-auto"
                    >
                      {/* Tutte */}
                      <div
                        className={`bg-transparent text-light categoryItem rounded-3 ${
                          categoriaSelezionata === null
                            ? "fw-bold speedMarket"
                            : ""
                        } d-flex flex-column align-items-center text-center px-2 pt-1`}
                        style={{
                          minWidth: "80px",
                          scrollSnapAlign: "start",
                          cursor: "pointer",
                        }}
                        onClick={() => setCategoriaSelezionata(null)}
                      >
                        <img
                          src={allCategoriesIcon}
                          alt="Tutte"
                          width={36}
                          className="border border-2 border-light p-1 rounded-5 mb-1 categoryIcon"
                        />
                        <small>Tutte</small>
                      </div>

                      {/* Mappa categorie */}
                      {categorie.map((cat) => (
                        <div
                          key={cat.categoriaId}
                          className={`bg-transparent text-light categoryItem rounded-3 ${
                            categoriaSelezionata === cat.nomeCategoria
                              ? "fw-bold speedMarket"
                              : ""
                          } d-flex flex-column align-items-center text-center px-2 pt-1`}
                          style={{
                            minWidth: "80px",
                            scrollSnapAlign: "start",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setCategoriaSelezionata(cat.nomeCategoria)
                          }
                        >
                          <img
                            src={getCategoriaImage(cat.nomeCategoria)}
                            alt={cat.nomeCategoria}
                            width={36}
                            className="border border-2 border-light p-1 rounded-5 mb-1 categoryIcon"
                          />
                          <small>{cat.nomeCategoria}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ps-lg-3">
                  <div className="mb-2 ps-3 ps-lg-2 text-light ">
                    <h2>I Nostri Prodotti</h2>

                    {userRole === "SuperAdmin" && (
                      <Button
                        className="nuovoProdottoBtn"
                        variant="success"
                        onClick={() => {
                          setShowCreateModal(true);
                          resetForm();
                        }}
                      >
                        <i className="bi bi-plus-circle"></i> Nuovo Prodotto
                      </Button>
                    )}
                  </div>

                  {messaggio && (
                    <div className="alert alert-success text-center">
                      {messaggio}
                    </div>
                  )}

                  {/* Prodotti */}
                  <div className="row m-0 p-1 p-lg-0 ">
                    {prodottiFiltrati.map((prodotto) => (
                      <div
                        className="col-6 col-sm-4 col-xl-3 col-xxl-2 d-flex mb-1 p-2 p-lg-1"
                        key={prodotto.prodottoId}
                      >
                        <div
                          className={`card w-100 d-flex flex-column productCard `}
                        >
                          <div className="w-100 bg-white">
                            <div
                              className={`${
                                prodotto.stock === 0 ? "prodottoesaurito" : ""
                              }`}
                            >
                              <img
                                src={`https://supermarketstoreapi.azurewebsites.net${prodotto.immagineFile}`}
                                className="card-img-top m-auto productImage "
                                alt={prodotto.nomeProdotto}
                              />
                            </div>
                          </div>

                          <div className="card-body d-flex flex-column justify-content-between border-top border-3 position-relative">
                            <h6 className="card-title">
                              {prodotto.nomeProdotto}
                            </h6>
                            <p className="card-text speedMarket fw-bold">
                              {prodotto.categoriaNome}
                            </p>

                            <div className="fw-bold">
                              € {prodotto.prezzoProdotto.toFixed(2)}
                            </div>
                            <div>
                              {prodotto.stock === 0 && (
                                <p className="text-danger m-0 ">Esaurito!</p>
                              )}
                            </div>
                            <div>
                              <Button
                                className="btn btn-success w-100 mt-2 nuovoProdottoBtn"
                                onClick={() => handleShow(prodotto)}
                              >
                                <i className="bi bi-cart4 text-light"></i>
                              </Button>
                              {userRole === "SuperAdmin" && (
                                <div className="mt-2 d-flex gap-1">
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    className="w-50 text-light"
                                    onClick={() => handleEditProdotto(prodotto)}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="w-50"
                                    onClick={() =>
                                      handleDeleteProdotto(prodotto.prodottoId)
                                    }
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {prodottiFiltrati.length === 0 && (
                      <div className="text-center text-light d-flex justify-content-center align-items-center mt-4">
                        <img src={notFound} alt="notFound" />
                        <p className="m-0 ms-3"> Nessun prodotto trovato.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedProdotto && (
            <Modal
              show={showModal}
              onHide={handleClose}
              centered
              contentClassName="custom-modal"
            >
              <div className="p-2 bg-modaleProdotto text-white">
                <Modal.Body className="text-start text-light">
                  <div className="text-center">
                    <img
                      src={`https://supermarketstoreapi.azurewebsites.net${selectedProdotto.immagineFile}`}
                      alt={selectedProdotto.nomeProdotto}
                      className="img-fluid mb-3 rounded"
                      style={{
                        maxHeight: "250px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <p className="text-center mb-3 fs-5">
                    <strong>{selectedProdotto.nomeProdotto}</strong>

                    <hr className="border-white border-3" />
                  </p>

                  {userRole === "SuperAdmin" && (
                    <div className=" w-100">
                      <p className="speedMarket fw-bold">
                        Id prodotto :{" "}
                        <span className="text-light fw-normal">
                          {selectedProdotto.prodottoId}
                        </span>
                      </p>
                    </div>
                  )}

                  {userRole === "Admin" && (
                    <div className=" w-100">
                      <p className="speedMarket fw-bold">
                        Id prodotto :{" "}
                        <span className="text-light fw-normal">
                          {selectedProdotto.prodottoId}
                        </span>
                      </p>
                    </div>
                  )}

                  <p>
                    <strong className="speedMarket">Categoria :</strong>{" "}
                    {selectedProdotto.categoriaNome}
                  </p>
                  <p>
                    <strong className="speedMarket">Prezzo :</strong> €{" "}
                    {selectedProdotto.prezzoProdotto.toFixed(2)}
                  </p>
                  <p>
                    <strong className="speedMarket">Disponibilità :</strong>{" "}
                    {selectedProdotto.stock} pezzi
                  </p>
                  <p>
                    <strong className="speedMarket">Descrizione :</strong>{" "}
                    {selectedProdotto.descrizioneProdotto}
                  </p>
                </Modal.Body>
                <Modal.Footer className="d-flex flex-column align-items-stretch gap-2">
                  <div className="d-flex align-items-center gap-2 w-100">
                    <label className="form-label m-0 text-light fw-bold speedMarket">
                      Quantità:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      style={{ maxWidth: "80px" }}
                      min={1}
                      max={selectedProdotto?.stock || 1}
                      value={quantita}
                      onChange={(e) => setQuantita(Number(e.target.value))}
                    />
                    <div className="m-0">
                      {selectedProdotto.stock > 0 ? (
                        <p className="m-0 speedMarket fw-bold">
                          Pezzi:{" "}
                          <span className="text-light fw-normal">
                            {selectedProdotto.stock}
                          </span>
                        </p>
                      ) : (
                        <spans>Esaurito</spans>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between w-100">
                    <Button
                      className="nuovoProdottoBtn"
                      variant="secondary"
                      onClick={handleClose}
                    >
                      Chiudi
                    </Button>
                    <Button
                      className="nuovoProdottoBtn"
                      variant="success"
                      onClick={() => handleAddToCart(selectedProdotto)}
                      disabled={!token || selectedProdotto.stock === 0}
                    >
                      <i className="bi bi-cart-plus "></i> Aggiungi
                    </Button>
                  </div>

                  {!token && (
                    <p className="text-danger text-end mt-2 mb-0 pe-1">
                      Effettua il login!
                    </p>
                  )}
                </Modal.Footer>
              </div>
            </Modal>
          )}

          {/* CONFERMA AGGIUNTA CARRELLO */}
          <Modal
            show={showMessaggioModal}
            onHide={() => setShowMessaggioModal(false)}
            className=" bg-white bg-opacity-25 "
            centered
          >
            <Modal.Header closeButton className="bg-dark border-0">
              <Modal.Title className="text-light m-auto pt-4">
                {messaggioAggiunta && (
                  <div className="d-flex justify-content-center align-items-baseline w-100 text-center">
                    <i class="bi bi-cart-check fs-2 m-0 me-2 text-success "></i>
                    <p className="text-center p-0 m-0">
                      Prodotto aggiunto con successo
                    </p>
                  </div>
                )}
              </Modal.Title>
            </Modal.Header>

            <Modal.Footer className="bg-dark border-0">
              <Button
                variant="danger"
                onClick={() => setShowMessaggioModal(false)}
              >
                Chiudi
              </Button>
            </Modal.Footer>
          </Modal>

          {/* MODIFICA / CREA PRODOTTO */}
          <Modal
            show={showCreateModal}
            onHide={() => {
              setShowCreateModal(false);
              setEditingProdotto(null);
            }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {editingProdotto ? "Modifica Prodotto" : "Crea Nuovo Prodotto"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <form
                onSubmit={
                  editingProdotto ? handleModificaProdotto : handleCreaProdotto
                }
              >
                <div className="mb-3">
                  <label className="form-label">Nome prodotto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nomeProdotto}
                    onChange={(e) => setNomeProdotto(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Prezzo (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={prezzoProdotto}
                    onChange={(e) => setPrezzoProdotto(e.target.value)}
                    min={0}
                    step="0.01"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Stock disponibile</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min={0}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoria</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nomeCategoria}
                    onChange={(e) => setNomeCategoria(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrizione</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={descrizioneProdotto}
                    onChange={(e) => setDescrizioneProdotto(e.target.value)}
                    required
                  ></textarea>
                </div>

                {!editingProdotto && (
                  <div className="mb-3">
                    <label className="form-label">Immagine</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImmagineFile(e.target.files[0])}
                      required
                    />
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingProdotto(null);
                    }}
                  >
                    Annulla
                  </Button>
                  <Button type="submit" variant="success">
                    {editingProdotto ? "Salva Modifiche" : "Crea"}
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="scroll-to-top-btn"
          >
            <i className="bi bi-arrow-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prodotti;
