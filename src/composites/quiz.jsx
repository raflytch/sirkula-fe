"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "@/hooks/use-auth";
import {
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
  selectQuiz,
} from "@/features/slices/quiz.slice";
import {
  useGenerateQuiz,
  useSubmitQuiz,
  useQuizHistory,
} from "@/hooks/use-quiz";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { SparklesText } from "@/components/ui/sparkles-text";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PiSparkle,
  PiCheckCircle,
  PiXCircle,
  PiTrophy,
  PiStar,
  PiClock,
  PiCaretRight,
  PiCaretLeft,
  PiBookOpen,
  PiQuestion,
  PiWarning,
  PiPaperPlaneRight,
  PiLeaf,
  PiMedal,
  PiEye,
  PiPlay,
} from "react-icons/pi";

const STORAGE_KEY = "sirkula-quiz-state";

function HistorySkeleton() {
  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto">
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function QuizComposite() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const generateQuizMutation = useGenerateQuiz();
  const submitQuizMutation = useSubmitQuiz();
  const { data: quizHistoryResponse, isLoading: historyLoading } =
    useQuizHistory({ enabled: !!session });
  const [showDoubtWarning, setShowDoubtWarning] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [reviewingMaterial, setReviewingMaterial] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/auth");
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.status &&
          parsed.status !== "idle" &&
          parsed.questions?.length > 0
        ) {
          dispatch(hydrateQuiz(parsed));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [dispatch]);

  useEffect(() => {
    if (quiz.status !== "idle") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));
      } catch {}
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [quiz]);

  if (!mounted) return null;
  if (sessionLoading)
    return <FullscreenLoader text="Memuat data pengguna..." />;
  if (!session) return null;

  const questions = quiz.questions || [];
  const question = questions[quiz.currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLoadingGenerate = generateQuizMutation.isPending;
  const isSubmitting = submitQuizMutation.isPending;

  if (isLoadingGenerate) return <FullscreenLoader text="Menyiapkan quiz..." />;
  if (isSubmitting) return <FullscreenLoader text="Mengirim jawaban..." />;

  const handleGenerateClick = () => {
    setShowGenerateConfirm(true);
  };

  const handleGenerate = async () => {
    setShowGenerateConfirm(false);
    try {
      const res = await generateQuizMutation.mutateAsync();
      const data = res?.data?.data;

      const normalizedQuestions = (data?.questions || []).map((q, idx) => ({
        questionNumber: q.questionNumber ?? idx + 1,
        question: q.question,
        options: q.options,
      }));

      dispatch(resetQuiz());
      dispatch(
        setQuizMeta({
          quizId: data?.quizId,
          material: data?.material ?? null,
        }),
      );
      dispatch(setQuestions(normalizedQuestions));
      dispatch(showMaterial());
    } catch {}
  };

  const handleStartQuiz = () => {
    setShowStartConfirm(true);
  };

  const confirmStartQuiz = () => {
    setShowStartConfirm(false);
    dispatch(startQuiz());
  };

  const handleSelectAnswer = (value) => {
    if (!question) return;
    dispatch(
      answerQuestion({
        questionNumber: question.questionNumber,
        answer: Number(value),
      }),
    );
  };

  const handleToggleDoubt = () => {
    if (!question) return;
    dispatch(toggleDoubt(question.questionNumber));
  };

  const handleNext = () => {
    if (quiz.currentQuestionIndex < totalQuestions - 1) {
      dispatch(setCurrentQuestionIndex(quiz.currentQuestionIndex + 1));
    }
  };

  const handlePrev = () => {
    if (quiz.currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(quiz.currentQuestionIndex - 1));
    }
  };

  const handleSubmit = async () => {
    const hasDoubts = questions.some((q) => quiz.doubts[q.questionNumber]);
    if (hasDoubts) {
      setShowDoubtWarning(true);
      return;
    }

    const unanswered = questions.filter(
      (q) => quiz.answers[q.questionNumber] === undefined,
    );
    if (unanswered.length > 0) {
      toast.error(`Masih ada ${unanswered.length} soal yang belum dijawab`);
      return;
    }

    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);
    await doSubmit();
  };

  const doSubmit = async () => {
    try {
      const answersPayload = questions
        .map((q) => ({
          questionNumber: q.questionNumber,
          selectedAnswer: quiz.answers[q.questionNumber],
        }))
        .filter((a) => typeof a.selectedAnswer === "number");

      const payload = { quizId: quiz.quizId, answers: answersPayload };
      const submitRes = await submitQuizMutation.mutateAsync(payload);
      const data = submitRes?.data?.data;
      dispatch(finishQuiz(data || null));
    } catch {}
  };

  const handleResetToIdle = () => {
    dispatch(resetQuiz());
  };

  const quizHistory = quizHistoryResponse?.data || [];

  const answeredCount = questions.filter(
    (q) => quiz.answers[q.questionNumber] !== undefined,
  ).length;
  const doubtedCount = questions.filter(
    (q) => quiz.doubts[q.questionNumber],
  ).length;

  const formatHistoryDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        color: "text-teal-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
        ring: "bg-teal-500",
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
    <div className="min-h-[60vh] py-6 sm:py-10">
      <div className="container max-w-2xl mx-auto px-4">
        {quiz.status === "idle" && (
          <>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <PiSparkle className="h-7 w-7 text-emerald-600" />
                <SparklesText
                  colors={{ first: "#10b981", second: "#14b8a6" }}
                  className="text-2xl sm:text-3xl font-bold"
                  sparklesCount={6}
                >
                  <AuroraText
                    colors={["#10b981", "#14b8a6", "#0ea5e9", "#10b981"]}
                    className="text-2xl sm:text-3xl font-bold"
                    speed={1.5}
                  >
                    Quiz Green Action
                  </AuroraText>
                </SparklesText>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Uji pemahamanmu tentang aksi hijau! Baca materi terlebih dahulu,
                kemudian jawab soal-soal quiz untuk mendapatkan poin.
              </p>
            </div>

            <Card className="border shadow-none overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-emerald-100 p-4">
                    <div className="rounded-full bg-emerald-50 p-2.5">
                      <PiBookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 text-center">
                      Baca Materi
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-teal-100 p-4">
                    <div className="rounded-full bg-teal-50 p-2.5">
                      <PiQuestion className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 text-center">
                      Jawab Soal
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-100 p-4">
                    <div className="rounded-full bg-amber-50 p-2.5">
                      <PiTrophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 text-center">
                      Raih Poin
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerateClick}
                    className="px-8 bg-emerald-600 hover:bg-emerald-700"
                    size="lg"
                    disabled={isLoadingGenerate}
                  >
                    <PiLeaf className="w-4 h-4" />
                    Mulai Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            {historyLoading && <HistorySkeleton />}

            {!historyLoading && quizHistory.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100">
                    <PiTrophy className="w-4 h-4 text-emerald-700" />
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
                    const pct = Math.round((item.score / 100) * 100);
                    return (
                      <div
                        key={item.id}
                        className={`relative rounded-2xl border overflow-hidden transition-colors ${grade.border}`}
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
                                      ? "#14b8a6"
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
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base font-bold text-zinc-800">
                                {item.score}
                                <span className="text-xs font-normal text-zinc-400">
                                  {" "}
                                  / 100
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
                                <PiStar className="w-3 h-3 text-amber-400" />
                                {item.correctAnswers}/{item.totalQuestions}{" "}
                                benar
                              </span>
                              <span className="text-zinc-300">Â·</span>
                              <span className="flex items-center gap-1">
                                <PiCaretRight className="w-3 h-3 text-emerald-500" />
                                {item.points} poin
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="flex items-center gap-1 text-xs text-zinc-400 justify-end">
                              <PiClock className="w-3 h-3" />
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
          </>
        )}

        {(quiz.status === "material" ||
          (quiz.status === "in_progress" && reviewingMaterial)) && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <PiBookOpen className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Materi Bacaan
              </span>
            </div>

            <Card className="border shadow-none overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-zinc-800">
                  {quiz.material?.title || "Materi Quiz"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                  {quiz.material?.content
                    ?.replace(/\*\*(.*?)\*\*/g, "$1")
                    .replace(/\*(.*?)\*/g, "$1")
                    .replace(/^#{1,6}\s+/gm, "")
                    .replace(/^[-*+]\s+/gm, "â€¢ ")
                    .replace(/`(.*?)`/g, "$1")}
                </div>

                {quiz.material?.keyPoints?.length > 0 && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                      <PiLeaf className="w-4 h-4" />
                      Poin Penting
                    </h3>
                    <ul className="space-y-1.5">
                      {quiz.material.keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-zinc-700"
                        >
                          <PiCheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  {reviewingMaterial ? (
                    <Button
                      onClick={() => setReviewingMaterial(false)}
                      className="px-8 bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      <PiCaretLeft className="w-4 h-4" />
                      Kembali ke Soal
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStartQuiz}
                      className="px-8 bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      <PiSparkle className="w-4 h-4" />
                      Mulai Mengerjakan Quiz
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {quiz.status === "in_progress" && !reviewingMaterial && question && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {answeredCount}/{totalQuestions} dijawab
              </span>
              {doubtedCount > 0 && (
                <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                  <PiWarning className="w-3 h-3" />
                  {doubtedCount} ragu-ragu
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === quiz.currentQuestionIndex;
                const isAnswered = quiz.answers[q.questionNumber] !== undefined;
                const isDoubted = quiz.doubts[q.questionNumber];
                return (
                  <button
                    key={q.questionNumber}
                    type="button"
                    onClick={() => dispatch(setCurrentQuestionIndex(idx))}
                    className={cn(
                      "w-9 h-9 rounded-lg text-xs font-semibold transition-all border",
                      isCurrent && "ring-2 ring-emerald-500 ring-offset-1",
                      isDoubted
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : isAnswered
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "border-zinc-200 text-zinc-400 hover:border-zinc-300",
                    )}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>

            <Card className="border shadow-none">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {question.questionNumber}
                    </span>
                    <CardTitle className="text-base font-semibold text-zinc-800">
                      Soal {question.questionNumber}
                    </CardTitle>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {quiz.currentQuestionIndex + 1} / {totalQuestions}
                  </span>
                </div>
                <CardDescription className="text-sm text-zinc-700 leading-relaxed">
                  {question.question}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={
                    quiz.answers[question.questionNumber] !== undefined
                      ? String(quiz.answers[question.questionNumber])
                      : ""
                  }
                  onValueChange={handleSelectAnswer}
                >
                  {question.options.map((option, index) => {
                    const value = String(index);
                    const isSelected =
                      quiz.answers[question.questionNumber] === index;
                    return (
                      <Label
                        key={value}
                        className={cn(
                          "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-sm transition-colors",
                          isSelected
                            ? "border-emerald-300 bg-emerald-50/60"
                            : "border-zinc-200 hover:border-zinc-300",
                        )}
                      >
                        <RadioGroupItem value={value} />
                        <span>{option}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="doubt"
                    checked={!!quiz.doubts[question.questionNumber]}
                    onCheckedChange={handleToggleDoubt}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <Label
                    htmlFor="doubt"
                    className="text-sm text-zinc-600 cursor-pointer select-none flex items-center gap-1.5"
                  >
                    <PiWarning className="w-3.5 h-3.5 text-amber-500" />
                    Ragu-Ragu
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={quiz.currentQuestionIndex === 0}
                className="gap-1.5"
              >
                <PiCaretLeft className="w-4 h-4" />
                Sebelumnya
              </Button>

              {quiz.currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  onClick={handleNext}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  Selanjutnya
                  <PiCaretRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  <PiPaperPlaneRight className="w-4 h-4" />
                  Selesai & Kirim
                </Button>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setReviewingMaterial(true)}
                className="gap-1.5 text-emerald-700 hover:text-emerald-800"
                size="sm"
              >
                <PiEye className="w-4 h-4" />
                Lihat Materi
              </Button>
            </div>
          </div>
        )}

        {quiz.status === "completed" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto mb-4">
                <PiMedal className="w-8 h-8" />
              </div>
              <SparklesText
                colors={{ first: "#10b981", second: "#14b8a6" }}
                className="text-2xl sm:text-3xl font-bold mb-1"
                sparklesCount={5}
              >
                Quiz Selesai!
              </SparklesText>
              <p className="text-sm text-muted-foreground">
                Berikut hasil quiz kamu
              </p>
            </div>

            {quiz.result && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="border shadow-none text-center p-4">
                    <p className="text-2xl font-bold text-emerald-600">
                      {quiz.result.score}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Skor</p>
                  </Card>
                  <Card className="border shadow-none text-center p-4">
                    <p className="text-2xl font-bold text-teal-600">
                      {quiz.result.correctAnswers}/{quiz.result.totalQuestions}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Benar</p>
                  </Card>
                  <Card className="border shadow-none text-center p-4">
                    <p className="text-2xl font-bold text-amber-600">
                      {quiz.result.points}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Poin</p>
                  </Card>
                </div>

                {quiz.result.details?.length > 0 && (
                  <Card className="border shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-zinc-700">
                        Detail Jawaban
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quiz.result.details.map((d) => (
                        <div
                          key={d.questionNumber}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl border text-sm",
                            d.isCorrect
                              ? "border-emerald-200 bg-emerald-50/40"
                              : "border-red-200 bg-red-50/40",
                          )}
                        >
                          {d.isCorrect ? (
                            <PiCheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          ) : (
                            <PiXCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-zinc-800">
                              {d.questionNumber}. {d.question}
                            </p>
                            {!d.isCorrect && (
                              <p className="text-xs text-zinc-500 mt-1">
                                Jawabanmu: opsi {d.selectedAnswer + 1} Â· Benar:
                                opsi {d.correctAnswer + 1}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
                  <Button
                    onClick={handleResetToIdle}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Ulangi Quiz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/reedem")}
                  >
                    Lihat Tukar Poin
                  </Button>
                </div>
              </>
            )}
            {!quiz.result && (
              <div className="flex justify-center">
                <Button onClick={handleResetToIdle}>Kembali</Button>
              </div>
            )}
          </div>
        )}

        <AlertDialog open={showDoubtWarning} onOpenChange={setShowDoubtWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <PiWarning className="w-5 h-5 text-amber-500" />
                Masih Ada Soal Ragu-Ragu
              </AlertDialogTitle>
              <AlertDialogDescription>
                Kamu masih menandai {doubtedCount} soal sebagai ragu-ragu. Hapus
                semua tanda ragu-ragu terlebih dahulu sebelum mengirim jawaban.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowDoubtWarning(false)}
              >
                Mengerti
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={showGenerateConfirm}
          onOpenChange={setShowGenerateConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <PiPlay className="w-5 h-5 text-emerald-500" />
                Mulai Quiz Baru?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Quiz akan di-generate oleh AI. Apakah kamu yakin ingin memulai
                quiz baru?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleGenerate}
              >
                Ya, Mulai
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showStartConfirm} onOpenChange={setShowStartConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <PiSparkle className="w-5 h-5 text-emerald-500" />
                Mulai Mengerjakan?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah kamu yakin sudah memahami materi dan siap memulai quiz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={confirmStartQuiz}
              >
                Ya, Mulai
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={showSubmitConfirm}
          onOpenChange={setShowSubmitConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <PiPaperPlaneRight className="w-5 h-5 text-emerald-500" />
                Kirim Jawaban?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah kamu yakin ingin menyelesaikan dan mengirim semua jawaban
                quiz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={confirmSubmit}
              >
                Ya, Kirim
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
