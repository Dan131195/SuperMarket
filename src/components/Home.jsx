import { useEffect } from "react";
import fruttaVerdura from "../assets/img/fruttaVerdura.png";
import logoImg from "../assets/img/logo.png";
import logoImg2 from "../assets/img/logo3.png";
import fastCart from "../assets/img/fastCart2.png";
import promo2X1 from "../assets/img/promo2X1.png";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    document.title = "SpeedMarket - Home";
  }, []);

  return (
    <div className="homeContainer d-flex align-items-center justify-content-center text-white">
      <div className="container text-center my-2 my-lg-4 my-xl-0">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-9">
            <div className="p-4 p-md-5 rounded-4 my-2 shadow-lg homeOpacity">
              <div className="text-center d-flex align-items-center justify-content-center">
                <img
                  src={logoImg}
                  id="fastCartImg"
                  className="rounded-3 logoHome"
                />
                <h3 className="ms-2">
                  "Tu rilassati, alla spesa ci pensiamo noi."
                </h3>
                {/* <img src={fastCartImg} id="fastCartImg" /> */}
              </div>
              <div className=" text-center mt-4  m-auto">
                <h1 className="m-0 p-0 text-center text-light">
                  Benvenuti su{" "}
                  <img src={logoImg2} alt="Logo SpeedMarket" width={150} />
                </h1>
                <p className="mt-4 fs-4">
                  La tua spesa pronta quando lo sei tu. <br />
                  Su <span className="speedMarket">SpeedMarket</span> fai la
                  spesa online in modo semplice, veloce e senza stress. Scegli i
                  prodotti che preferisci, conferma l’ordine e ritira tutto
                  comodamente in negozio, all’orario che ti è più comodo.
                </p>
                <p className="fw-semibold fs-5">
                  🛒 Zero code, zero attese. Solo la tua spesa pronta per te.
                </p>
                <p className="homeParag fs-5">
                  Con <span className="speedMarket">SpeedMarket</span> risparmi
                  tempo ogni giorno, senza rinunciare alla qualità e alla
                  freschezza di sempre.
                </p>
                <h4 className="mt-4">
                  Ordina online. Ritira in negozio. Più facile di così?
                </h4>
                <div class="cart-wrapper">
                  <div class="cart">
                    <img src={fastCart} alt="Fast Cart" height={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-0 col-12 col-lg-3 mx-auto justify-content-center">
            <div className="col-md-10 col-lg-12 p-2">
              <div className="card bg-light h-100 shadow-sm rounded-4 promos">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h4 className="card-title">🤑 Offerta Speciale</h4>
                  <p className="card-text d-flex align-items-center">
                    <span className="d-flex justify-content-between align-items-center flex-lg-column">
                      <img
                        src={fruttaVerdura}
                        alt="Frutta e Verdura"
                        className=" w-25 rounded-4 mb-lg-2"
                      />
                      <p className="p-0 m-0 ms-1">
                        Approfitta della promozione del giorno: -30% su frutta e
                        verdura fresca!
                      </p>
                    </span>
                  </p>
                  <Link className="btn btn-success mt-3" to="/prodotti">
                    Scopri di più
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-10 col-lg-12 p-2">
              <div className="card bg-light h-100 shadow-sm rounded-4 promos">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h4 className="card-title">🔥 Super Sconto</h4>
                  <p className="card-text d-flex align-items-center">
                    <span className="d-flex justify-content-between align-items-center flex-lg-column">
                      <img
                        src={promo2X1}
                        alt="Frutta e Verdura"
                        className=" w-25"
                      />
                      <p className="p-0 m-0 ms-1">
                        Solo per oggi: 2x1 su prodotti per la colazione. Non
                        fartelo scappare!
                      </p>
                    </span>
                  </p>
                  <Link className="btn btn-warning mt-3" to="/prodotti">
                    Vedi dettagli
                  </Link>
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
