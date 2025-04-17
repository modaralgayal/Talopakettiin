import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    userSlice: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([]),
});

setupListeners(store.dispatch);
