import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Camera,
  Upload,
  MapPin,
  Clock,
  Wallet,
  Star,
  Loader2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  checklistItems,
  formatVND,
  labelFrom,
  areas,
  timeSlots,
  statusLabel,
  statusColor,
  type BookingStatus,
} from "@/lib/cleanlink-data";
import {
  fetchBooking,
  flowSteps,
  stepIndex,
  signedPhotoUrl,
  updateBooking,
  uploadBookingPhoto,
  type BookingRow,
} from "@/lib/bookings";

const TITLE = "Chi tiết đơn dọn phòng – CleanLink";
const DESC =
  "Theo dõi đơn dọn phòng CleanLink: người dọn nhận việc, danh sách công việc, hình ảnh sau khi dọn, xác nhận hoàn thành và đánh giá dịch vụ.";

export const Route = createFileRoute("/don/$id")({
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
  component: BookingDetailPage,
});

function BookingDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, profile, role, loading: authLoading, isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({ to: "/dang-nhap", search: { next: `/don/${id}` }, replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, id]);

  async function reload() {
    const b = await fetchBooking(id);
    setBooking(b);
    setLoading(false);
    setBeforeUrl(await signedPhotoUrl(b?.photo_before ?? null));
    setAfterUrl(await signedPhotoUrl(b?.photo_after ?? null));
  }

  useEffect(() => {
    if (!user) return;
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  if (authLoading || loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-sm text-muted-foreground">Đang tải đơn…</div>
      </SiteLayout>
    );
  }

  if (!booking) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy đơn này</h1>
          <p className="mt-2 text-muted-foreground">Đơn có thể đã bị huỷ hoặc bạn không có quyền xem.</p>
          <Button asChild className="mt-6 rounded-full"><Link to="/theo-doi-don">Về danh sách đơn</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const isHost = booking.host_id === user?.id;
  const isMyJob = booking.cleaner_id === user?.id;
  const isCleaner = role === "cleaner";
  const status = booking.status as BookingStatus;
  const done = booking.checklist_done ?? [];
  const allDone = done.length === checklistItems.length;
  const current = stepIndex(status);

  async function run(fn: () => Promise<void>, ok: string) {
    setBusy(true);
    try {
      await fn();
      await reload();
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setBusy(false);
    }
  }

  async function toggleItem(itemId: string) {
    if (!booking || !isMyJob) return;
    const next = done.includes(itemId) ? done.filter((x) => x !== itemId) : [...done, itemId];
    await run(
      () =>
        updateBooking(booking.id, {
          checklist_done: next,
          status: booking.status === "accepted" ? "in_progress" : booking.status,
        }),
      "Đã cập nhật danh sách công việc",
    );
  }

  async function onUpload(kind: "before" | "after", file: File) {
    if (!booking) return;
    await run(async () => {
      const path = await uploadBookingPhoto(booking.id, kind, file);
      await updateBooking(booking.id, kind === "before" ? { photo_before: path } : { photo_after: path });
    }, "Đã tải hình ảnh lên");
  }

  async function sendPhotos() {
    if (!booking) return;
    await run(
      () =>
        updateBooking(booking.id, {
          status: "photo_sent",
          photo_sent_at: new Date().toISOString(),
        }),
      "Đã gửi hình ảnh cho chủ cơ sở",
    );
  }

  async function confirmComplete() {
    if (!booking) return;
    await run(
      () => updateBooking(booking.id, { status: "completed", completed_at: new Date().toISOString() }),
      "Đã xác nhận hoàn thành dịch vụ",
    );
  }

  async function submitReview() {
    if (!booking) return;
    await run(async () => {
      const { error } = await supabase.from("reviews").insert({
        booking_id: booking.id,
        host_id: booking.host_id,
        cleaner_id: booking.cleaner_id,
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;
      await updateBooking(booking.id, { status: "reviewed" });
    }, "Cảm ơn bạn đã đánh giá dịch vụ");
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Mã đơn</p>
            <h1 className="text-2xl font-bold font-mono">{booking.code}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${statusColor[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        {/* Thông tin đơn */}
        <div className="mt-6 rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
          <h2 className="font-semibold">{booking.property_name}</h2>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {booking.address} · {labelFrom(areas, booking.area)}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Info icon={<Clock className="h-3 w-3" />} label="Ngày & khung giờ" value={`${booking.service_date} · ${labelFrom(timeSlots, booking.time_slot)}`} />
            <Info icon={<CheckCircle2 className="h-3 w-3" />} label="Số phòng" value={`${booking.rooms} phòng · ${booking.room_type === "kitchen" ? "phòng lớn / có bếp" : "tiêu chuẩn"}`} />
            <Info icon={<Wallet className="h-3 w-3" />} label="Tổng đơn" value={formatVND(booking.price)} />
          </div>
          {booking.note && (
            <p className="mt-4 rounded-xl bg-mint/20 border border-border/60 p-3 text-sm">
              <span className="font-medium">Ghi chú: </span>{booking.note}
            </p>
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            Người dọn: <span className="font-medium text-foreground">{booking.cleaner_name || "Đang tìm người dọn"}</span>
            {" · "}Liên hệ: {booking.phone}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <p className="text-sm">
              Thanh toán: <span className="font-medium">{booking.payment_method === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</span>
              {" · "}
              <span className={booking.payment_status === "paid" ? "font-medium text-primary" : "text-muted-foreground"}>
                {booking.payment_status === "paid" ? "Đã xác nhận" : booking.payment_status === "reported" ? "Đang chờ xác nhận" : "Chưa thanh toán"}
              </span>
            </p>
            {isHost && (
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/thanh-toan" search={{ bookingId: booking.id }}>Xem thanh toán</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Trạng thái */}
        <div className="mt-6 rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
          <h2 className="font-semibold">Trạng thái đơn</h2>
          <ol className="mt-4 space-y-3">
            {flowSteps.map((s, i) => (
              <li key={s.key} className="flex items-start gap-3">
                <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                  i <= current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                } ${i === current ? "ring-4 ring-primary/20" : ""}`}>
                  {i <= current && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <p className={`text-sm font-medium ${i === current ? "text-primary" : ""}`}>{s.label}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Người dọn nhận việc */}
        {isCleaner && !booking.cleaner_id && status === "searching" && (
          <div className="mt-6 rounded-2xl bg-mint/40 border border-mint p-5 flex items-center justify-between flex-wrap gap-3">
            <p className="font-semibold">Bạn muốn nhận công việc này?</p>
            <Button
              className="rounded-full"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const { error } = await supabase
                    .from("bookings")
                    .update({
                      cleaner_id: user!.id,
                      cleaner_name: profile?.full_name || "Người dọn CleanLink",
                      status: "accepted",
                      accepted_at: new Date().toISOString(),
                    })
                    .eq("id", booking.id)
                    .is("cleaner_id", null);
                  if (error) throw error;
                }, "Bạn đã nhận công việc này")
              }
            >
              Nhận việc
            </Button>
          </div>
        )}

        {/* Danh sách công việc */}
        <div className="mt-6 rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Danh sách công việc</h2>
            <span className="text-sm font-bold text-primary">{done.length}/{checklistItems.length} công việc đã hoàn thành</span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${(done.length / checklistItems.length) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-2">
            {checklistItems.map((it, i) => {
              const isDone = done.includes(it.id);
              return (
                <li key={it.id}>
                  <label className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    isDone ? "border-primary bg-mint/30" : "border-border bg-card"
                  } ${isMyJob ? "cursor-pointer hover:border-primary/40" : "opacity-90"}`}>
                    <Checkbox checked={isDone} disabled={!isMyJob || busy} onCheckedChange={() => void toggleItem(it.id)} />
                    <span className="flex-1 text-sm font-medium">
                      <span className="text-muted-foreground mr-2">{i + 1}.</span>{it.label}
                    </span>
                    {isDone && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </label>
                </li>
              );
            })}
          </ul>
          {!isMyJob && (
            <p className="mt-3 text-xs text-muted-foreground">Người dọn sẽ đánh dấu từng công việc khi thực hiện.</p>
          )}
        </div>

        {/* Hình ảnh */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <PhotoCard label="Ảnh trước khi dọn" url={beforeUrl} canUpload={isMyJob && !busy} onPick={(f) => void onUpload("before", f)} />
          <PhotoCard label="Ảnh sau khi dọn" url={afterUrl} canUpload={isMyJob && !busy} onPick={(f) => void onUpload("after", f)} />
        </div>

        {/* Hành động theo vai trò */}
        {isMyJob && ["accepted", "in_progress"].includes(status) && (
          <div className="mt-6 rounded-2xl bg-card border border-border/60 shadow-card p-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Hoàn thành đủ {checklistItems.length} công việc và tải ảnh sau khi dọn để gửi cho chủ cơ sở.
            </p>
            <Button className="rounded-full" disabled={!allDone || !booking.photo_after || busy} onClick={() => void sendPhotos()}>
              {busy && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Gửi hình ảnh & báo hoàn thành
            </Button>
          </div>
        )}

        {isHost && status === "photo_sent" && (
          <div className="mt-6 rounded-2xl bg-mint/40 border border-mint p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Người dọn đã báo hoàn thành</p>
              <p className="text-sm text-muted-foreground">Kiểm tra hình ảnh và xác nhận nếu bạn hài lòng với kết quả.</p>
            </div>
            <Button className="rounded-full" disabled={busy} onClick={() => void confirmComplete()}>
              Xác nhận hoàn thành
            </Button>
          </div>
        )}

        {isHost && status === "completed" && (
          <div className="mt-6 rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
            <h2 className="font-semibold">Đánh giá dịch vụ</h2>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} sao`}>
                  <Star className={`h-7 w-7 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
                </button>
              ))}
            </div>
            <Textarea
              className="mt-3"
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng dọn phòng…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button className="mt-3 rounded-full" disabled={busy} onClick={() => void submitReview()}>
              Gửi đánh giá
            </Button>
          </div>
        )}

        {status === "reviewed" && (
          <div className="mt-6 rounded-2xl bg-mint/40 border border-mint p-5 text-sm">
            Đơn đã hoàn tất và được đánh giá. Cảm ơn bạn đã sử dụng CleanLink.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link to={isCleaner ? "/nguoi-don" : "/theo-doi-don"}>
              {isCleaner ? "Về danh sách công việc" : "Về danh sách đơn của tôi"}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full"><Link to="/ho-tro">Liên hệ hỗ trợ</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <p className="text-xs text-muted-foreground flex items-center gap-1">{icon} {label}</p>
      <p className="mt-0.5 font-semibold text-sm">{value}</p>
    </div>
  );
}

function PhotoCard({
  label,
  url,
  canUpload,
  onPick,
}: {
  label: string;
  url: string | null;
  canUpload: boolean;
  onPick: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
        {url ? (
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-muted-foreground flex items-center gap-2"><Camera className="h-4 w-4" /> Chưa có hình ảnh</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs text-white">{label}</div>
      </div>
      {canUpload && (
        <div className="p-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
          <Button size="sm" variant="outline" className="rounded-full w-full" onClick={() => inputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Tải ảnh lên
          </Button>
        </div>
      )}
    </div>
  );
}
