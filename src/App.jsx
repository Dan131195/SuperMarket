import { Routes, Route, BrowserRouter } from "react-router-dom";
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

function App() {
  return (
    <div className="root">
      <BrowserRouter>
        <NavBar />

        <div className="main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Home />} />
            <Route path="/prodotti" element={<Prodotti />} />

            <Route path="/carrello" element={<Carrello />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/storico-ordini" element={<StoricoOrdini />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
