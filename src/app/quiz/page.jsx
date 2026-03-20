"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  setQuestions,
  setQuizMeta,
  startQuiz,
  answerQuestion,
  nextQuestion,
  prevQuestion,
  finishQuiz,
  resetQuiz,
  selectQuiz,
} from "@/features/slices/quiz.slice";
import {
  useGenerateQuiz,
  useSubmitQuiz,
  useQuizHistory,
} from "@/hooks/use-quiz";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const generateQuizMutation = useGenerateQuiz();
  const submitQuizMutation = useSubmitQuiz();
  const { data: quizHistoryResponse } = useQuizHistory({ enabled: !!session });
  const initialStatusRef = useRef(quiz.status);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/auth");
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (initialStatusRef.current === "completed") {
      dispatch(resetQuiz());
    }
  }, [dispatch]);

  if (sessionLoading) {
    return <FullscreenLoader text="Memuat data pengguna..." />;
  }

  if (!session) {
    return null;
  }

  const questions = quiz.questions || [];
  const question = questions[quiz.currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion =
    totalQuestions > 0 && quiz.currentQuestionIndex === totalQuestions - 1;

  const handleStart = async () => {
    try {
      const res = await generateQuizMutation.mutateAsync();
      const body = res?.data;
      const data = body?.data;

      const normalizedQuestions = (data?.questions || []).map((q, index) => ({
        id: q.id ?? `q-${q.questionNumber ?? index + 1}`,
        questionNumber: q.questionNumber ?? index + 1,
        question: q.question,
        options: q.options,
      }));

      dispatch(resetQuiz());
      setResult(null);
      dispatch(
        setQuizMeta({
          quizId: data?.quizId,
          material: data?.material ?? null,
        }),
      );
      dispatch(setQuestions(normalizedQuestions));
      dispatch(startQuiz());
    } catch (error) {
      throw error;
    }
  };

  const handleSelectAnswer = (value) => {
    if (!question) return;
    dispatch(
      answerQuestion({
        questionId: question.id,
        answer: value,
      }),
    );
  };

  const handleNextOrFinish = async () => {
    if (!isLastQuestion) {
      dispatch(nextQuestion());
      return;
    }

    try {
      const answersPayload = questions
        .map((q) => ({
          questionNumber: q.questionNumber,
          selectedAnswer: quiz.answers[q.id]
            ? Number(quiz.answers[q.id])
            : undefined,
        }))
        .filter(
          (a) =>
            Number.isInteger(a.questionNumber) &&
            typeof a.selectedAnswer === "number" &&
            !Number.isNaN(a.selectedAnswer),
        );

      const payload = {
        quizId: quiz.quizId,
        answers: answersPayload,
      };

      const submitRes = await submitQuizMutation.mutateAsync(payload);
      const body = submitRes?.data;
      const data = body?.data;

      setResult(data || null);
      dispatch(finishQuiz());
    } catch (error) {
      throw error;
    }
  };

  const handleResetToIdle = () => {
    dispatch(resetQuiz());
    setResult(null);
  };

  const hasAnsweredCurrent = question
    ? Boolean(quiz.answers[question.id])
    : false;

  const isLoadingGenerate = generateQuizMutation.isPending;
  const isSubmitting = submitQuizMutation.isPending;
  const totalScrore = 100;

  const quizHistory = quizHistoryResponse?.data || [];

  const formatHistoryDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[60vh] py-10">
      <div className="container max-w-xl mx-auto px-4">
        {quiz.status === "idle" && (
          <Card className="border shadow-none bg-white">
            <CardHeader className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 mb-1">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-semibold text-green-800">
                Quiz Green Action
              </CardTitle>
              <CardDescription className="text-sm text-zinc-600">
                Uji pemahamanmu tentang aksi hijau. Jawabanmu akan disimpan di
                perangkat ini selama sesi berlangsung.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                onClick={handleStart}
                className="px-6"
                size="lg"
                disabled={isLoadingGenerate}
              >
                {isLoadingGenerate ? "Memuat soal..." : "Mulai Quiz"}
              </Button>
            </CardContent>
          </Card>
        )}

        {quiz.status === "idle" && quizHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-semibold text-zinc-800 mb-3">
              Riwayat Quiz
            </h2>
            <div className="space-y-3">
              {quizHistory.map((item) => (
                <Card
                  key={item.id}
                  className="border shadow-none bg-white text-sm"
                >
                  <CardContent className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-zinc-800">
                        Skor: {item.score} / {totalScrore}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Jawaban benar: {item.correctAnswers} • Poin:{" "}
                        {item.points}
                      </p>
                    </div>
                    <div className="text-xs text-zinc-500 text-right whitespace-nowrap">
                      {formatHistoryDate(item.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {quiz.status === "in_progress" && question && (
          <Card className="border shadow-none bg-white">
            <CardHeader className="space-y-3">
              <CardTitle className="text-lg font-semibold text-green-800">
                Soal {quiz.currentQuestionIndex + 1}
              </CardTitle>
              <CardDescription className="text-sm text-zinc-700">
                {question.question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={quiz.answers[question.id] || ""}
                onValueChange={handleSelectAnswer}
              >
                {question.options.map((option, index) => {
                  const value = String(index);
                  return (
                    <Label
                      key={value}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-zinc-50 hover:bg-zinc-100 cursor-pointer text-sm"
                    >
                      <RadioGroupItem value={value} />
                      <span>{option}</span>
                    </Label>
                  );
                })}
              </RadioGroup>

              <div className="pt-2 flex justify-between">
                {quiz.currentQuestionIndex > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => dispatch(prevQuestion())}
                  >
                    Sebelumnya
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  type="button"
                  disabled={!hasAnsweredCurrent || isSubmitting}
                  onClick={handleNextOrFinish}
                >
                  {isLastQuestion
                    ? isSubmitting
                      ? "Mengirim..."
                      : "Selesai"
                    : "Selanjutnya"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {quiz.status === "completed" && (
          <Card className="border shadow-none bg-white">
            <CardHeader className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-semibold text-emerald-800">
                Quiz Selesai
              </CardTitle>
              <CardDescription className="text-sm text-zinc-600">
                Terima kasih sudah mengikuti quiz green action. Jawabanmu tetap
                tersimpan selama kamu belum menutup browser ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result && (
                <div className="text-sm text-zinc-700 space-y-1 text-center">
                  <p>
                    Skor kamu:{" "}
                    <span className="font-semibold">{result.score}</span>
                  </p>
                  <p>
                    Jawaban benar:{" "}
                    <span className="font-semibold">
                      {result.correctAnswers}
                    </span>
                  </p>
                  <p>
                    Poin didapat:{" "}
                    <span className="font-semibold">{result.points}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button type="button" onClick={handleResetToIdle}>
                  Ulangi Quiz
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/reedem")}
                >
                  Lihat Tukar Poin
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
