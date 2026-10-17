import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { CalendarPlus, ClipboardList, LogOut, Phone, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { roleLabel } from "@/lib/auth";

const TITLE = "Tài khoản của tôi – CleanLink";
const DESC =
  "Xem thông tin tài khoản CleanLink, vai trò sử dụng và truy cập nhanh các chức năng đặt người dọn hoặc nhận việc tại Quy Nhơn.";

export const Route = createFileRoute("/tai-khoan")({
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
  component: AccountPage,
});

function AccountPage() {
  const { user, profile, role, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      void navigate({ to: "/dang-nhap", search: { next: "/tai-khoan" }, replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Bạn đã đăng xuất.");
    void navigate({ to: "/dang-nhap", search: { next: undefined }, replace: true });
  }

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">
          Đang tải thông tin tài khoản…
        </div>
      </SiteLayout>
    );
  }

  const isCleaner = role === "cleaner";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <h1 className="text-2xl font-bold md:text-3xl">Tài khoản của tôi</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thông tin đăng ký của bạn trên CleanLink.
        </p>

        <Card className="mt-6 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">{profile?.full_name || "Người dùng CleanLink"}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {role ? roleLabel[role] : "Chủ cơ sở lưu trú"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{profile?.phone || "—"}</span>
            </div>
            {profile?.property_name && (
              <div className="text-muted-foreground">Cơ sở: {profile.property_name}</div>
            )}
            {profile?.area && <div className="text-muted-foreground">Khu vực: {profile.area}</div>}
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap gap-2">
          {isCleaner ? (
            <>
              <Button asChild className="rounded-full">
                <Link to="/nguoi-don">
                  <ClipboardList className="h-4 w-4" />
                  Xem công việc mới
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/checklist">Danh sách công việc</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="rounded-full">
                <Link to="/dat-lich">
                  <CalendarPlus className="h-4 w-4" />
                  Đặt người dọn
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/theo-doi-don">Theo dõi đơn</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" className="rounded-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
