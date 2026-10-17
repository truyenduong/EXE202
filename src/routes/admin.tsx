import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { BookingRow } from "@/lib/bookings";
import {
  DEFAULT_SERVICE_PRICING,
  statusLabel,
  formatVND,
  areas,
  timeSlots,
  labelFrom,
  type ServicePricing,
} from "@/lib/cleanlink-data";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { ClipboardList, Clock, PlayCircle, CheckCircle2, Users, Star, Wallet, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Quản trị – CleanLink" },
      { name: "description", content: "Bảng điều khiển quản trị CleanLink." },
      { property: "og:title", content: "Quản trị – CleanLink" },
      { property: "og:description", content: "Bảng điều khiển quản trị CleanLink." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Profile = { id: string; phone: string; full_name: string; property_name: string | null; area: string | null; created_at: string };
type Review = { id: string; booking_id: string; rating: number; comment: string | null; created_at: string };
type RoleRow = { user_id: string; role: string };
type CleanerApplication = Database["public"]["Tables"]["cleaner_applications"]["Row"];

const roleText: Record<string, string> = { host: "Chủ cơ sở", cleaner: "Người dọn", admin: "Quản trị" };
const paymentStatusLabel: Record<string, string> = {
  pending: "Chưa thanh toán",
  reported: "Đã báo chuyển khoản",
  paid: "Đã xác nhận",
};

function AdminPage() {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [applications, setApplications] = useState<CleanerApplication[]>([]);
  const [pricing, setPricing] = useState<ServicePricing>(DEFAULT_SERVICE_PRICING);
  const [savingPrice, setSavingPrice] = useState(false);
  const [savingApplication, setSavingApplication] = useState<string | null>(null);
  const [savingBooking, setSavingBooking] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    void (async () => {
      const [b, p, r, ro, a, sp] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, phone, full_name, property_name, area, created_at").order("created_at", { ascending: false }),
        supabase.from("reviews").select("id, booking_id, rating, comment, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("cleaner_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("service_pricing").select("*").eq("id", true).single(),
      ]);
      const failed = [b, p, r, ro, a, sp].find((result) => result.error);
      if (failed?.error) throw failed.error;
      if (!sp.data) throw new Error("Chưa cấu hình bảng giá dịch vụ.");
      setBookings((b.data ?? []) as BookingRow[]);
      setProfiles((p.data ?? []) as Profile[]);
      setReviews((r.data ?? []) as Review[]);
      setRoles((ro.data ?? []) as RoleRow[]);
      setApplications(a.data ?? []);
      setPricing(sp.data);
    })().catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Không tải được dữ liệu quản trị.");
    });
  }, [isAdmin]);

  async function changeBookingStatus(bookingId: string, status: string) {
    setSavingBooking(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", bookingId)
        .select("id")
        .single();
      if (error) throw error;
      setBookings((rows) => rows.map((row) => row.id === bookingId ? { ...row, status } : row));
      toast.success("Đã cập nhật trạng thái đơn.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không cập nhật được trạng thái đơn.");
    } finally {
      setSavingBooking(null);
    }
  }

  async function changePaymentStatus(bookingId: string, payment_status: string) {
    setSavingBooking(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status, updated_at: new Date().toISOString() })
        .eq("id", bookingId)
        .select("id")
        .single();
      if (error) throw error;
      setBookings((rows) => rows.map((row) => row.id === bookingId ? { ...row, payment_status } : row));
      toast.success("Đã cập nhật thanh toán.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không cập nhật được thanh toán.");
    } finally {
      setSavingBooking(null);
    }
  }

  async function savePricing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPrice(true);
    try {
      const { error } = await supabase
        .from("service_pricing")
        .update({ ...pricing, updated_at: new Date().toISOString() })
        .eq("id", true)
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Đã lưu bảng giá. Áp dụng cho các đơn tạo mới.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được bảng giá.");
    } finally {
      setSavingPrice(false);
    }
  }

  async function reviewApplication(application: CleanerApplication, approve: boolean) {
    setSavingApplication(application.id);
    try {
      const { error } = await supabase.rpc("review_cleaner_application", {
        _application_id: application.id,
        _approve: approve,
      });
      if (error) throw error;
      setApplications((rows) => rows.map((row) =>
        row.id === application.id
          ? { ...row, status: approve ? "approved" : "rejected" }
          : row,
      ));
      if (approve) {
        setRoles((rows) => [...rows, { user_id: application.user_id, role: "cleaner" }]);
      }
      toast.success(approve ? "Đã duyệt cộng tác viên." : "Đã từ chối đăng ký.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không xử lý được hồ sơ cộng tác viên.");
    } finally {
      setSavingApplication(null);
    }
  }

  if (loading) {
    return <SiteLayout><div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Đang tải...</div></SiteLayout>;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Chỉ dành cho quản trị viên</h1>
          <p className="mt-2 text-sm text-muted-foreground">Vui lòng đăng nhập bằng tài khoản có quyền quản trị.</p>
          <Button asChild className="mt-6"><Link to="/dang-nhap" search={{ next: "/admin" } as never}>Đăng nhập</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const nameOf = (id: string | null) => profiles.find((p) => p.id === id)?.full_name ?? "";
  const rolesOf = (id: string) => roles.filter((r) => r.user_id === id).map((r) => roleText[r.role] ?? r.role);
  const doneStatuses = ["completed", "reviewed"];
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "–";
  const revenue = bookings.filter((b) => b.payment_status === "paid").reduce((s, b) => s + b.price, 0);

  const stats = [
    { icon: ClipboardList, label: "Đơn hôm nay", value: bookings.filter((b) => b.service_date === today).length, tint: "bg-sky/60 text-sky-foreground" },
    { icon: Clock, label: "Đang chờ người dọn", value: bookings.filter((b) => b.status === "searching").length, tint: "bg-amber-100 text-amber-700" },
    { icon: PlayCircle, label: "Đang thực hiện", value: bookings.filter((b) => ["accepted", "in_progress", "photo_sent"].includes(b.status)).length, tint: "bg-indigo-100 text-indigo-700" },
    { icon: CheckCircle2, label: "Đã hoàn thành", value: bookings.filter((b) => doneStatuses.includes(b.status)).length, tint: "bg-mint/60 text-mint-foreground" },
    { icon: Users, label: "Người dùng", value: profiles.length, tint: "bg-primary/10 text-primary" },
    { icon: Star, label: "Đánh giá trung bình", value: `${avg}/5`, tint: "bg-yellow-100 text-yellow-700" },
    { icon: Wallet, label: "Đã xác nhận thanh toán", value: formatVND(revenue), tint: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Bảng điều khiển CleanLink</h1>
            <p className="text-muted-foreground text-sm mt-1">Toàn bộ đơn, người dùng và đánh giá trên hệ thống.</p>
          </div>
          <Button asChild variant="outline"><Link to="/">Về trang chủ</Link></Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border/60 p-5 shadow-card">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.tint}`}><s.icon className="h-4 w-4" /></div>
              <p className="mt-3 text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="bookings" className="mt-10">
          <TabsList>
            <TabsTrigger value="bookings">Đơn dọn ({bookings.length})</TabsTrigger>
            <TabsTrigger value="users">Người dùng ({profiles.length})</TabsTrigger>
            <TabsTrigger value="cleaners">Cộng tác viên ({applications.length})</TabsTrigger>
            <TabsTrigger value="pricing">Bảng giá</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Mã</TableHead><TableHead>Cơ sở</TableHead><TableHead>Chủ cơ sở</TableHead><TableHead>Khu vực</TableHead>
                  <TableHead className="text-right">Số phòng</TableHead><TableHead>Ngày / giờ</TableHead><TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead><TableHead>Người dọn</TableHead><TableHead className="text-right">Giá</TableHead><TableHead />
                </TableRow></TableHeader>
                <TableBody>
                  {bookings.length === 0 && <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">Chưa có đơn nào.</TableCell></TableRow>}
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.code}</TableCell>
                      <TableCell><div className="font-medium">{b.property_name}</div><div className="text-xs text-muted-foreground">{b.address} · {b.phone}</div></TableCell>
                      <TableCell className="text-sm">{nameOf(b.host_id)}</TableCell>
                      <TableCell className="text-sm">{labelFrom(areas, b.area)}</TableCell>
                      <TableCell className="text-right font-semibold">{b.rooms}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(b.service_date).toLocaleDateString("vi-VN")} · {labelFrom(timeSlots, b.time_slot)}
                        {b.urgency === "urgent" && <span className="ml-1 text-[10px] font-medium text-amber-700">GẤP</span>}
                      </TableCell>
                      <TableCell>
                        <Select value={b.status} onValueChange={(value) => void changeBookingStatus(b.id, value)} disabled={savingBooking === b.id}>
                          <SelectTrigger className="min-w-44"><SelectValue /></SelectTrigger>
                          <SelectContent>{Object.entries(statusLabel).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-48 space-y-1">
                        <p className="text-xs text-muted-foreground">{b.payment_method === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</p>
                        <Select value={b.payment_status} onValueChange={(value) => void changePaymentStatus(b.id, value)} disabled={savingBooking === b.id}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{Object.entries(paymentStatusLabel).filter(([value]) => value !== "reported" || b.payment_method === "transfer").map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm">{b.cleaner_name ?? <span className="text-muted-foreground italic">chưa gán</span>}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{formatVND(b.price)}</TableCell>
                      <TableCell><Button asChild size="sm" variant="ghost"><Link to="/don/$id" params={{ id: b.id }}>Xem</Link></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cleaners">
            <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Họ tên</TableHead><TableHead>Số điện thoại</TableHead><TableHead>Khu vực</TableHead>
                  <TableHead>Kinh nghiệm</TableHead><TableHead>Thời gian làm</TableHead><TableHead>Trạng thái</TableHead><TableHead />
                </TableRow></TableHeader>
                <TableBody>
                  {applications.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Chưa có hồ sơ cộng tác viên.</TableCell></TableRow>}
                  {applications.map((application) => {
                    const profile = profiles.find((row) => row.id === application.user_id);
                    return (
                      <TableRow key={application.id}>
                        <TableCell>{profile?.full_name || "—"}</TableCell>
                        <TableCell>{profile?.phone || "—"}</TableCell>
                        <TableCell>{profile?.area ? labelFrom(areas, profile.area) : "—"}</TableCell>
                        <TableCell>{application.work_experience || "Chưa cung cấp"}</TableCell>
                        <TableCell>{application.availability || "Chưa cung cấp"}</TableCell>
                        <TableCell><Badge variant="outline">{application.status === "pending" ? "Chờ duyệt" : application.status === "approved" ? "Đã duyệt" : "Từ chối"}</Badge></TableCell>
                        <TableCell>
                          {application.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" disabled={savingApplication === application.id} onClick={() => void reviewApplication(application, true)}>Duyệt</Button>
                              <Button size="sm" variant="outline" disabled={savingApplication === application.id} onClick={() => void reviewApplication(application, false)}>Từ chối</Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <form onSubmit={(event) => void savePricing(event)} className="max-w-3xl rounded-2xl bg-card border border-border/60 shadow-card p-6">
              <h2 className="text-lg font-semibold">Giá dịch vụ áp dụng cho đơn mới</h2>
              <p className="mt-1 text-sm text-muted-foreground">Giá đã lưu trong các đơn cũ sẽ không thay đổi.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {([
                  ["standard_price", "Phòng tiêu chuẩn / phòng"],
                  ["kitchen_price", "Phòng lớn hoặc có bếp / phòng"],
                  ["urgent_fee_1_2", "Phụ phí gấp, 1–2 phòng"],
                  ["urgent_fee_3_4", "Phụ phí gấp, 3–4 phòng"],
                  ["urgent_fee_5_plus", "Phụ phí gấp, từ 5 phòng"],
                  ["bank_name", "Ngân hàng nhận chuyển khoản"],
                  ["bank_account", "Số tài khoản nhận tiền"],
                  ["bank_account_holder", "Tên chủ tài khoản"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="space-y-2 text-sm font-medium">
                    {label}
                    <Input
                      type={key.endsWith("_price") || key.startsWith("urgent_fee_") ? "number" : "text"}
                      min={key.endsWith("_price") || key.startsWith("urgent_fee_") ? 0 : undefined}
                      step={key.endsWith("_price") || key.startsWith("urgent_fee_") ? 1000 : undefined}
                      value={pricing[key]}
                      onChange={(event) => setPricing((current) => ({
                        ...current,
                        [key]: key.endsWith("_price") || key.startsWith("urgent_fee_")
                          ? Math.max(0, Number(event.target.value) || 0)
                          : event.target.value,
                      }))}
                    />
                  </label>
                ))}
              </div>
              <Button type="submit" className="mt-6" disabled={savingPrice}>
                {savingPrice ? "Đang lưu…" : "Lưu bảng giá"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="users">
            <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Họ tên</TableHead><TableHead>Số điện thoại</TableHead><TableHead>Vai trò</TableHead><TableHead>Cơ sở</TableHead><TableHead>Khu vực</TableHead><TableHead>Ngày tham gia</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell className="space-x-1">{rolesOf(p.id).map((r) => <Badge key={r} variant="outline">{r}</Badge>)}</TableCell>
                      <TableCell className="text-sm">{p.property_name ?? "—"}</TableCell>
                      <TableCell className="text-sm">{p.area ? labelFrom(areas, p.area) : "—"}</TableCell>
                      <TableCell className="text-sm">{new Date(p.created_at).toLocaleDateString("vi-VN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Mã đơn</TableHead><TableHead>Số sao</TableHead><TableHead>Nhận xét</TableHead><TableHead>Ngày</TableHead></TableRow></TableHeader>
                <TableBody>
                  {reviews.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Chưa có đánh giá.</TableCell></TableRow>}
                  {reviews.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{bookings.find((b) => b.id === r.booking_id)?.code ?? "—"}</TableCell>
                      <TableCell>{"★".repeat(r.rating)}</TableCell>
                      <TableCell className="text-sm">{r.comment ?? "—"}</TableCell>
                      <TableCell className="text-sm">{new Date(r.created_at).toLocaleDateString("vi-VN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}
