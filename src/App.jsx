import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Prodotti from "./components/Prodotti";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Carrello from "./components/Carrello";

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
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
