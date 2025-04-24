/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import fastCart from "../assets/img/fastCart2.png";

const Carrello = () => {
  const [carrello, setCarrello] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const userId = useSelector((state) => state.auth.user?.id);

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
      setLoading(false);
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

  useEffect(() => {
    if (userId) {
      caricaCarrello();
    }
  }, []);

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
        <div className="text-center my-5">
          <Spinner
            animation="border"
            variant="success"
            style={{ width: "4rem", height: "4rem" }}
          />
        </div>
      ) : carrello.length === 0 ? (
        <div className="alert alert-info text-center">Il carrello è vuoto.</div>
      ) : (
        <>
          <div className="table-responsive carrelloTableContainer pb-3">
            <table className="table table-hover align-middle  rounded shadow ">
              <thead className="table-light">
                <tr className="">
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
                  <tr key={item.prodottoCarrelloId} className="trCarrello">
                    <td className="d-flex align-items-center gap-3">
                      <div className="d-flex flex-column flex-md-row align-items-md-center ">
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
                        <span>{item.nomeProdotto}</span>
                      </div>
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

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button className="btn btn-danger" onClick={svuotaCarrello}>
              <i className="bi bi-cart-x"></i> Svuota carrello
            </button>
            <h4 className="text-end text-white">
              Tot: <span className="">€ {totale.toFixed(2)}</span>
            </h4>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrello;
