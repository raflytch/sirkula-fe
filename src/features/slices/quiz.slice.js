import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle", // "in_progress" | "completed"
  currentQuestionIndex: 0,
  answers: {},
  questions: [],
  quizId: null,
  material: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload || [];
    },
    setQuizMeta: (state, action) => {
      const { quizId, material } = action.payload || {};
      state.quizId = quizId || null;
      state.material = material || null;
    },
    startQuiz: (state) => {
      state.status = "in_progress";
      state.currentQuestionIndex = 0;
      state.answers = {};
    },
    answerQuestion: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    finishQuiz: (state) => {
      state.status = "completed";
    },
    resetQuiz: () => initialState,
  },
});

export const {
  setQuestions,
  setQuizMeta,
  startQuiz,
  answerQuestion,
  setCurrentQuestionIndex,
  nextQuestion,
  prevQuestion,
  finishQuiz,
  resetQuiz,
} = quizSlice.actions;

export const selectQuiz = (state) => state.quiz;

export default quizSlice.reducer;
