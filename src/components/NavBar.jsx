import { Link } from "react-router-dom";
import logoImg from "../assets/img/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logoImg} alt="Logo Market" className="logoImg" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="">
            <i className="bi bi-list text-light"></i>
          </span>
        </button>
        <div className="collapse navbar-collapse " id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-between align-items-center w-100">
            <div className="d-flex justify-content-between justify-content-md-start w-75 w-50-lg align-items-center order-1">
              <li className="nav-item">
                <Link
                  className="nav-link text-light"
                  aria-current="page"
                  to="/"
                >
                  <i className="bi bi-house-door me-1"></i>Home
                </Link>
              </li>
              <li className="nav-item ms-lg-0 ms-2">
                <Link to="/prodotti" className="nav-link text-light">
                  <i className="bi bi-list-ul me-1"></i>Prodotti
                </Link>
              </li>
              <li className="nav-item ms-lg-0 ms-2">
                <Link to="/prodotti" className="nav-link text-light">
                  <i className="bi bi-cart4 me-1"></i>Carrello
                </Link>
              </li>
            </div>

            <div className="btn-group order-2 order-lg-3 d-inline">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className="bg-transparent text-light border-0 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-fill"></i>{" "}
                    {user?.name || "Profilo"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profilo">
                        Il mio profilo
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/ordini">
                        I miei ordini
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </button>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
