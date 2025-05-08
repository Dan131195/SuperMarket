import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "./store/authSlice";

import "./App.css";

import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Prodotti from "./components/Prodotti";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Carrello from "./components/Carrello";
import Checkout from "./components/Checkout";
import StoricoOrdini from "./components/StoricoOrdini";
import Error from "./components/Error";
import Profilo from "./components/Profilo";
import RegisterAdmin from "./components/RegisterAdmin";
import StoricoOrdiniLista from "./components/StoricoOrdiniLista";
import ListaProfili from "./components/ListaProfili";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      dispatch(setCredentials(JSON.parse(storedUserData)));
    }
  }, [dispatch]);

  return (
    <div className="root">
      <BrowserRouter>
        <NavBar />

        <div className="main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrazione" element={<Register />} />
            <Route path="/registra-admin" element={<RegisterAdmin />} />

            <Route path="/" element={<Home />} />
            <Route path="/prodotti" element={<Prodotti />} />

            <Route path="/carrello" element={<Carrello />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/storico-ordini" element={<StoricoOrdini />} />
            <Route
              path="/storico-ordini-lista"
              element={<StoricoOrdiniLista />}
            />

            <Route path="/profilo" element={<Profilo />} />
            <Route path="/lista-profili" element={<ListaProfili />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
