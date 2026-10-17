import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CalendarPlus } from "lucide-react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Floating CTA */}
      <Link
        to="/dat-lich"
        className="fixed bottom-5 right-5 z-50 md:bottom-8 md:right-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:scale-105 transition-transform"
      >
        <CalendarPlus className="h-4 w-4" />
        Đặt lịch nhanh
      </Link>
    </div>
  );
}
