const Footer = () => {
  return (
    <footer className=" text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-3 mb-md-0">
          <span className="fw-bold">SpeedMarket</span> ©{" "}
          {new Date().getFullYear()} — Tutti i diritti riservati
        </div>

        <div>
          <a href="/privacy" className="text-light text-decoration-none me-3">
            Privacy
          </a>
          <a href="/termini" className="text-light text-decoration-none me-3">
            Termini
          </a>
          <a href="/contatti" className="text-light text-decoration-none">
            Contatti
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
