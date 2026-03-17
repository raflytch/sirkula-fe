"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Calendar,
  Shield,
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
import { images } from "@/lib/constanst";
import { useSession, useGetAllUsers, useGetUserById } from "@/hooks/use-auth";
import FullscreenLoader from "@/components/ui/fullscreen-loader";

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
        return "bg-red-100 text-red-800";
      case "DLH":
        return "bg-blue-100 text-blue-800";
      case "UMKM":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
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

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <Skeleton className="h-8 sm:h-9 w-32 sm:w-40 mb-4 sm:mb-6" />
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 sm:h-7 w-40 sm:w-48" />
              <Skeleton className="h-4 w-32 sm:w-36" />
            </div>
          </div>
          <Card className="border shadow-none">
            <CardHeader className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32 sm:w-40" />
                    <Skeleton className="h-4 w-24 sm:w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 sm:h-10 w-28 sm:w-32" />
                    <Skeleton className="h-9 sm:h-10 w-20 sm:w-24" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                      <Skeleton className="h-3 w-full max-w-[150px]" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session || session.role !== "ADMIN") {
    return null;
  }

  const users = usersData?.data || [];
  const pagination = usersData?.meta || { total: 0, totalPages: 1 };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-6 w-fit"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Kembali ke Beranda
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Image
            src={images.logo}
            alt="Sirkula Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">
              Dashboard Admin
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Kelola pengguna platform
            </p>
          </div>
        </div>

        <Card className="border shadow-none">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Daftar Pengguna
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Total {pagination.total || 0} pengguna terdaftar
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-28 sm:w-32 md:w-36 border text-xs sm:text-sm">
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
                    <SelectTrigger className="w-20 sm:w-24 md:w-28 border text-xs sm:text-sm">
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
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {usersLoading ? (
              <div className="space-y-3">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                              <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0" />
                              <div className="space-y-1.5 min-w-0">
                                <Skeleton className="h-3.5 sm:h-4 w-24 sm:w-32" />
                                <Skeleton className="h-3 w-28 sm:w-40" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <Skeleton className="h-5 w-14 sm:w-16" />
                          </TableCell>
                          <TableCell className="py-3">
                            <Skeleton className="h-5 w-12 sm:w-14" />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3">
                            <Skeleton className="h-4 w-8 sm:w-10" />
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3">
                            <Skeleton className="h-4 w-20 sm:w-24" />
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
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                            className="text-center py-8 text-xs sm:text-sm"
                          >
                            Tidak ada data pengguna
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                                  <AvatarImage
                                    src={user.avatarUrl}
                                    alt={user.name}
                                  />
                                  <AvatarFallback className="bg-green-100 text-green-800 text-[10px] sm:text-xs">
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
                                className={`${getRoleBadgeColor(
                                  user.role
                                )} hover:opacity-80 text-[10px] sm:text-xs`}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3">
                              {user.isActive ? (
                                <Badge
                                  variant="outline"
                                  className="border-green-500 text-green-600 text-[10px] sm:text-xs"
                                >
                                  Aktif
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="border-red-500 text-red-600 text-[10px] sm:text-xs"
                                >
                                  Nonaktif
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-xs sm:text-sm py-3">
                              {user.totalPoints || 0}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-xs sm:text-sm py-3">
                              {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="text-right py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetail(user.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      className="h-8 text-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Prev</span>
                    </Button>
                    <div className="text-xs sm:text-sm font-medium px-2">
                      {page}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(pagination.totalPages || 1, p + 1)
                        )
                      }
                      disabled={page >= (pagination.totalPages || 1)}
                      className="h-8 text-xs"
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
                <div className="flex items-center gap-3 sm:gap-4">
                  <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32 sm:w-40" />
                    <Skeleton className="h-4 w-16 sm:w-20" />
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
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-14 w-14 sm:h-16 sm:w-16 shrink-0">
                    <AvatarImage
                      src={userDetail.data.avatarUrl}
                      alt={userDetail.data.name}
                    />
                    <AvatarFallback className="bg-green-100 text-green-800 text-lg sm:text-xl">
                      {getInitials(userDetail.data.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">
                      {userDetail.data.name}
                    </h3>
                    <Badge
                      className={`${getRoleBadgeColor(
                        userDetail.data.role
                      )} hover:opacity-80 text-xs`}
                    >
                      {userDetail.data.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="break-all">{userDetail.data.email}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>
                      {userDetail.data.isEmailVerified
                        ? "Email Terverifikasi"
                        : "Email Belum Diverifikasi"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>
                      Bergabung {formatDate(userDetail.data.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
