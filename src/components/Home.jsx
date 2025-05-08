import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import logoImg from "../assets/img/logo.png";
import logoImg2 from "../assets/img/logo3.png";
import fastCart from "../assets/img/fastCart2.png";

import fruitIcon from "../assets/icons/frutta.png";
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

const Home = () => {
  const [prodotti, setProdotti] = useState([]);
  const [errore, setErrore] = useState(false);
  const [loadingProdotti, setLoadingProdotti] = useState(true);
  const [categorie, setCategorie] = useState([]);
  const [loadingCategorie, setLoadingCategorie] = useState(true);
  const [erroreCategorie, setErroreCategorie] = useState(false);

  const fetchProdotti = async () => {
    try {
      const res = await fetch("https://localhost:7006/api/Prodotto");
      if (!res.ok) throw new Error("Errore nel recupero dei prodotti");
      const data = await res.json();
      setProdotti(data);
    } catch (err) {
      console.log(err);
      setErrore(true);
    } finally {
      setLoadingProdotti(false);
    }
  };

  const fetchCategorie = async () => {
    try {
      const res = await fetch("https://localhost:7006/api/Categoria");
      if (!res.ok) throw new Error("Errore nel recupero delle categorie");
      const data = await res.json();
      setCategorie(data);
    } catch (err) {
      console.log(err);
      setErroreCategorie(true);
    } finally {
      setLoadingCategorie(false);
    }
  };

  useEffect(() => {
    document.title = "SpeedMarket - Home";

    fetchCategorie();
    fetchProdotti();
  }, []);

  // Controllo User

  const { token, user } = useSelector((state) => state.auth);

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
  return (
    <div className="homeContainer d-flex align-items-center justify-content-center text-white py-3">
      <div className="homeContainerInside text-center my-2 my-lg-4 my-xl-0">
        <div className="row justify-content-center">
          <div className="">
            <div className="p-4 p-md-5 rounded-4 my-2 shadow-lg homeOpacity promos">
              <div className="text-center d-flex align-items-center justify-content-center">
                <img
                  src={logoImg}
                  id="fastCartImg"
                  className="rounded-3 logoHome"
                />
                <h3 className="ms-3">
                  " Tu rilassati, alla spesa ci pensiamo noi. "
                </h3>
              </div>
              <div className=" text-center mt-5  m-auto">
                <div className="text-center text-light">
                  <h1 className="m-0 p-0">
                    {userRole ? (
                      <>
                        {console.log(user.name)}
                        Ciao{" "}
                        <span className="text-light">
                          {user?.name?.split(" ")[0]},
                        </span>{" "}
                        benvenuto su{" "}
                        <img
                          src={logoImg2}
                          alt="Logo SpeedMarket"
                          width={200}
                        />
                      </>
                    ) : (
                      <>
                        Benvenuti su{" "}
                        <img
                          src={logoImg2}
                          alt="Logo SpeedMarket"
                          width={200}
                        />
                      </>
                    )}
                  </h1>
                </div>
                <p className="my-5 fs-5 ">
                  La tua spesa pronta quando lo sei tu. <br />
                  Su <span className="speedMarket">SpeedMarket</span> fai la
                  spesa online in modo semplice, veloce e senza stress. Scegli i
                  prodotti che preferisci, conferma l’ordine e ritira tutto
                  comodamente in negozio, all’orario che ti è più comodo.
                </p>

                <div className="d-flex w-100 mb-5" id="productCarouselHome">
                  {loadingProdotti && (
                    <div className="text-center w-100">
                      <Spinner variant="success"></Spinner>
                      <p className="text-center fs-6">
                        Caricamento prodotti in corso..
                      </p>
                    </div>
                  )}

                  {errore && (
                    <div className=" text-center w-100">
                      <p className="text-danger fw-bold">
                        ❌ Errore nel caricamento dei prodotti..
                      </p>
                    </div>
                  )}

                  {/* Mappatura Prodotti */}
                  {prodotti.map((p) => (
                    <div className="py-1">
                      <div
                        key={p.prodottoId}
                        className="d-flex flex-column justify-content-center px-2"
                      >
                        <img
                          src={`https://localhost:7006${p.immagineFile}`}
                          alt={p.nomeProdotto}
                          className="rounded-4 nuovoProdottoBtn"
                          width={110}
                          height={110}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={"/prodotti"}
                  className="btn btn-success nuovoProdottoBtn mb-5 py-2 px-3"
                >
                  Guarda i nostri prodotti{" "}
                  <i className="bi bi-arrow-right-circle ms-1"></i>
                </Link>

                <p className="fw-semibold fs-5">
                  🛒 Zero code, zero attese. Solo la tua spesa pronta per te.
                </p>
                <p className="homeParag fs-5 mb-5">
                  Con <span className="speedMarket">SpeedMarket</span> risparmi
                  tempo ogni giorno, senza rinunciare alla qualità e alla
                  freschezza di sempre.
                </p>
                <p className="fs-5  ">
                  Esplora le nostre{" "}
                  <span className="speedMarket">categorie</span>:
                </p>
                <div id="categoryCarousel" className="d-flex w-100 mb-5">
                  {loadingCategorie && (
                    <div className="text-center w-100">
                      <Spinner variant="success"></Spinner>
                      <p className="text-center fs-6">
                        Caricamento categorie in corso..
                      </p>
                    </div>
                  )}

                  {erroreCategorie && (
                    <div className="text-center w-100">
                      <p className="text-danger fw-bold">
                        ❌ Errore nel caricamento delle categorie..
                      </p>
                    </div>
                  )}

                  {categorie.map((c) => (
                    <div key={c.categoriaId} className="px-3">
                      <div className="d-flex flex-column">
                        <img
                          src={getCategoriaImage(c.nomeCategoria)}
                          alt={c.nomeCategoria}
                          height={50}
                        />
                        <p>{c.nomeCategoria}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="mt-4 mb-5">
                  Ordina online. Ritira in negozio. Più facile di così?
                </h4>

                <div className="cart-wrapper">
                  <div className="cart">
                    <img src={fastCart} alt="Fast Cart" height={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
