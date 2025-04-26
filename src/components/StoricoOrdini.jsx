import { useEffect } from "react";

const StoricoOrdini = () => {
  useEffect(() => {
    document.title = "SpeedMarket - Checkout";
  }, []);

  return (
    <div>
      <h2 className="text-light">Storico Ordini</h2>
    </div>
  );
};

export default StoricoOrdini;
