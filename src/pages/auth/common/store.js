import { createSlice } from "@reduxjs/toolkit";

const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
})();

const initialState = {
  user: savedUser,
  isAuth: localStorage.getItem("isAuth") === "true",
  loading: false,
};

const normalizeUser = (payload) => {
  if (!payload) return { name: "User", email: "" };
  if (typeof payload === "string") return { name: payload, email: "" };

  const nested = payload.user && typeof payload.user === "object" ? payload.user : payload;

  return {
    name: nested.name || nested.email || "User",
    email: nested.email || "",
  };
};

export const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    handleLogin: (state, action) => {
      const user = normalizeUser(action.payload);
      state.user = user;
      state.isAuth = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuth", "true");
    },

    handleLogout: (state) => {
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuth");
      localStorage.removeItem("access_token");
    },

    setUser: (state, action) => {
      const user = normalizeUser(action.payload);
      state.user = user;
      state.isAuth = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuth", "true");
    },

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  handleLogin,
  handleLogout,
  setUser,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
