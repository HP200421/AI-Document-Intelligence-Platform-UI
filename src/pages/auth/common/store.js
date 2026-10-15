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

const nameFromEmail = (email) => {
  const localPart = email?.split("@")[0];
  if (!localPart) return "";

  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const getUserDisplayName = (user) => {
  if (user?.name && user.name !== "User" && user.name !== "Account") {
    return user.name;
  }

  return nameFromEmail(user?.email) || "Account";
};

const normalizeUser = (payload) => {
  if (!payload) return { name: "Account", email: "" };
  if (typeof payload === "string") return { name: payload, email: "" };

  const nested =
    payload.user && typeof payload.user === "object"
      ? payload.user
      : payload.data && typeof payload.data === "object"
        ? payload.data
        : payload;
  const email = nested.email || payload.email || "";

  return {
    name:
      nested.name ||
      nested.full_name ||
      payload.name ||
      nameFromEmail(email) ||
      "Account",
    email,
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
