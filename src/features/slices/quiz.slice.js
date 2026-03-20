import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  currentQuestionIndex: 0,
  answers: {},
  doubts: {},
  questions: [],
  quizId: null,
  material: null,
  result: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    hydrateQuiz: (_state, action) => {
      return { ...initialState, ...action.payload };
    },
    setQuestions: (state, action) => {
      state.questions = action.payload || [];
    },
    setQuizMeta: (state, action) => {
      const { quizId, material } = action.payload || {};
      state.quizId = quizId || null;
      state.material = material || null;
    },
    showMaterial: (state) => {
      state.status = "material";
    },
    startQuiz: (state) => {
      state.status = "in_progress";
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.doubts = {};
    },
    answerQuestion: (state, action) => {
      const { questionNumber, answer } = action.payload;
      state.answers[questionNumber] = answer;
    },
    toggleDoubt: (state, action) => {
      const questionNumber = action.payload;
      state.doubts[questionNumber] = !state.doubts[questionNumber];
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    finishQuiz: (state, action) => {
      state.status = "completed";
      state.result = action.payload || null;
    },
    resetQuiz: () => initialState,
  },
});

export const {
  hydrateQuiz,
  setQuestions,
  setQuizMeta,
  showMaterial,
  startQuiz,
  answerQuestion,
  toggleDoubt,
  setCurrentQuestionIndex,
  finishQuiz,
  resetQuiz,
} = quizSlice.actions;

export const selectQuiz = (state) => state.quiz;

export default quizSlice.reducer;
