import { setCredentials } from "../store/authSlice";
import { clearCart } from "../store/cartSlice";
import { logoutUser } from "../store/authSlice";

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await fetch("https://localhost:7006/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Credenziali non valide");

    const data = await response.json();
    const { token, userId, email, roles } = data;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const name =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const userData = {
      token,
      user: {
        id: userId,
        email,
        roles,
        name,
      },
    };

    dispatch(setCredentials(userData));
    localStorage.setItem("userData", JSON.stringify(userData));
  } catch (error) {
    console.error("Errore login:", error);
    throw error;
  }
};

export const register = async (formData) => {
  try {
    const response = await fetch("http://localhost:5073/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const responseText = await response.clone().text();

    if (!response.ok) {
      throw new Error(responseText || "Errore nella registrazione");
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logoutUser());
  dispatch(clearCart());
};
