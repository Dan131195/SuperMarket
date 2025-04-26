/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fastCart from "../assets/img/fastCart2.png";

const Carrello = () => {
  const [carrello, setCarrello] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  console.log(token);
  const userId = useSelector((state) => state.auth.user?.id);
  console.log(userId);

  const baseUrl = "https://localhost:7006/api/carrello";

  const mostraMessaggio = (msg) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 3000);
  };

  const caricaCarrello = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${userId}`);
      if (!res.ok) throw new Error("Errore nel recupero carrello");
      const data = await res.json();
      setCarrello(data);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantita: nuovaQuantita }),
      });
      if (!res.ok) throw new Error("Errore nella modifica quantità");
      mostraMessaggio("Quantità aggiornata ✅");
      await caricaCarrello();
    } catch (error) {
      console.error(error);
    }
  };

  const rimuoviProdotto = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore nella rimozione");
      mostraMessaggio("Prodotto rimosso dal carrello ❌");
      await caricaCarrello();
    } catch (error) {
      console.error(error);
    }
  };

  const svuotaCarrello = async () => {
    try {
      const res = await fetch(`${baseUrl}/svuota/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore nello svuotamento");
      mostraMessaggio("Carrello svuotato 🧹");
      await caricaCarrello();
    } catch (error) {
      console.error(error);
    }
  };

  const checkout = () => {
    navigate("/checkout");
  };

  // const confermaOrdine = async () => {
  //   try {
  //     const res = await fetch("https://localhost:7006/api/ordine/conferma", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ userId: userId }),
  //     });

  //     if (!res.ok) throw new Error("Errore durante la conferma dell'ordine");

  //     mostraMessaggio("✅ Ordine confermato con successo!");

  //     await caricaCarrello();
  //     navigate("/checkout");
  //   } catch (error) {
  //     console.error(error);
  //     mostraMessaggio("❌ Errore nella conferma ordine");
  //   }
  // };

  useEffect(() => {
    document.title = "SpeedMarket - Carrello";
    if (userId) {
      caricaCarrello();
    }
  }, [userId]);

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
        <div className="alert alert-info text-center">Il carrello è vuoto.</div>
      ) : (
        <>
          <div className="table-responsive carrelloTableContainer pb-3">
            <table className="table table-hover align-middle rounded shadow">
              <thead className="table-light">
                <tr>
                  <th className="carrelloTable text-light">Prodotto</th>
                  <th className="text-center text-light carrelloTable">
                    Quantità
                  </th>
                  <th className="text-end text-light carrelloTable">Prezzo</th>
                  <th className="text-end text-light carrelloTable">Totale</th>
                  <th className="text-end text-light carrelloTable"></th>
                </tr>
              </thead>
              <tbody>
                {carrello.map((item) => (
                  <tr key={item.prodottoCarrelloId}>
                    <td className="d-flex align-items-center gap-3">
                      <img
                        src={`https://localhost:7006${item.immagineFile}`}
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
                    </td>
                    <td className="text-end">
                      € {item.prezzoUnitario.toFixed(2)}
                    </td>
                    <td className="text-end">
                      € {(item.quantita * item.prezzoUnitario).toFixed(2)}
                    </td>
                    <td className="text-end">
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

          <div className="d-flex justify-content-between align-items-center mt-4 gap-2">
            <h4 className="text-start text-white w-100">
              Totale: <span>€ {totale.toFixed(2)}</span>
            </h4>
            <button className="btn btn-danger" onClick={svuotaCarrello}>
              <i className="bi bi-cart-x"></i> Svuota carrello
            </button>

            <button
              className="btn btn-success"
              onClick={checkout}
              disabled={carrello.length === 0}
            >
              <i className="bi bi-bag-check"></i> Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrello;
