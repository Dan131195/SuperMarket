import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/img/logo3.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { setCart } from "../store/cartSlice";
import { useEffect } from "react";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantita, 0);

  let payload = null;
  let userRole = null;

  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
      userRole =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log(userRole);
    } catch (error) {
      console.error("Token non valido", error);
    }
  }

  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !user?.id) return;

      try {
        const res = await fetch(
          `https://supermarketstoreapi.azurewebsites.net/api/carrello/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          dispatch(setCart(data));
        } else {
          console.error("Errore caricamento carrello");
        }
      } catch (error) {
        console.error("Errore fetch carrello:", error);
      }
    };

    fetchCart();
  }, [token, user?.id, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");

    dispatch(logoutUser());
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
        <div
          className="collapse navbar-collapse mt-2 m-md-0"
          id="navbarSupportedContent"
        >
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
                    <span className="me-1">
                      {user?.name?.split(" ")[0] || "Profilo"}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end profileLink border-white">
                    {userRole === "Admin" || userRole === "SuperAdmin" ? (
                      <>
                        {userRole === "SuperAdmin" && (
                          <li className="profileLink">
                            <Link
                              className="dropdown-item profileLink profileLinkHover"
                              to="/registra-admin"
                            >
                              <i className="bi bi-person-fill-add"></i> Registra
                              Admin
                            </Link>
                          </li>
                        )}

                        <li className="profileLink">
                          <Link
                            className="dropdown-item profileLink profileLinkHover"
                            to="/lista-profili"
                          >
                            <i className="bi bi-person-lines-fill"></i> Lista
                            clienti
                          </Link>
                        </li>
                        <Link
                          className="dropdown-item profileLink profileLinkHover"
                          to="/storico-ordini-lista"
                        >
                          <i className="bi bi-bag-check-fill"></i> Ordini
                        </Link>
                      </>
                    ) : (
                      <>
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
                            <i className="bi bi-bag-check-fill"></i> I miei
                            ordini
                          </Link>
                        </li>
                      </>
                    )}

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
