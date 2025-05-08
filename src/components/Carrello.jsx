/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCart } from "../store/cartSlice";
import fastCart from "../assets/img/fastCart2.png";
import emptyCart from "../assets/img/empty-cart.png";
import giftCard from "../assets/img/gift.png";

const Carrello = () => {
  const [carrello, setCarrello] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [msgSuccess, setMsgSuccess] = useState({});
  const [msgError, setMsgError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const baseUrl = "https://supermarketstoreapi.azurewebsites.net/api/carrello";

  const caricaCarrello = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Errore nel recupero carrello");
      const data = await res.json();
      setCarrello(data);
      dispatch(setCart(data));
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  const modificaQuantita = async (id, nuovaQuantita) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantita: nuovaQuantita }),
      });
      if (!res.ok) throw new Error("Errore nella modifica quantità");

      await caricaCarrello();

      setMsgSuccess((prev) => ({ ...prev, [id]: true }));

      setTimeout(() => {
        setMsgSuccess((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const rimuoviProdotto = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Errore nella rimozione");
      // mostraMessaggio("Prodotto rimosso dal carrello ❌");
      await caricaCarrello();
    } catch (error) {
      console.error(error);
    }
  };

  const svuotaCarrello = async () => {
    try {
      const res = await fetch(`${baseUrl}/svuota/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Errore nello svuotamento");
      await caricaCarrello();
    } catch (error) {
      console.error(error);
    }
  };

  const checkout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    document.title = "SpeedMarket - Carrello";

    if (!token || !userId) {
      navigate("/login");
    } else {
      setCarrello([]);
      dispatch(setCart([]));
      caricaCarrello();
    }
  }, [token, userId]);

  const totale = carrello.reduce(
    (sum, item) => sum + item.quantita * item.prezzoUnitario,
    0
  );

  return (
    <div className="container p-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="m-0 text-light">Il tuo Carrello</h2>
        <img src={fastCart} alt="" width={70} className="ms-2" />
      </div>

      {alert && (
        <div className="alert alert-success text-center" role="alert">
          {alert}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5 fw-bolder">
          <Spinner
            animation="border"
            variant="success"
            style={{ width: "7rem", height: "7rem" }}
            className="display-1 "
          />
        </div>
      ) : carrello.length === 0 ? (
        <div className="p-lg-5 pt-lg-0">
          <div className="text-center d-flex flex-column flex-md-row  justify-content-center align-items-center">
            <p className="d-md-none fw-semibold text-white text-center ps-2 emptyCart">
              Ops, il carrello è vuoto..
            </p>
            <img
              src={emptyCart}
              alt="Il Carre è vuoto"
              width={350}
              className=""
            />
            <div className="w-50">
              <p className="d-none d-md-block fw-semibold text-white text-center ps-2 emptyCart">
                Ops, il carrello è vuoto..
              </p>
              <Link
                to="/prodotti"
                className="btn btn-success py-2 px-4 m-auto mt-2 nuovoProdottoBtn "
                width={300}
              >
                Vai a Prodotti
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column flex-lg-row">
          <div
            className="table-responsive carrelloTableContainer pb-3 col-12 col-lg-8"
            id="carrelloTableList"
          >
            <table
              className="table table-borderless align-middle rounded shadow"
              id=""
            >
              <thead className="table-light p-2 p-md-0">
                {/* SOLO MOBILE */}
                <tr className="d-flex d-md-none">
                  <th className="p-2 w-100 text-start text-light bg-transparent">
                    Prodotti
                  </th>
                </tr>

                {/* SOLO DESKTOP */}
                <tr className="d-none d-md-table-row">
                  <th className="carrelloTable text-light">Prodotto</th>
                  <th className="text-center text-light carrelloTable">
                    Quantità
                  </th>
                  <th className="text-end text-light carrelloTable">Prezzo</th>
                  <th className="text-end text-light carrelloTable">Totale</th>
                  <th className="text-end text-light carrelloTable"></th>
                </tr>
              </thead>

              {/* Prodotti */}
              <tbody id="">
                {carrello.map((item) => (
                  <tr key={item.prodottoCarrelloId}>
                    <td className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start text-center text-md-starts  gap-3">
                      <img
                        src={`https://supermarketstoreapi.azurewebsites.net${item.immagineFile}`}
                        alt={item.nomeProdotto}
                        className="rounded"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      {item.nomeProdotto}
                    </td>
                    <td className="text-center" style={{ maxWidth: 70 }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <input
                          type="number"
                          min={1}
                          className="form-control form-control-sm text-center"
                          value={item.quantita}
                          onChange={(e) =>
                            modificaQuantita(
                              item.prodottoCarrelloId,
                              parseInt(e.target.value)
                            )
                          }
                        />
                        {msgSuccess[item.prodottoCarrelloId] && (
                          <p className="text-success text-start mt-1 mb-0 msgSuccess">
                            <i className="bi bi-check2-circle text-success ms-1"></i>
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="d-md-none">
                      <div
                        className="d-flex flex-column justify-content-center h-100"
                        style={{ minHeight: "80px" }}
                      >
                        <p className="m-0">
                          € {(item.quantita * item.prezzoUnitario).toFixed(2)}
                        </p>
                      </div>
                    </td>

                    <td className="text-end d-none d-md-table-cell">
                      €{item.prezzoUnitario.toFixed(2)}
                    </td>
                    <td className="text-end d-none d-md-table-cell">
                      €{(item.quantita * item.prezzoUnitario).toFixed(2)}
                    </td>

                    <td className="text-center ">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => rimuoviProdotto(item.prodottoCarrelloId)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-12 col-lg-4 mt-lg-5 ps-2">
            <div className="text-white text-start text-lg-end mt-4">
              <span>EasyGift </span>
              <img src={giftCard} alt="" className="text-end" />
              <h5 className="ms-xl-2 ps-xl-2 ps-xxl-3 text-lg-end">
                Non hai un codice promo ?
              </h5>

              <p className="ms-lg-2 ms-xl-3 ms-xxl-5">
                Richiedi un codice card EasyGift comodamente da casa tua.
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-center flex-lg-column justify-content-lg-around mt-4 gap-2 text-end">
              <div className="text-start text-lg-end w-100 mt-lg-5">
                <button
                  className="btn btn-danger me-1"
                  onClick={svuotaCarrello}
                >
                  <i className="bi bi-cart-x"></i> Svuota
                </button>

                <button
                  className="btn btn-success"
                  onClick={checkout}
                  disabled={carrello.length === 0}
                >
                  <i className="bi bi-bag-check"></i> Checkout
                </button>
              </div>

              <h4 className="text-end text-white w-100 mt-lg-3">
                Totale: <span>€ {totale.toFixed(2)}</span>
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrello;
