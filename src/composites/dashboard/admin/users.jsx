"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Calendar,
  Shield,
  Search,
  Filter,
  Trash2,
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
import FullscreenLoader from "@/components/ui/fullscreen-loader";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useSession,
  useGetAllUsers,
  useGetUserById,
  useDeleteUser,
} from "@/hooks/use-auth";

export default function AdminUsersComposite() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsers({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const { data: userDetail, isLoading: detailLoading } =
    useGetUserById(selectedUserId);

  const deleteMutation = useDeleteUser();

  useEffect(() => {
    if (!sessionLoading && session && session.role !== "ADMIN") {
      router.push("/");
    }
  }, [sessionLoading, session, router]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "DLH":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "UMKM":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId);
    setDetailDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        },
      });
    }
  };

  if (sessionLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
            <Skeleton className="h-4 w-32 sm:w-40" />
          </div>
          <Card className="border shadow-none">
            <CardHeader className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32 sm:w-40" />
                    <Skeleton className="h-4 w-24 sm:w-32" />
                  </div>
                  <Skeleton className="h-9 sm:h-10 w-full sm:w-32" />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Skeleton className="h-10 w-full sm:flex-1" />
                  <Skeleton className="h-10 w-full sm:w-32 md:w-40" />
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
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                      <Skeleton className="h-3 w-full max-w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-16" />
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

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <>
      {deleteMutation.isPending && (
        <FullscreenLoader text="Menghapus user..." />
      )}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800">
              Manajemen Pengguna
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Kelola semua pengguna platform Sirkula
            </p>
          </div>

          {/* Main Card */}
          <Card className="border shadow-none">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                      <SelectTrigger className="w-24 sm:w-32 md:w-36 border text-xs sm:text-sm">
                        <SelectValue placeholder="Urutkan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Terbaru</SelectItem>
                        <SelectItem value="asc">Terlama</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={limit.toString()}
                      onValueChange={(v) => {
                        setLimit(Number(v));
                        setPage(1);
                      }}
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

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama atau email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border text-sm h-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-40 md:w-44 border text-sm h-10">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Role</SelectItem>
                      <SelectItem value="WARGA">Warga</SelectItem>
                      <SelectItem value="UMKM">UMKM</SelectItem>
                      <SelectItem value="DLH">DLH</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {usersError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-600 mb-2">
                    Gagal memuat data pengguna
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {usersError?.response?.data?.message ||
                      usersError?.message ||
                      "Terjadi kesalahan"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Muat Ulang
                  </Button>
                </div>
              ) : usersLoading ? (
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
                            <TableCell>
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0" />
                                <div className="space-y-1.5 min-w-0">
                                  <Skeleton className="h-3.5 sm:h-4 w-24 sm:w-32" />
                                  <Skeleton className="h-3 w-28 sm:w-40" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-14 sm:w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-12 sm:w-14" />
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-4 w-8 sm:w-10" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-20 sm:w-24" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                              </div>
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
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-sm"
                            >
                              {searchQuery || roleFilter !== "all"
                                ? "Tidak ada pengguna yang sesuai dengan pencarian"
                                : "Tidak ada data pengguna"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
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
                                  variant="outline"
                                  className={`${getRoleBadgeColor(
                                    user.role
                                  )} text-[10px] sm:text-xs`}
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
                              <TableCell className="hidden md:table-cell text-xs sm:text-sm text-muted-foreground py-3">
                                {formatDate(user.createdAt)}
                              </TableCell>
                              <TableCell className="text-right py-3">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDetail(user.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {user.role !== "ADMIN" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteUser(user)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Menampilkan {filteredUsers.length} dari{" "}
                      {pagination.total || 0} pengguna (Halaman {page} dari{" "}
                      {pagination.totalPages || 1})
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

          {/* Detail Dialog */}
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
                    <Skeleton className="h-4 w-1/2" />
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
                        variant="outline"
                        className={`${getRoleBadgeColor(
                          userDetail.data.role
                        )} text-xs`}
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
                    {userDetail.data.totalPoints !== undefined && (
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>Total Poin: {userDetail.data.totalPoints}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent className="max-w-sm sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg">
                  Hapus Pengguna?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm">
                  Apakah Anda yakin ingin menghapus pengguna{" "}
                  <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
                  Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
