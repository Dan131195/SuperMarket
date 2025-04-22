import { useEffect } from "react";
import fruttaVerdura from "../assets/img/fruttaVerdura.png";
import logoImg from "../assets/img/logo.png";
import promo2X1 from "../assets/img/promo2X1.png";
import { Link } from "react-router-dom";

const Home = () => {
  const getRandomColor = () => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#3f51b5",
      "#03a9f4",
      "#4caf50",
      "#ff9800",
      "#ffeb3b",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    document.title = "SpeedMarket - Home";
  }, []);

  return (
    <div className="homeContainer d-flex align-items-center justify-content-center text-white">
      <div className="container text-center my-2 my-lg-4 my-xl-0">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
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
              <div className="position-relative text-center mt-4  m-auto">
                <div className="confetti-wrapper position-absolute top-0 start-0 w-100 h-100 pointer-events-none overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span
                      className="confetti"
                      key={i}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: getRandomColor(),
                      }}
                    />
                  ))}
                </div>

                <h1 className="m-0 p-0 text-center text-light">
                  🎉 Benvenuti su SpeedMarket! 🎉
                </h1>
                <p className="lead mt-4">
                  La tua spesa pronta quando lo sei tu. <br />
                  Su SpeedMarket fai la spesa online in modo semplice, veloce e
                  senza stress. Scegli i prodotti che preferisci, conferma
                  l’ordine e ritira tutto comodamente in negozio, all’orario che
                  ti è più comodo.
                </p>
                <p className="fw-semibold">
                  🛒 Zero code, zero attese. Solo la tua spesa pronta per te.
                </p>
                <p>
                  Con SpeedMarket risparmi tempo ogni giorno, senza rinunciare
                  alla qualità e alla freschezza di sempre.
                </p>
                <h5 className="mt-4">
                  Ordina online. Ritira in negozio. Più facile di così?
                </h5>
              </div>

              <div className="row mt-5 gy-4">
                <div className="col-12 col-lg-6">
                  <div className="card bg-light h-100 shadow-sm rounded-4 promos">
                    <div className="card-body">
                      <h4 className="card-title">🤑 Offerta Speciale</h4>
                      <p className="card-text d-flex align-items-center">
                        <img
                          src={fruttaVerdura}
                          alt="Frutta e Verdura"
                          className=" w-25 rounded-4"
                        />
                        <p className="p-0 m-0 ms-1">
                          Approfitta della promozione del giorno: -30% su frutta
                          e verdura fresca!
                        </p>
                      </p>
                      <Link className="btn btn-success mt-3" to="/prodotti">
                        Scopri di più
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6 ">
                  <div className="card bg-light h-100 shadow-sm rounded-4 promos">
                    <div className="card-body">
                      <h4 className="card-title">🔥 Super Sconto</h4>

                      <p className="card-text d-flex align-items-center">
                        <img
                          src={promo2X1}
                          alt="Frutta e Verdura"
                          className=" w-25"
                        />
                        <p className="p-0 m-0 ms-1">
                          Solo per oggi: 2x1 su prodotti per la colazione. Non
                          fartelo scappare!
                        </p>
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
      </div>
    </div>
  );
};

export default Home;
