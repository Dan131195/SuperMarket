import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Checkout = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [oraRitiro, setOraRitiro] = useState("");
  const [messaggio, setMessaggio] = useState("");

  useEffect(() => {
    document.title = "SpeedMarket - Checkout";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardNumber || !expiration || !cvv || !oraRitiro) {
      setMessaggio("⚠️ Compila tutti i campi prima di procedere!");
      return;
    }

    try {
      const res = await fetch("https://localhost:7006/api/ordine/conferma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Mandiamo il token!
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Errore durante la conferma dell'ordine");

      setMessaggio("✅ Ordine confermato! Sarai reindirizzato...");
      setTimeout(() => {
        navigate("/storico-ordini");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessaggio("❌ Errore nel checkout, riprova.");
    }
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-white">
      <h2 className="mb-4 text-center">Checkout</h2>

      {messaggio && (
        <div className="alert alert-info text-center">{messaggio}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Dati pagamento */}
        <div className="mb-3">
          <label className="form-label">Numero Carta</label>
          <input
            type="text"
            className="form-control"
            maxLength={16}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Data di Scadenza</label>
            <input
              type="text"
              className="form-control"
              placeholder="MM/YY"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">CVV</label>
            <input
              type="text"
              className="form-control"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Ora ritiro */}
        <div className="mb-4">
          <label className="form-label">Orario di Ritiro</label>
          <input
            type="time"
            className="form-control"
            value={oraRitiro}
            onChange={(e) => setOraRitiro(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Conferma Ordine
        </button>
      </form>
    </div>
  );
};

export default Checkout;
