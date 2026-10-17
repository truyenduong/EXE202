import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoAsset from "@/assets/cleanlink-logo.jpg.asset.json";
import { useAuth } from "@/hooks/use-auth";

const primary = [
  { to: "/", label: "Trang chủ" },
  { to: "/dat-lich", label: "Đặt lịch" },
  { to: "/gia-du-kien", label: "Giá dự kiến" },
  { to: "/theo-doi-don", label: "Theo dõi đơn" },
  { to: "/nguoi-don", label: "Người dọn" },
] as const;

const more = [
  { to: "/checklist", label: "Danh sách công việc" },
  { to: "/anh-xac-nhan", label: "Hình ảnh sau khi dọn" },
  { to: "/tin-nhan", label: "Tin nhắn" },
  { to: "/thanh-toan", label: "Thanh toán" },
  { to: "/danh-gia", label: "Đánh giá" },
  { to: "/ho-tro", label: "Hỗ trợ" },
  { to: "/quy-trinh", label: "Quy trình" },
  { to: "/dich-vu", label: "Dịch vụ" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/lien-he", label: "Liên hệ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, profile } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="CleanLink">
          <img
            src={logoAsset.url}
            alt="CleanLink"
            className="h-10 w-auto rounded-lg object-cover"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {primary.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary rounded-md bg-mint/40" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1">
              Thêm <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {more.map((n) => (
                <DropdownMenuItem key={n.to} asChild>
                  <Link to={n.to}>{n.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin">Quản trị</Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/tai-khoan">
                <User className="h-4 w-4" />
                {profile?.full_name?.split(" ").slice(-1)[0] || "Tài khoản"}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/dang-nhap" search={{ next: undefined }}>
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="rounded-full shadow-soft">
            <Link to="/dat-lich">Đặt người dọn</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {[...primary, ...more, { to: "/admin", label: "Quản trị" } as const].map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to="/tai-khoan"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted"
              >
                Tài khoản của tôi
              </Link>
            ) : (
              <Link
                to="/dang-nhap"
                search={{ next: undefined }}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted"
              >
                Đăng nhập / Đăng ký
              </Link>
            )}
            <Button asChild className="w-full mt-2 rounded-full">
              <Link to="/dat-lich" onClick={() => setOpen(false)}>Đặt người dọn</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
