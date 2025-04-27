import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/img/logo3.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantita, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoImg} alt="Logo Market" className="logoImg" />
        </Link>

        {/* Toggler per mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list text-light"></i>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="d-flex justify-content-between align-items-baseline align-items-md-center w-100">
            <ul className="navbar-nav">
              <li className="nav-item d-inline linkNavBar">
                <Link
                  className="nav-link text-light linkNavBar d-inline"
                  to="/"
                >
                  <i className="bi bi-house-door me-1"></i>Home
                </Link>
              </li>
              <li className="nav-item d-inline linkNavBar">
                <Link
                  className="nav-link text-light linkNavBar d-inline"
                  to="/prodotti"
                >
                  <i className="bi bi-list-ul me-1"></i>Prodotti
                </Link>
              </li>

              {isAuthenticated && (
                <li className="nav-item d-inline linkNavBar ">
                  <hr className="d-md-none border-white m-0 border-4 mb-3" />
                  <Link
                    className="nav-link text-light linkNavBar d-inline position-relative mt-2"
                    to="/carrello"
                  >
                    <i className="bi bi-cart4 me-1"></i>Carrello
                    <span className="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  </Link>
                </li>
              )}
            </ul>

            {/* Login / Profilo */}
            <div className="d-flex align-items-center">
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="bg-transparent text-light border-0 dropdown-toggle linkNavBar"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-fill me-1"></i>
                    {user?.name || "Profilo"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end profileLink border-white">
                    <li className="profileLink">
                      <Link
                        className="dropdown-item profileLink profileLinkHover"
                        to="/profilo"
                      >
                        <i className="bi bi-person-lines-fill"></i> Il mio
                        profilo
                      </Link>
                    </li>
                    <li className="profileLink">
                      <Link
                        className="dropdown-item profileLink profileLinkHover"
                        to="/storico-ordini"
                      >
                        <i className="bi bi-bag-check-fill"></i> I miei ordini
                      </Link>
                    </li>
                    <li className="profileLink border-top border-1">
                      <button
                        className="dropdown-item text-danger fw-bold profileLinkHover"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-person-fill-slash fs-5"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
