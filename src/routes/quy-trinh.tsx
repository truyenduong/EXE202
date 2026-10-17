import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Calculator,
  UserCheck,
  Route as RouteIcon,
  Camera,
  Star,
  Wrench,
  BedDouble,
} from "lucide-react";

export const Route = createFileRoute("/quy-trinh")({
  head: () => ({
    meta: [
      { title: "Quy trình sử dụng CleanLink" },
      { name: "description", content: "Sáu bước sử dụng CleanLink, từ đặt lịch dọn phòng đến đánh giá – dành cho chủ cơ sở lưu trú tại Quy Nhơn." },
    ],
  }),
  component: ProcessPage,
});

const steps = [
  { icon: ClipboardList, title: "Chủ cơ sở đặt lịch", desc: "Chọn loại cơ sở, loại phòng, số phòng, khung giờ và khu vực." },
  { icon: Calculator, title: "Xem giá và xác nhận", desc: "Giá dự kiến và phụ phí dọn gấp hiển thị rõ trước khi xác nhận." },
  { icon: UserCheck, title: "Người dọn nhận việc", desc: "Đơn hiển thị cho người dọn phù hợp ở khu vực gần nhất." },
  { icon: RouteIcon, title: "Theo dõi tiến độ", desc: "Xem trạng thái đơn: đang đến, đang dọn, đã hoàn thành." },
  { icon: Camera, title: "Kiểm tra kết quả", desc: "Người dọn gửi hình ảnh sau khi dọn để chủ cơ sở kiểm tra từ xa." },
  { icon: Star, title: "Xác nhận và đánh giá", desc: "Chủ cơ sở xác nhận hoàn tất dịch vụ và để lại đánh giá." },
];

const cleanerTools = [
  "Dụng cụ vệ sinh cơ bản",
  "Khăn lau",
  "Chổi, cây lau sàn",
  "Chất tẩy rửa thông thường",
];

const hostTools = [
  "Ga giường sạch",
  "Khăn mới",
  "Nước uống, giấy vệ sinh và vật dụng thay thế",
  "Đồ dùng riêng theo tiêu chuẩn của cơ sở",
];

function ProcessPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Quy trình sử dụng CleanLink</h1>
          <p className="mt-4 text-muted-foreground">Sáu bước, từ đặt lịch đến đánh giá – chuẩn cho cơ sở lưu trú ngắn hạn.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-card border border-border/60 p-6 shadow-card relative">
              <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-soft">
                {i + 1}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/50 text-mint-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Dụng cụ */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/50 text-mint-foreground">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Người dọn chuẩn bị</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {cleanerTools.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/60 text-sky-foreground">
                <BedDouble className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Chủ cơ sở chuẩn bị</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {hostTools.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Ghi chú: Gói dọn cơ bản không bao gồm chi phí giặt ga, khăn hoặc cung cấp vật dụng mới.
        </p>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/dat-lich">Bắt đầu đặt lịch</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
