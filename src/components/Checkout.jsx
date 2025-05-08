/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import cvvIcon from "../assets/icons/cvv.png";

const Checkout = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.items);
  console.log(cartItems.length);

  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [oraRitiro, setOraRitiro] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [messaggio1, setMessaggio1] = useState(false);
  const [messaggio2, setMessaggio2] = useState(false);
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

    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    if (parseInt(hours, 10) < 8 || parseInt(hours, 10) >= 20) {
      setMessaggio1(true);
      return;
    } else {
      setMessaggio1(false);
    }

    if (selectedPickupTime < oneHourLater) {
      setMessaggio2(true);
      return;
    } else {
      setMessaggio2(false);
    }

    try {
      const oraRitiroCompleto = selectedPickupTime.toISOString();

      const res = await fetch(
        "https://supermarketstoreapi.azurewebsites.net/api/ordine/conferma",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oraRitiro: oraRitiroCompleto }),
        }
      );

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

  if (!cartItems || cartItems.length < 1) {
    navigate("/prodotti");
    return null;
  }

  return (
    <div className="container mt-5 p-4 shadow rounded loginCard">
      <h2 className="mb-4 text-center">Checkout</h2>

      {messaggio && (
        <div className="alert alert-info text-center">{messaggio}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-credit-card"></i> Numero Carta
          </label>
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
            <label className="form-label">
              <i className="bi bi-credit-card-2-front"></i> Data di Scadenza
            </label>
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
            <img src={cvvIcon} alt="Cvv" width={20} />
            <label className="form-label ms-1">Cvv</label>
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

        <div>
          <label className="form-label">
            <i className="bi bi-clock-history"></i> Ora Ritiro
          </label>
          <input
            type="time"
            className="form-control"
            value={oraRitiro}
            onChange={(e) => setOraRitiro(e.target.value)}
            min={oraMinima}
            required
          />
        </div>
        {messaggio1 && (
          <p className="mt-1 mb-0 text-danger">
            ⚠️ L'orario deve essere tra le ore 08:00 e le ore 20:00
          </p>
        )}
        {messaggio2 && (
          <p className="text-danger">
            ⚠️ L'orario di ritiro deve essere almeno un'ora dopo l'orario
            attuale!
          </p>
        )}

        <button type="submit" className="btn btn-success w-100 mt-3">
          Conferma Ordine
        </button>
      </form>
    </div>
  );
};

export default Checkout;
