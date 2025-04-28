import { createSlice } from "@reduxjs/toolkit";
import icon1 from "../assets/images/icon-1.png"; // importa il default

const initialState = {
  token: null,
  user: null,
  profileIcon: icon1, // 👈 aggiunto
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.profileIcon = icon1; // resetta icona al logout
    },
    setProfileIcon: (state, action) => {
      state.profileIcon = action.payload;
    },
  },
});

export const { setCredentials, logout, setProfileIcon } = authSlice.actions;

export default authSlice.reducer;
