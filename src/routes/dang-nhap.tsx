import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { isValidPhone, normalizePhone, phoneToEmail, type AppRole } from "@/lib/auth";

const TITLE = "Đăng nhập & Đăng ký bằng số điện thoại – CleanLink";
const DESC =
  "Đăng nhập hoặc tạo tài khoản CleanLink bằng số điện thoại để đặt người dọn phòng, theo dõi đơn và nhận việc tại Quy Nhơn.";

export const Route = createFileRoute("/dang-nhap")({
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
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search['next'] === "string" ? (search['next'] as string) : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/dang-nhap" });
  const nextPath = search.next && search.next.startsWith("/") ? search.next : "/tai-khoan";

  const [loading, setLoading] = useState(false);

  // Đăng nhập
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Đăng ký
  const [role, setRole] = useState<AppRole>("host");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [area, setArea] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhone(loginPhone)) {
      toast.error("Số điện thoại không hợp lệ (ví dụ 0905123456).");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(loginPhone),
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      toast.error("Số điện thoại hoặc mật khẩu chưa đúng.");
      return;
    }
    toast.success("Đăng nhập thành công.");
    void navigate({ to: nextPath });
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên.");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Số điện thoại không hợp lệ (ví dụ 0905123456).");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại chưa khớp.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: phoneToEmail(phone),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          phone: normalizePhone(phone),
          full_name: fullName.trim(),
          property_name: role === "host" ? propertyName.trim() : "",
          area: area.trim(),
          role,
          ...(role === "cleaner" ? {
            work_experience: workExperience.trim(),
            availability: availability.trim(),
          } : {}),
        },
      },
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      toast.error(
        msg.includes("registered") || msg.includes("exists")
          ? "Số điện thoại này đã có tài khoản. Vui lòng đăng nhập."
          : "Không tạo được tài khoản. Vui lòng thử lại.",
      );
      return;
    }
    toast.success(
      role === "cleaner"
        ? "Đã gửi đăng ký cộng tác viên. Tài khoản sẽ được kích hoạt sau khi quản trị viên duyệt."
        : "Tạo tài khoản thành công.",
    );
    void navigate({ to: role === "cleaner" ? "/nguoi-don" : nextPath });
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-16">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">Đăng nhập & Đăng ký</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Dùng số điện thoại để đăng nhập CleanLink. Chủ cơ sở lưu trú đặt người dọn, người dọn nhận
            việc và cập nhật công việc.
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Tài khoản CleanLink</CardTitle>
            <CardDescription>Số điện thoại là tên đăng nhập của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="signup">Đăng ký</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-5">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone">Số điện thoại</Label>
                    <Input
                      id="login-phone"
                      inputMode="tel"
                      placeholder="0905 123 456"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="h-4 w-4" />
                    )}
                    Đăng nhập
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-5">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bạn đăng ký với vai trò</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(v) => setRole(v as AppRole)}
                      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                    >
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-mint/30">
                        <RadioGroupItem value="host" id="role-host" />
                        Chủ cơ sở lưu trú
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-mint/30">
                        <RadioGroupItem value="cleaner" id="role-cleaner" />
                        Người dọn
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Họ và tên</Label>
                      <Input
                        id="full-name"
                        placeholder="Nguyễn Thị Lan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Số điện thoại</Label>
                      <Input
                        id="signup-phone"
                        inputMode="tel"
                        placeholder="0905 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {role === "cleaner" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="cleaner-experience">Kinh nghiệm dọn dẹp</Label>
                        <Input
                          id="cleaner-experience"
                          placeholder="Ví dụ: 1 năm, chưa có kinh nghiệm"
                          value={workExperience}
                          onChange={(e) => setWorkExperience(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cleaner-availability">Thời gian có thể làm</Label>
                        <Input
                          id="cleaner-availability"
                          placeholder="Ví dụ: các ngày trong tuần, 8:00–17:00"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {role === "host" && (
                      <div className="space-y-2">
                        <Label htmlFor="property">Tên cơ sở lưu trú</Label>
                        <Input
                          id="property"
                          placeholder="Mai House Homestay"
                          value={propertyName}
                          onChange={(e) => setPropertyName(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="area">Khu vực</Label>
                      <Input
                        id="area"
                        placeholder="Trung tâm Quy Nhơn"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Ít nhất 6 ký tự"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Nhập lại mật khẩu</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Tạo tài khoản
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Bằng việc tiếp tục, bạn đồng ý để CleanLink sử dụng số điện thoại nhằm liên hệ về đơn dọn
          phòng.{" "}
          <Link to="/ho-tro" className="text-primary underline">
            Cần hỗ trợ?
          </Link>
        </p>
      </section>
    </SiteLayout>
  );
}
