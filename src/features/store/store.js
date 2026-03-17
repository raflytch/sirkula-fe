import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice";
import greenActionReducer from "../slices/green-action.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    greenAction: greenActionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
