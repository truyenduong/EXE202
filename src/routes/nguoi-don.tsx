import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Wallet, Zap, Check, Home, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { acceptJob, fetchCleanerBookings, type BookingRow } from "@/lib/bookings";
import {
  areas,
  timeSlots,
  labelFrom,
  formatVND,
  statusLabel,
  statusColor,
  type BookingStatus,
} from "@/lib/cleanlink-data";

const TITLE = "Công việc mới gần bạn – CleanLink cho người dọn";
const DESC =
  "Trang dành cho người dọn CleanLink: xem công việc mới tại Quy Nhơn, nhận việc, làm danh sách công việc và gửi hình ảnh sau khi dọn.";

export const Route = createFileRoute("/nguoi-don")({
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
  component: CleanerPage,
});

function CleanerPage() {
  const { user, profile, role, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({ to: "/dang-nhap", search: { next: "/nguoi-don" }, replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  async function reload() {
    const r = await fetchCleanerBookings();
    setRows(r);
    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    void reload();
  }, [user]);

  useEffect(() => {
    if (!user || role === "cleaner") return;
    void (async () => {
      const { data, error } = await supabase
        .from("cleaner_applications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        toast.error("Không tải được trạng thái đăng ký cộng tác viên.");
        return;
      }
      setApplicationStatus(data?.status ?? null);
    })()
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Không tải được trạng thái đăng ký cộng tác viên.");
      })
      .finally(() => setApplicationLoading(false));
  }, [user, role]);

  const openJobs = rows.filter((b) => !b.cleaner_id && b.status === "searching");
  const myJobs = rows.filter((b) => b.cleaner_id === user?.id);

  async function onAccept(b: BookingRow) {
    if (!user) return;
    setBusy(b.id);
    try {
      await acceptJob(b.id, user.id, profile?.full_name || "Người dọn CleanLink");
      toast.success(`Bạn đã nhận công việc ${b.code}`);
      await reload();
      void navigate({ to: "/don/$id", params: { id: b.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không nhận được công việc này");
    } finally {
      setBusy(null);
    }
  }

  async function submitCleanerApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setApplicationSubmitting(true);
    const { data, error } = await supabase
      .from("cleaner_applications")
      .insert({
        user_id: user.id,
        work_experience: experience.trim(),
        availability: availability.trim(),
      })
      .select("status")
      .single();
    setApplicationSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setApplicationStatus(data.status);
    toast.success("Đã gửi đăng ký cộng tác viên để quản trị viên xét duyệt.");
  }

  if (!authLoading && isAuthenticated && role !== "cleaner") {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">
            {applicationStatus === "pending"
              ? "Đăng ký cộng tác viên đang chờ duyệt"
              : applicationStatus === "rejected"
                ? "Đăng ký cộng tác viên chưa được duyệt"
                : "Trang dành cho người dọn"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {applicationStatus === "pending"
              ? "CleanLink sẽ xem thông tin và kích hoạt quyền nhận việc sau khi duyệt. Tải lại trang sau khi nhận được xác nhận."
              : applicationStatus === "rejected"
                ? "Bạn có thể liên hệ CleanLink để biết thêm thông tin."
                : "Tài khoản này chưa có quyền người dọn. Hãy đăng ký vai trò người dọn để gửi hồ sơ xét duyệt."}
          </p>
          {applicationStatus === "pending" ? (
            <Button className="mt-6 rounded-full" onClick={() => window.location.reload()}>Kiểm tra trạng thái</Button>
          ) : applicationLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Đang kiểm tra hồ sơ…</p>
          ) : applicationStatus === null && isAuthenticated ? (
            <form onSubmit={(event) => void submitCleanerApplication(event)} className="mx-auto mt-6 max-w-lg space-y-4 text-left">
              <label className="block space-y-2 text-sm font-medium">
                Kinh nghiệm dọn dẹp
                <Input value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="Ví dụ: 1 năm, chưa có kinh nghiệm" />
              </label>
              <label className="block space-y-2 text-sm font-medium">
                Thời gian có thể làm
                <Input value={availability} onChange={(event) => setAvailability(event.target.value)} placeholder="Ví dụ: các ngày trong tuần, 8:00–17:00" />
              </label>
              <Button type="submit" className="rounded-full" disabled={applicationSubmitting}>
                {applicationSubmitting ? "Đang gửi…" : "Gửi đăng ký cộng tác viên"}
              </Button>
            </form>
          ) : !isAuthenticated ? (
            <Button asChild className="mt-6 rounded-full"><Link to="/dang-nhap" search={{ next: undefined }}>Đăng ký / đăng nhập</Link></Button>
          ) : (
            <Button asChild className="mt-6 rounded-full"><Link to="/ho-tro">Liên hệ hỗ trợ</Link></Button>
          )}
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Người dọn CleanLink</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-bold">Công việc mới gần bạn</h1>
              <p className="mt-2 text-muted-foreground">
                {loading ? "Đang tải công việc…" : `Hiện có ${openJobs.length} công việc đang chờ người dọn tại Quy Nhơn.`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur px-4 py-3 shadow-card">
              <p className="text-xs text-muted-foreground">Công việc của tôi</p>
              <p className="text-xl font-bold text-primary">{myJobs.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Công việc đang chờ nhận</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : openJobs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground shadow-card">
              Hiện chưa có công việc mới. Hãy quay lại vào khung giờ khách trả phòng (11:00 – 14:00).
            </div>
          ) : (
            openJobs.map((b) => (
              <article key={b.id} className="rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">Dọn {b.rooms} phòng tại {b.property_name}</h3>
                      {b.urgency === "urgent" && (
                        <span className="inline-flex items-center gap-1 text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-medium">
                          <Zap className="h-3 w-3" /> Gấp
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {b.address} · {labelFrom(areas, b.area)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                      <Home className="h-3 w-3" /> {b.room_type === "kitchen" ? "Phòng lớn / có bếp" : "Phòng tiêu chuẩn"}
                    </p>
                  </div>
                  <span className="rounded-full bg-mint/40 text-mint-foreground text-xs px-3 py-1 font-medium font-mono">{b.code}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Ngày & khung giờ</p>
                    <p className="mt-0.5 font-semibold text-sm">{b.service_date} · {labelFrom(timeSlots, b.time_slot)}</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Giá trị đơn</p>
                    <p className="mt-0.5 font-semibold text-sm text-primary">{formatVND(b.price)}</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Liên hệ chủ cơ sở</p>
                    <p className="mt-0.5 font-semibold text-sm">{b.phone}</p>
                  </div>
                </div>

                {b.note && (
                  <p className="mt-4 rounded-xl border border-border/60 bg-mint/20 p-3 text-sm">
                    <span className="font-medium">Ghi chú: </span>{b.note}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button className="rounded-full" disabled={busy === b.id} onClick={() => void onAccept(b)}>
                    <Check className="mr-1 h-4 w-4" /> Nhận việc
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/don/$id" params={{ id: b.id }}>Xem chi tiết</Link>
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Công việc tôi đã nhận</h2>
          {myJobs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground shadow-card">
              Bạn chưa nhận công việc nào.
            </div>
          ) : (
            myJobs.map((b) => {
              const status = b.status as BookingStatus;
              return (
                <article key={b.id} className="rounded-2xl bg-card border border-border/60 shadow-card p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Dọn {b.rooms} phòng · {b.property_name}</p>
                    <p className="text-sm text-muted-foreground">{b.address} · {labelFrom(timeSlots, b.time_slot)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${statusColor[status]}`}>
                      {statusLabel[status]}
                    </span>
                    <Button asChild className="rounded-full">
                      <Link to="/don/$id" params={{ id: b.id }}>
                        Tiếp tục <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
