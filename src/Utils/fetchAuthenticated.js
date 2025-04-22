export const fetchAuthenticated = async (url, options = {}) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    console.warn("Token non valido o scaduto. Effettua di nuovo il login.");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore nella richiesta API");
  }

  return response.json();
};
