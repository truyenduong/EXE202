import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Clock3,
  Wallet,
  Building2,
  Camera,
  ListChecks,
  MapPin,
  ArrowRight,
  UserCheck,
  BadgeCheck,
  ClipboardCheck,
} from "lucide-react";
import heroImg from "@/assets/hero-clean.jpg";
import { services } from "@/lib/cleanlink-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CleanLink – Đặt người dọn phòng nhanh tại Quy Nhơn" },
      {
        name: "description",
        content:
          "CleanLink là nền tảng kết nối chủ homestay, khách sạn nhỏ, nhà nghỉ và căn hộ thuê ngắn hạn tại Quy Nhơn với người dọn phù hợp – biết giá trước, theo dõi tiến độ và kiểm tra chất lượng sau khi dọn.",
      },
    ],
  }),
  component: Home,
});

const promises = [
  { icon: Clock3, title: "Tìm người dọn trong giờ cao điểm", desc: "Kết nối nhanh người dọn phù hợp trong khung giờ khách trả phòng – nhận phòng." },
  { icon: Wallet, title: "Biết giá trước khi đặt", desc: "Giá tính theo loại phòng và số phòng, phụ phí dọn gấp hiển thị rõ trước khi xác nhận." },
  { icon: Building2, title: "Phù hợp nhiều loại cơ sở lưu trú", desc: "Homestay, khách sạn nhỏ, nhà nghỉ và căn hộ thuê ngắn hạn." },
  { icon: BadgeCheck, title: "Người dọn có thông tin đáng tin cậy", desc: "Hồ sơ người dọn được xác minh, có lịch sử công việc và đánh giá." },
  { icon: Camera, title: "Có hình ảnh xác nhận sau khi dọn", desc: "Chủ cơ sở kiểm tra chất lượng phòng ngay trên ứng dụng, không cần đến tận nơi." },
  { icon: ListChecks, title: "Hạn chế bỏ sót công việc", desc: "Danh sách 7 công việc chuẩn cho từng phòng, người dọn đánh dấu từng mục." },
];

const flow = [
  { n: 1, title: "Chủ cơ sở đặt lịch", desc: "Điền loại cơ sở, số phòng, khung giờ và khu vực trong khoảng 1 phút." },
  { n: 2, title: "Xem giá và xác nhận", desc: "Giá dự kiến hiển thị rõ theo loại phòng, số phòng và phụ phí (nếu có)." },
  { n: 3, title: "Người dọn nhận việc", desc: "Đơn hiển thị cho người dọn phù hợp ở khu vực gần nhất." },
  { n: 4, title: "Theo dõi tiến độ", desc: "Xem trạng thái đơn: đang đến, đang dọn, đã hoàn thành." },
  { n: 5, title: "Kiểm tra kết quả", desc: "Người dọn gửi hình ảnh và đánh dấu công việc đã hoàn thành." },
  { n: 6, title: "Xác nhận và đánh giá", desc: "Chủ cơ sở xác nhận hoàn tất dịch vụ và để lại đánh giá." },
];

const highlights = [
  { icon: UserCheck, label: "Người dọn có thông tin rõ ràng" },
  { icon: Wallet, label: "Giá được báo trước khi xác nhận" },
  { icon: ClipboardCheck, label: "Dễ kiểm tra chất lượng sau khi dọn" },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-card backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              Nền tảng kết nối chủ cơ sở lưu trú với người dọn tại Quy Nhơn
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground">
              Đặt người dọn phòng nhanh{" "}
              <span className="text-primary">tại Quy Nhơn</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
              CleanLink giúp chủ homestay, khách sạn nhỏ, nhà nghỉ và căn hộ cho thuê ngắn hạn tìm người dọn phù hợp, biết giá trước và kiểm tra chất lượng phòng sau khi hoàn thành.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 shadow-soft">
                <Link to="/dat-lich">
                  Đặt người dọn <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 bg-white/60 backdrop-blur">
                <Link to="/gia-du-kien">Xem giá dự kiến</Link>
              </Button>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-3 text-sm">
              {highlights.map((h) => (
                <li key={h.label} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 text-primary shadow-card">
                    <h.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium text-foreground">{h.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-soft aspect-[4/3]">
              <img src={heroImg} alt="Phòng homestay Quy Nhơn sạch sẽ sau khi CleanLink hoàn tất" width={1600} height={1200} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Vì sao chủ cơ sở chọn CleanLink?</h2>
          <p className="mt-3 text-muted-foreground">Được thiết kế cho bài toán dọn phòng giữa các lượt khách ngắn ngày.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promises.map((b) => (
            <div key={b.title} className="rounded-2xl bg-card p-6 shadow-card border border-border/60 hover:-translate-y-1 transition-transform">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/50 text-mint-foreground">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLOW */}
      <section className="bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Quy trình sử dụng CleanLink</h2>
            <p className="mt-3 text-muted-foreground">Sáu bước, từ đặt lịch đến đánh giá.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {flow.map((s) => (
              <div key={s.n} className="rounded-2xl bg-card p-6 border border-border/60 shadow-card relative">
                <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-soft">
                  {s.n}
                </div>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Gói dịch vụ</h2>
            <p className="mt-2 text-muted-foreground">Hai gói dọn phòng cốt lõi cho cơ sở lưu trú ngắn hạn.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary">
            <Link to="/dich-vu">Xem tất cả <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.slice(0, 3).map((s) => (
            <div key={s.slug} className="group rounded-2xl bg-card p-6 shadow-card border border-border/60 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/60 text-sky-foreground">
                  <s.icon className="h-6 w-6" />
                </div>
                {s.tag && <span className="text-xs rounded-full bg-mint/60 text-mint-foreground px-2 py-1 font-medium">{s.tag}</span>}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s.duration}</span>
                <span className="font-semibold text-primary">{s.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-20">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 shadow-soft text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Cần chuẩn bị phòng cho khách mới?</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Nhập số phòng, địa chỉ và thời gian cần dọn để xem giá trước khi xác nhận.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link to="/dat-lich">Đặt người dọn</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/gia-du-kien">Xem giá dự kiến</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm opacity-90">Theo dõi tiến độ và kiểm tra kết quả ngay trên CleanLink.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
