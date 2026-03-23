"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Award,
  Eye,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useFlaggedActions,
  useApproveFlaggedAction,
  useRejectFlaggedAction,
} from "@/hooks/use-green-actions";
import { useSession } from "@/hooks/use-auth";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

function FlaggedCardSkeleton() {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminFlaggedComposite() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: flaggedData, isLoading: flaggedLoading } = useFlaggedActions();
  const approveMutation = useApproveFlaggedAction();
  const rejectMutation = useRejectFlaggedAction();

  const [selectedAction, setSelectedAction] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    actionId: null,
  });

  useEffect(() => {
    if (!sessionLoading && session && session.role !== "ADMIN") {
      router.push("/");
    }
  }, [sessionLoading, session, router]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleApprove = (id) => {
    setConfirmDialog({ open: true, type: "approve", actionId: id });
  };

  const handleReject = (id) => {
    setConfirmDialog({ open: true, type: "reject", actionId: id });
  };

  const confirmAction = () => {
    const { type, actionId } = confirmDialog;
    if (type === "approve") {
      approveMutation.mutate(actionId, {
        onSettled: () =>
          setConfirmDialog({ open: false, type: null, actionId: null }),
      });
    } else {
      rejectMutation.mutate(actionId, {
        onSettled: () =>
          setConfirmDialog({ open: false, type: null, actionId: null }),
      });
    }
  };

  const flaggedActions = flaggedData?.data || [];
  const totalFlagged = flaggedData?.total || 0;
  const isPending = approveMutation.isPending || rejectMutation.isPending;

  if (sessionLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <FlaggedCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-6 w-6 text-amber-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Anti-Cheat System
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Review aksi yang ditandai mencurigakan oleh sistem
              </p>
            </div>
            {totalFlagged > 0 && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm px-3 py-1 w-fit">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                {totalFlagged} aksi ditandai
              </Badge>
            )}
          </div>

          {flaggedLoading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <FlaggedCardSkeleton key={i} />
              ))}
            </div>
          ) : flaggedActions.length === 0 ? (
            <Card className="border-slate-200/80 bg-white/60 backdrop-blur-sm">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-medium text-slate-900 mb-1">
                    Tidak ada aksi mencurigakan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Semua aksi hijau dalam kondisi normal
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <AnimatePresence>
                {flaggedActions.map((action, i) => (
                  <motion.div
                    key={action.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    layout
                  >
                    <Card className="border-amber-200/60 bg-white/80 backdrop-blur-sm hover:border-amber-300 transition-colors h-full">
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={action.user?.avatarUrl} />
                              <AvatarFallback className="bg-amber-100 text-amber-700 text-sm font-medium">
                                {getInitials(action.user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-slate-900 truncate">
                                    {action.user?.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {action.user?.email}
                                  </p>
                                </div>
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] shrink-0">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Flagged
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-slate-100"
                              >
                                {action.category?.replace(/_/g, " ")}
                              </Badge>
                              <span>
                                {action.quantity} {action.actionType}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-2">
                              {action.description}
                            </p>
                          </div>

                          {action.flagReason && (
                            <div className="rounded-lg bg-amber-50/80 border border-amber-100 p-3">
                              <p className="text-[11px] font-medium text-amber-700 mb-0.5">
                                Alasan Flag
                              </p>
                              <p className="text-xs text-amber-800 leading-relaxed">
                                {action.flagReason}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {action.locationName && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {action.locationName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(action.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <Award className="h-3.5 w-3.5" />
                              {action.points} poin
                              {action.pointsHeld && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] ml-1 border-amber-300 text-amber-600"
                                >
                                  Ditahan
                                </Badge>
                              )}
                            </span>
                            <span className="text-slate-500">
                              AI Score: {action.aiScore}%
                            </span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-slate-200 hover:bg-slate-50"
                              onClick={() => {
                                setSelectedAction(action);
                                setDetailOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Detail
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleApprove(action.id)}
                              disabled={isPending}
                            >
                              {approveMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 text-xs"
                              onClick={() => handleReject(action.id)}
                              disabled={isPending}
                            >
                              {rejectMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Detail Aksi Flagged
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap aksi yang ditandai mencurigakan
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedAction.user?.avatarUrl} />
                  <AvatarFallback className="bg-amber-100 text-amber-700 text-sm font-medium">
                    {getInitials(selectedAction.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {selectedAction.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAction.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Kategori
                  </p>
                  <p className="text-sm font-medium">
                    {selectedAction.category?.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Kuantitas
                  </p>
                  <p className="text-sm font-medium">
                    {selectedAction.quantity} {selectedAction.actionType}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Poin
                  </p>
                  <p className="text-sm font-medium text-emerald-600">
                    {selectedAction.points}
                    {selectedAction.pointsHeld && " (ditahan)"}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    AI Score
                  </p>
                  <p className="text-sm font-medium">
                    {selectedAction.aiScore}%
                  </p>
                </div>
              </div>

              {selectedAction.description && (
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    Deskripsi
                  </p>
                  <p className="text-sm text-slate-700">
                    {selectedAction.description}
                  </p>
                </div>
              )}

              {selectedAction.aiFeedback && (
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <p className="text-[11px] font-medium text-slate-500 mb-1">
                    AI Feedback
                  </p>
                  <p className="text-sm text-slate-700">
                    {selectedAction.aiFeedback}
                  </p>
                </div>
              )}

              {selectedAction.flagReason && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-[11px] font-medium text-amber-700 mb-1">
                    Alasan Flag
                  </p>
                  <p className="text-sm text-amber-800">
                    {selectedAction.flagReason}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {selectedAction.locationName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedAction.locationName}
                    {selectedAction.city ? `, ${selectedAction.city}` : ""}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(selectedAction.createdAt)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    handleApprove(selectedAction.id);
                    setDetailOpen(false);
                  }}
                  disabled={isPending}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    handleReject(selectedAction.id);
                    setDetailOpen(false);
                  }}
                  disabled={isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open)
            setConfirmDialog({ open: false, type: null, actionId: null });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmDialog.type === "approve" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Approve Aksi?
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-600" />
                  Reject Aksi?
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "approve"
                ? "Aksi akan disetujui dan poin akan dirilis ke pengguna. Tindakan ini tidak dapat dibatalkan."
                : "Aksi akan ditolak dan poin tidak akan diberikan. Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={isPending}
              className={
                confirmDialog.type === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {confirmDialog.type === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
