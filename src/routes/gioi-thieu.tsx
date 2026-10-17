import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MapPin, Clock, ShieldCheck, HeartHandshake, Eye, Zap } from "lucide-react";

export const Route = createFileRoute("/gioi-thieu")({
  head: () => ({
    meta: [
      { title: "Giới thiệu CleanLink" },
      { name: "description", content: "CleanLink là nền tảng đặt người dọn dành riêng cho chủ homestay, mini hotel và căn hộ thuê ngắn hạn tại Quy Nhơn." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Zap, title: "Nhanh trong turnover", desc: "Điều phối người dọn trong khung giờ check-out/check-in." },
  { icon: MapPin, title: "Am hiểu Quy Nhơn", desc: "Đội ngũ người dọn phủ toàn thành phố và ven biển." },
  { icon: Clock, title: "Đúng giờ", desc: "Cam kết phòng sẵn sàng trước giờ khách check-in." },
  { icon: ShieldCheck, title: "An toàn", desc: "Người dọn được xác minh danh tính và đào tạo." },
  { icon: HeartHandshake, title: "Hai bên đều thắng", desc: "Chủ cơ sở tiết kiệm chi phí vận hành, người dọn có thu nhập ổn định." },
  { icon: Eye, title: "Minh bạch", desc: "Giá, tracking, checklist và ảnh xác nhận – tất cả trên app." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Về CleanLink</h1>
          <p className="mt-5 text-muted-foreground text-lg">
            Chúng tôi tin rằng chủ homestay và mini hotel tại Quy Nhơn xứng đáng có một công cụ turnover phòng chuyên nghiệp, thay vì phải tự tìm người dọn qua nhóm Zalo mỗi ngày.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-16">
        <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>
            <strong className="text-foreground">CleanLink</strong> là nền tảng hai phía dành riêng cho ngành lưu trú ngắn hạn tại Quy Nhơn.
            Một phía là chủ homestay, mini hotel, căn hộ Airbnb; phía còn lại là đội ngũ người dọn địa phương đã qua xác minh và đào tạo.
          </p>
          <p>
            Chúng tôi tập trung giải quyết đúng một bài toán: <strong className="text-foreground">turnover phòng trong khung giờ check-out/check-in</strong>.
            Bằng cách đưa toàn bộ flow lên app – đặt lịch, giá dự kiến, tracking, checklist, ảnh xác nhận, thanh toán và đánh giá – CleanLink giúp
            chủ cơ sở tiết kiệm 30–50% thời gian điều phối mỗi ngày.
          </p>
        </div>

        <h2 className="mt-14 text-2xl md:text-3xl font-bold text-center">Giá trị cốt lõi</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl bg-card p-6 border border-border/60 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/60 text-sky-foreground">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
