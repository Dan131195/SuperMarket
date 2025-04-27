/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Checkout = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  const userId = useSelector((state) => state.auth.user?.id);

  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [oraRitiro, setOraRitiro] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [oraMinima, setOraMinima] = useState("");

  useEffect(() => {
    document.title = "SpeedMarket - Checkout";

    const now = new Date();
    now.setHours(now.getHours() + 1);

    const formattedTime = now.toISOString().substring(11, 16);
    setOraMinima(formattedTime);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardNumber || !expiration || !cvv || !oraRitiro) {
      setMessaggio("⚠️ Compila tutti i campi prima di procedere!");
      return;
    }
    const now = new Date();
    const [hours, minutes] = oraRitiro.split(":");

    const selectedPickupTime = new Date();
    selectedPickupTime.setHours(parseInt(hours, 10));
    selectedPickupTime.setMinutes(parseInt(minutes, 10));
    selectedPickupTime.setSeconds(0);
    selectedPickupTime.setMilliseconds(0);

    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // ora + 1 ora

    if (selectedPickupTime < oneHourLater) {
      setMessaggio(
        "⚠️ L'orario di ritiro deve essere almeno un'ora dopo l'orario attuale!"
      );
      return;
    }

    try {
      const oraRitiroCompleto = selectedPickupTime.toISOString();

      const res = await fetch("https://localhost:7006/api/ordine/conferma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oraRitiro: oraRitiroCompleto }),
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
    <div className="container mt-5 p-4 shadow rounded loginCard">
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
        <input
          type="time"
          className="form-control"
          value={oraRitiro}
          onChange={(e) => setOraRitiro(e.target.value)}
          min={oraMinima}
          required
        />

        <button type="submit" className="btn btn-success w-100 mt-3">
          Conferma Ordine
        </button>
      </form>
    </div>
  );
};

export default Checkout;
