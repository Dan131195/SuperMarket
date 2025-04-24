import { loginSuccess } from "../store/authSlice";

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await fetch("https://localhost:7006/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Credenziali non valide");
    }

    const data = await response.json();

    const { token, userId, email, roles } = data;

    dispatch(
      loginSuccess({
        token,
        user: {
          id: userId,
          email,
          roles,
        },
      })
    );
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

    console.log("Response status:", response.status);

    const responseText = await response.clone().text(); // per debug
    console.log("Raw response text:", responseText);

    if (response.status !== 200) {
      throw new Error(responseText || "Errore nella registrazione");
    }

    return JSON.parse(responseText); // invece di response.json()
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    throw error;
  }
};
