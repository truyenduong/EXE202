import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Landmark, Wallet } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fetchBooking, type BookingRow } from "@/lib/bookings";
import { DEFAULT_SERVICE_PRICING, formatVND, type ServicePricing } from "@/lib/cleanlink-data";
import { fetchServicePricing } from "@/lib/service-pricing";

export const Route = createFileRoute("/thanh-toan")({
  validateSearch: (search: Record<string, unknown>) => ({
    bookingId: typeof search.bookingId === "string" ? search.bookingId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Thanh toán – CleanLink" },
      {
        name: "description",
        content: "Thanh toán tiền mặt hoặc chuyển khoản cho đơn dịch vụ CleanLink.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { bookingId } = Route.useSearch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [pricing, setPricing] = useState<ServicePricing>(DEFAULT_SERVICE_PRICING);
  const [loading, setLoading] = useState(true);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const next = bookingId
        ? `/thanh-toan?bookingId=${encodeURIComponent(bookingId)}`
        : "/thanh-toan";
      void navigate({ to: "/dang-nhap", search: { next }, replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, bookingId]);

  useEffect(() => {
    if (!bookingId || !user) {
      setLoading(false);
      return;
    }
    void fetchBooking(bookingId)
      .then(setBooking)
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Không tải được thông tin đơn.");
      })
      .finally(() => setLoading(false));
  }, [bookingId, user]);

  useEffect(() => {
    void fetchServicePricing()
      .then(setPricing)
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Không tải được thông tin chuyển khoản.",
        );
      });
  }, []);

  async function reportTransfer() {
    if (!booking || !user) return;
    setReporting(true);
    const { data, error } = await supabase
      .from("bookings")
      .update({ payment_status: "reported", updated_at: new Date().toISOString() })
      .eq("id", booking.id)
      .eq("host_id", user.id)
      .select("*")
      .single();
    setReporting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setBooking(data as BookingRow);
    toast.success("Đã báo chuyển khoản. CleanLink sẽ xác nhận sau khi kiểm tra.");
  }

  if (authLoading || loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">
          Đang tải thông tin đơn…
        </div>
      </SiteLayout>
    );
  }

  if (!bookingId) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Chọn đơn cần thanh toán</h1>
          <p className="mt-2 text-muted-foreground">
            Mở thanh toán từ chi tiết đơn để xem đúng số tiền và trạng thái.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/theo-doi-don">Xem đơn của tôi</Link>
          </Button>
        </section>
      </SiteLayout>
    );
  }

  if (!booking || (!isAdmin && booking.host_id !== user?.id)) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy đơn</h1>
          <p className="mt-2 text-muted-foreground">
            Đơn không tồn tại hoặc bạn không có quyền xem thông tin thanh toán.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/theo-doi-don">Về danh sách đơn</Link>
          </Button>
        </section>
      </SiteLayout>
    );
  }

  const paid = booking.payment_status === "paid";
  const reported = booking.payment_status === "reported";
  const transferDetailsReady = Boolean(
    pricing.bank_name && pricing.bank_account && pricing.bank_account_holder,
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 md:px-6 py-12">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          Thanh toán đơn {booking.code}
        </p>
        <h1 className="mt-1 text-3xl font-bold">Thanh toán đơn dịch vụ</h1>
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Tổng tiền</span>
            <span className="text-2xl font-bold text-primary">{formatVND(booking.price)}</span>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
            {booking.payment_method === "cash" ? (
              <Wallet className="h-5 w-5 text-primary" />
            ) : (
              <Landmark className="h-5 w-5 text-primary" />
            )}
            <div>
              <p className="font-medium">
                {booking.payment_method === "cash" ? "Tiền mặt" : "Chuyển khoản ngân hàng"}
              </p>
              <p className="text-sm text-muted-foreground">
                {paid
                  ? "Đã được quản trị viên xác nhận"
                  : reported
                    ? "Đã báo chuyển khoản, đang chờ xác nhận"
                    : "Chưa thanh toán"}
              </p>
            </div>
            {paid && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
          </div>
        </div>

        {!paid && booking.payment_method === "cash" && (
          <div className="mt-5 rounded-2xl border border-border/60 bg-mint/20 p-5 text-sm">
            Thanh toán tiền mặt cho người dọn sau khi dịch vụ hoàn tất. Trạng thái sẽ được CleanLink
            xác nhận thủ công.
          </div>
        )}

        {!paid && booking.payment_method === "transfer" && (
          <div className="mt-5 rounded-2xl border border-border/60 bg-card p-5">
            <h2 className="font-semibold">Thông tin chuyển khoản</h2>
            {transferDetailsReady ? (
              <dl className="mt-3 space-y-2 text-sm">
                <PaymentInfo label="Ngân hàng" value={pricing.bank_name} />
                <PaymentInfo label="Số tài khoản" value={pricing.bank_account} />
                <PaymentInfo label="Chủ tài khoản" value={pricing.bank_account_holder} />
                <PaymentInfo label="Nội dung chuyển khoản" value={`CLEANLINK ${booking.code}`} />
                <PaymentInfo label="Số tiền" value={formatVND(booking.price)} />
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                CleanLink chưa cấu hình tài khoản nhận tiền. Vui lòng liên hệ hỗ trợ trước khi
                chuyển khoản.
              </p>
            )}
            {reported && (
              <p className="mt-4 text-sm text-primary">
                Bạn đã báo chuyển khoản. Vui lòng chờ quản trị viên xác nhận giao dịch.
              </p>
            )}
            {!reported && transferDetailsReady && booking.host_id === user?.id && (
              <Button
                className="mt-5 rounded-full"
                disabled={reporting}
                onClick={() => void reportTransfer()}
              >
                {reporting ? "Đang gửi…" : "Tôi đã chuyển khoản"}
              </Button>
            )}
          </div>
        )}

        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/don/$id" params={{ id: booking.id }}>
            Quay lại chi tiết đơn
          </Link>
        </Button>
      </section>
    </SiteLayout>
  );
}

function PaymentInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
