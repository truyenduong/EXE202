import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Wallet, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { fetchHostBookings, type BookingRow } from "@/lib/bookings";
import {
  areas,
  timeSlots,
  labelFrom,
  formatVND,
  statusLabel,
  statusColor,
  type BookingStatus,
} from "@/lib/cleanlink-data";

const TITLE = "Đơn dọn phòng của tôi – CleanLink";
const DESC =
  "Theo dõi toàn bộ đơn dọn phòng bạn đã đặt trên CleanLink: trạng thái, người dọn, hình ảnh sau khi dọn và xác nhận hoàn thành.";

export const Route = createFileRoute("/theo-doi-don")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({ to: "/dang-nhap", search: { next: "/theo-doi-don" }, replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    void fetchHostBookings(user.id).then((r) => {
      setRows(r);
      setLoading(false);
    });
  }, [user]);

  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-12">
          <p className="text-xs font-medium text-primary uppercase tracking-wider">Chủ cơ sở lưu trú</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold">Đơn dọn phòng của tôi</h1>
          <p className="mt-2 text-muted-foreground">
            Theo dõi tiến độ từng đơn, xem hình ảnh sau khi dọn và xác nhận hoàn thành.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10 space-y-4">
        {authLoading || loading ? (
          <p className="text-sm text-muted-foreground">Đang tải danh sách đơn…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card">
            <p className="font-semibold">Bạn chưa có đơn dọn phòng nào</p>
            <p className="mt-1 text-sm text-muted-foreground">Tạo đơn mới để CleanLink tìm người dọn phù hợp.</p>
            <Button asChild className="mt-5 rounded-full"><Link to="/dat-lich">Đặt người dọn</Link></Button>
          </div>
        ) : (
          rows.map((b) => {
            const status = b.status as BookingStatus;
            return (
              <article key={b.id} className="rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">Dọn {b.rooms} phòng · {b.property_name}</h2>
                      <span className="font-mono text-xs text-muted-foreground">{b.code}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {b.address} · {labelFrom(areas, b.area)}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${statusColor[status]}`}>
                    {statusLabel[status]}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Ngày & khung giờ</p>
                    <p className="mt-0.5 font-semibold text-sm">{b.service_date} · {labelFrom(timeSlots, b.time_slot)}</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Người dọn</p>
                    <p className="mt-0.5 font-semibold text-sm">{b.cleaner_name || "Đang tìm người dọn"}</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Tổng đơn</p>
                    <p className="mt-0.5 font-semibold text-sm text-primary">{formatVND(b.price)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button asChild className="rounded-full">
                    <Link to="/don/$id" params={{ id: b.id }}>
                      Xem chi tiết đơn <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </SiteLayout>
  );
}
