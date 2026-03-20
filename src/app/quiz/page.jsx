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
import {
  Sparkles,
  CheckCircle2,
  Trophy,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";

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

  // Helper: warna grade berdasarkan skor
  const getScoreGrade = (score) => {
    if (score >= 80)
      return {
        label: "Hebat!",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        ring: "bg-emerald-500",
      };
    if (score >= 60)
      return {
        label: "Bagus",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        ring: "bg-blue-500",
      };
    if (score >= 40)
      return {
        label: "Cukup",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        ring: "bg-amber-500",
      };
    return {
      label: "Coba lagi",
      color: "text-zinc-500",
      bg: "bg-zinc-50",
      border: "border-zinc-200",
      ring: "bg-zinc-400",
    };
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

        {/* ── RIWAYAT QUIZ – UI BARU ── */}
        {quiz.status === "idle" && quizHistory.length > 0 && (
          <div className="mt-8">
            {/* Header seksi */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100">
                <Trophy className="w-4 h-4 text-green-700" />
              </div>
              <h2 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
                Riwayat Quiz
              </h2>
              <span className="ml-auto text-xs font-medium text-zinc-400 bg-zinc-100 rounded-full px-2.5 py-0.5">
                {quizHistory.length} sesi
              </span>
            </div>

            <div className="space-y-2.5">
              {quizHistory.map((item, idx) => {
                const grade = getScoreGrade(item.score);
                const pct = Math.round((item.score / totalScrore) * 100);

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-sm ${grade.border}`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${grade.ring} rounded-l-2xl`}
                    />

                    <div className="flex items-center gap-4 px-4 py-3.5 pl-5">
                      <span className="text-xs font-semibold text-zinc-400 w-4 shrink-0 text-center">
                        #{idx + 1}
                      </span>

                      <div className="relative shrink-0">
                        <svg
                          width="44"
                          height="44"
                          viewBox="0 0 44 44"
                          className="-rotate-90"
                        >
                          <circle
                            cx="22"
                            cy="22"
                            r="17"
                            fill="none"
                            stroke="#f4f4f5"
                            strokeWidth="4"
                          />
                          <circle
                            cx="22"
                            cy="22"
                            r="17"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke={
                              pct >= 80
                                ? "#10b981"
                                : pct >= 60
                                  ? "#3b82f6"
                                  : pct >= 40
                                    ? "#f59e0b"
                                    : "#a1a1aa"
                            }
                            strokeDasharray={`${(pct / 100) * 106.8} 106.8`}
                          />
                        </svg>
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${grade.color}`}
                        >
                          {pct}%
                        </span>
                      </div>

                      {/* Info utama */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base font-bold text-zinc-800">
                            {item.score}
                            <span className="text-xs font-normal text-zinc-400">
                              {" "}
                              / {totalScrore}
                            </span>
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${grade.bg} ${grade.color}`}
                          >
                            {grade.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            {item.correctAnswers} benar
                          </span>
                          <span className="text-zinc-300">·</span>
                          <span className="flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-green-500" />
                            {item.points} poin
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="flex items-center gap-1 text-xs text-zinc-400 justify-end">
                          <Clock className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {formatHistoryDate(item.createdAt)}
                          </span>
                          <span className="sm:hidden">
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "short" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
