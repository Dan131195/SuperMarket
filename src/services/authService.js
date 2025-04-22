import { loginSuccess } from "../store/authSlice";

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await fetch("/api/account/login", {
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
    const token = data.token;
    const userPayload = parseJwt(token);

    dispatch(loginSuccess({ user: userPayload, token }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const register = async (formData) => {
  const response = await fetch("/api/account/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Errore nella registrazione");
  }

  return await response.json();
};

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.log(e);
    return null;
  }
}
