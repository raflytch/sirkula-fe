import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice";
import greenActionReducer from "../slices/green-action.slice";
import quizReducer from "../slices/quiz.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    greenAction: greenActionReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
