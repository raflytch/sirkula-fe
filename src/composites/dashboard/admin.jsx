"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Calendar,
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Award,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession, useGetAllUsers, useGetUserById } from "@/hooks/use-auth";
import { useFlaggedActions } from "@/hooks/use-green-actions";

export default function AdminDashboardComposite() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: usersData, isLoading: usersLoading } = useGetAllUsers({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const { data: userDetail, isLoading: detailLoading } =
    useGetUserById(selectedUserId);

  const { data: flaggedData } = useFlaggedActions();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "DLH":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "UMKM":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-teal-50 text-teal-700 border-teal-200";
    }
  };

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId);
    setDetailDialogOpen(true);
  };

  useEffect(() => {
    if (!sessionLoading && session && session.role !== "ADMIN") {
      router.push("/");
    }
  }, [sessionLoading, session, router]);

  const users = usersData?.data || [];
  const pagination = usersData?.meta || { total: 0, totalPages: 1 };
  const totalFlagged = flaggedData?.total || 0;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {sessionLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-7 sm:h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-slate-200/80">
                  <CardContent className="p-5">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-slate-200/80">
              <CardHeader className="p-4 sm:p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-28 mt-1" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg"
                    >
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-14" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : !session || session.role !== "ADMIN" ? null : (
          <>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                  <LayoutDashboard className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Dashboard Admin
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Kelola pengguna dan monitoring platform
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <Card className="border-slate-200/80 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Total Pengguna
                      </p>
                      <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Users className="h-4 w-4 text-sky-600" />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {pagination.total || 0}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Link href="/dashboard/admin/flagged">
                  <Card className="border-amber-200/60 bg-white/80 backdrop-blur-sm hover:border-amber-300 transition-colors cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Aksi Flagged
                        </p>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                        {totalFlagged}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <div>
                <Card className="border-slate-200/80 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Halaman
                      </p>
                      <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                        <Award className="h-4 w-4 text-violet-600" />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {page}/{pagination.totalPages || 1}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-slate-200/80 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Users className="w-4.5 h-4.5 text-sky-600" />
                      Daftar Pengguna
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Total {pagination.total || 0} pengguna terdaftar
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-28 sm:w-32 border-slate-200 text-xs sm:text-sm">
                        <SelectValue placeholder="Urutkan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Terbaru</SelectItem>
                        <SelectItem value="asc">Terlama</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={limit.toString()}
                      onValueChange={(v) => setLimit(Number(v))}
                    >
                      <SelectTrigger className="w-20 sm:w-24 border-slate-200 text-xs sm:text-sm">
                        <SelectValue placeholder="Limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {usersLoading ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-slate-200/80 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/50">
                            <TableHead className="text-xs sm:text-sm">
                              Pengguna
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm">
                              Role
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm">
                              Status
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                              Poin
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                              Tanggal Daftar
                            </TableHead>
                            <TableHead className="text-right text-xs sm:text-sm">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...Array(limit)].map((_, i) => (
                            <TableRow key={i}>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                                  <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-40" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <Skeleton className="h-5 w-16" />
                              </TableCell>
                              <TableCell className="py-3">
                                <Skeleton className="h-5 w-14" />
                              </TableCell>
                              <TableCell className="hidden sm:table-cell py-3">
                                <Skeleton className="h-4 w-10" />
                              </TableCell>
                              <TableCell className="hidden md:table-cell py-3">
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell className="text-right py-3">
                                <Skeleton className="h-8 w-8 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-slate-200/80 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/50">
                            <TableHead className="text-xs sm:text-sm">
                              Pengguna
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm">
                              Role
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm">
                              Status
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                              Poin
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                              Tanggal Daftar
                            </TableHead>
                            <TableHead className="text-right text-xs sm:text-sm">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-8 text-xs sm:text-sm text-muted-foreground"
                              >
                                Tidak ada data pengguna
                              </TableCell>
                            </TableRow>
                          ) : (
                            users.map((user) => (
                              <TableRow
                                key={user.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <Avatar className="h-9 w-9 shrink-0">
                                      <AvatarImage
                                        src={user.avatarUrl}
                                        alt={user.name}
                                      />
                                      <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-medium">
                                        {getInitials(user.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                      <p className="font-medium text-xs sm:text-sm truncate">
                                        {user.name}
                                      </p>
                                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge
                                    className={`${getRoleBadgeColor(user.role)} hover:opacity-90 text-[10px] sm:text-xs`}
                                  >
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                  {user.isActive ? (
                                    <Badge
                                      variant="outline"
                                      className="border-emerald-300 text-emerald-600 bg-emerald-50/50 text-[10px] sm:text-xs"
                                    >
                                      Aktif
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="border-rose-300 text-rose-600 bg-rose-50/50 text-[10px] sm:text-xs"
                                    >
                                      Nonaktif
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-xs sm:text-sm py-3 font-medium">
                                  {user.totalPoints || 0}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-xs sm:text-sm py-3 text-muted-foreground">
                                  {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className="text-right py-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDetail(user.id)}
                                    className="h-8 w-8 p-0 hover:bg-sky-50 hover:text-sky-600"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Halaman {page} dari {pagination.totalPages || 1}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="h-8 text-xs border-slate-200"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Prev</span>
                        </Button>
                        <div className="text-xs sm:text-sm font-medium px-3 py-1 rounded-md bg-slate-100">
                          {page}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) =>
                              Math.min(pagination.totalPages || 1, p + 1),
                            )
                          }
                          disabled={page >= (pagination.totalPages || 1)}
                          className="h-8 text-xs border-slate-200"
                        >
                          <span className="hidden sm:inline mr-1">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Detail Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Informasi lengkap pengguna
            </DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : userDetail?.data ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 shrink-0">
                  <AvatarImage
                    src={userDetail.data.avatarUrl}
                    alt={userDetail.data.name}
                  />
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-lg">
                    {getInitials(userDetail.data.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">
                    {userDetail.data.name}
                  </h3>
                  <Badge
                    className={`${getRoleBadgeColor(userDetail.data.role)} hover:opacity-90 text-xs mt-1`}
                  >
                    {userDetail.data.role}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs sm:text-sm p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <span className="break-all text-slate-700">
                    {userDetail.data.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  <span className="text-slate-700">
                    {userDetail.data.isEmailVerified
                      ? "Email Terverifikasi"
                      : "Email Belum Diverifikasi"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-slate-700">
                    Bergabung {formatDate(userDetail.data.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
