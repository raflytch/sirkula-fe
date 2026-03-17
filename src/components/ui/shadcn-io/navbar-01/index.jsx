"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { deleteCookie } from "cookies-next/client";
import { useDispatch } from "react-redux";
import { clearUser } from "@/features/slices/user.slice";
import { toast } from "sonner";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/lib/constanst";
import { images } from "@/lib/constanst";
import { useSession } from "@/hooks/use-auth";
import {
  User,
  LogOut,
  LayoutDashboard,
  Trophy,
  Gift,
  Menu,
  X,
  Coins,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Hamburger Icon
const HamburgerIcon = ({ isOpen }) => {
  return (
    <div className="relative w-5 h-4 flex flex-col justify-between">
      <span
        className={cn(
          "block h-0.5 w-5 bg-current rounded-full transition-all duration-300",
          isOpen && "rotate-45 translate-y-1.5"
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-5 bg-current rounded-full transition-all duration-300",
          isOpen && "opacity-0"
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-5 bg-current rounded-full transition-all duration-300",
          isOpen && "-rotate-45 -translate-y-1.5"
        )}
      />
    </div>
  );
};

// Logo Component
const Logo = () => (
  <Image className="text-2xl w-10 h-10" src={images.logo} alt="Sirkula Logo" />
);

export const Navbar01 = React.forwardRef(
  (
    {
      className,
      logoHref = "#",
      signInText = "Sign In",
      signInHref = "#signin",
      ctaText = "Get Started",
      ctaHref = "#get-started",
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const containerRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const { data: session, isLoading, refetch } = useSession();

    useEffect(() => {
      setMounted(true);
    }, []);

    // Scroll listener for navbar background
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getInitials = (name) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const getDashboardLink = () => {
      if (!session) return "/";
      switch (session.role) {
        case "UMKM":
          return "/dashboard/umkm";
        case "DLH":
          return "/dashboard/dinas";
        case "ADMIN":
          return "/dashboard/admin";
        default:
          return "/";
      }
    };

    const isHashLink = (href) => {
      return href.startsWith("#");
    };

    const handleNavigation = (e, href) => {
      if (!isHashLink(href)) {
        setIsPopoverOpen(false);
        return;
      }

      const isHomePage = pathname === "/";
      const sectionId = href === "#" ? "home" : href.substring(1);

      if (!isHomePage) {
        return;
      } else {
        e.preventDefault();
        scrollToSection(sectionId);
      }
    };

    const scrollToSection = (sectionId) => {
      if (sectionId === "home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setIsPopoverOpen(false);
        return;
      }

      const element = document.getElementById(sectionId);

      if (!element) {
        return;
      }

      const headerOffset = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setIsPopoverOpen(false);
    };

    useEffect(() => {
      if (pathname === "/" && window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      }
    }, [pathname]);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 1024); // lg breakpoint for tablet
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      const handleFocus = () => {
        refetch();
      };
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }, [refetch]);

    const combinedRef = React.useCallback(
      (node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const getLinkHref = (href) => {
      if (!isHashLink(href)) {
        return href;
      }
      return href === "#" ? "/" : `/${href}`;
    };

    const getLinkIcon = (label) => {
      const link = navigationLinks.find((l) => l.label === label);
      if (link && link.icon) {
        const Icon = link.icon;
        return <Icon className="h-4 w-4" />;
      }
      return null;
    };

    const isActiveLink = (href) => {
      if (href === "/" && pathname === "/") return true;
      if (href !== "/" && pathname.startsWith(href)) return true;
      return false;
    };

    const handleLogout = () => {
      deleteCookie("token");
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logout berhasil!");
      router.push("/auth");
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-9999 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-4 md:px-6 **:no-underline",
          className
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="h-9 w-9 hover:bg-zinc-100"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon isOpen={isPopoverOpen} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-64 p-3 bg-white/95 backdrop-blur-md border border-zinc-200/60 shadow-lg rounded-xl"
                >
                  <nav className="space-y-1">
                    {session &&
                    (session.role === "UMKM" ||
                      session.role === "ADMIN" ||
                      session.role === "DLH") ? (
                      // For UMKM, ADMIN, and DLH - only show Dashboard
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsPopoverOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all bg-green-50 text-green-700"
                      >
                        <span className="p-1.5 rounded-md bg-green-100">
                          <LayoutDashboard className="h-4 w-4" />
                        </span>
                        <span>Dashboard</span>
                        <ChevronRight className="h-4 w-4 ml-auto opacity-40" />
                      </Link>
                    ) : (
                      // For WARGA and not logged in - show all navigation links
                      navigationLinks.map((link, index) => {
                        const icon = getLinkIcon(link.label);
                        return (
                          <Link
                            key={index}
                            href={getLinkHref(link.href)}
                            onClick={(e) => handleNavigation(e, link.href)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                              isActiveLink(link.href)
                                ? "bg-green-50 text-green-700"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                            )}
                          >
                            {icon && (
                              <span
                                className={cn(
                                  "p-1.5 rounded-md",
                                  isActiveLink(link.href)
                                    ? "bg-green-100"
                                    : "bg-zinc-100"
                                )}
                              >
                                {icon}
                              </span>
                            )}
                            <span>{link.label}</span>
                            <ChevronRight className="h-4 w-4 ml-auto opacity-40" />
                          </Link>
                        );
                      })
                    )}
                  </nav>

                  {/* Mobile User Info */}
                  {session && (
                    <div className="mt-3 pt-3 border-t border-zinc-200/60">
                      <div className="flex items-center gap-3 px-3 py-2 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Coins className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Poin Kamu</p>
                          <p className="font-semibold text-green-700">
                            {session.totalPoints} Poin
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}

            <div className="flex items-center gap-8">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    scrollToSection("home");
                  }
                }}
                className="flex items-center gap-2.5 group"
              >
                <div className="relative">
                  <Logo />
                  <div className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-150 transition-transform duration-300" />
                </div>
                <span className="hidden sm:inline-block font-bold text-xl bg-linear-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Sirkula
                </span>
              </Link>

              {/* Desktop Navigation */}
              {!isMobile && (
                <NavigationMenu className="hidden lg:flex">
                  <NavigationMenuList className="gap-1">
                    {session &&
                    (session.role === "UMKM" ||
                      session.role === "ADMIN" ||
                      session.role === "DLH") ? (
                      // For UMKM, ADMIN, and DLH - only show Dashboard
                      <NavigationMenuItem>
                        <Link
                          href={getDashboardLink()}
                          className="group inline-flex h-9 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all bg-green-50 text-green-700"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </NavigationMenuItem>
                    ) : (
                      // For WARGA and not logged in - show all navigation links
                      navigationLinks.map((link, index) => {
                        const icon = getLinkIcon(link.label);
                        return (
                          <NavigationMenuItem key={index}>
                            <Link
                              href={getLinkHref(link.href)}
                              onClick={(e) => handleNavigation(e, link.href)}
                              className={cn(
                                "group inline-flex h-9 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                                isActiveLink(link.href)
                                  ? "bg-green-50 text-green-700"
                                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                              )}
                            >
                              {icon}
                              {link.label}
                            </Link>
                          </NavigationMenuItem>
                        );
                      })
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>

          {/* Right side */}
          {!mounted || isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          ) : session ? (
            <div className="flex items-center gap-3">
              {/* Points Display - Desktop Only */}
              {!isMobile && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-green-50 to-emerald-50 rounded-full border border-green-100">
                  <Coins className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {session.totalPoints}
                  </span>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-zinc-100 hover:ring-green-200 transition-all"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.avatarUrl} alt={session.name} />
                      <AvatarFallback className="bg-linear-to-br from-green-100 to-emerald-100 text-green-700 font-semibold">
                        {getInitials(session.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2 bg-white/95 backdrop-blur-md border border-zinc-200/60 shadow-lg rounded-xl"
                  align="end"
                >
                  {/* User Info Header */}
                  <div className="px-3 py-3 mb-2 bg-linear-to-r from-zinc-50 to-zinc-100/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.avatarUrl}
                          alt={session.name}
                        />
                        <AvatarFallback className="bg-linear-to-br from-green-100 to-emerald-100 text-green-700 font-semibold">
                          {getInitials(session.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-zinc-900 truncate">
                          {session.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {session.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-md">
                      <Coins className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        {session.totalPoints} Poin
                      </span>
                    </div>
                  </div>

                  {session.role === "WARGA" ? (
                    // For WARGA - show all menu items
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-md bg-zinc-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-zinc-600" />
                          </div>
                          <span className="font-medium">Profil</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/sirkula-green-action"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium">Sirkula-AI</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/reedem"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
                            <Gift className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">Tukar Poin</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/leaderboard"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-md bg-amber-100 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="font-medium">Leaderboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    // For UMKM, ADMIN, DLH - only show Dashboard
                    <DropdownMenuItem asChild>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <LayoutDashboard className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <div className="h-8 w-8 rounded-md bg-red-100 flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                onClick={() => router.push("/auth")}
              >
                Masuk
              </Button>
              <Button
                size="sm"
                className="text-sm font-medium px-4 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm"
                onClick={() => router.push("/sign-up")}
              >
                Daftar
              </Button>
            </div>
          )}
        </div>
      </header>
    );
  }
);

Navbar01.displayName = "Navbar01";
