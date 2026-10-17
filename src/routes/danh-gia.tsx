import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Star } from "lucide-react";

export const Route = createFileRoute("/danh-gia")({
  head: () => ({
    meta: [
      { title: "Đánh giá – CleanLink" },
      { name: "description", content: "Đánh giá thực tế từ chủ homestay, mini hotel và căn hộ thuê ngắn hạn tại Quy Nhơn." },
    ],
  }),
  component: ReviewsPage,
});

const reviews = [
  { name: "Chị Ngân", role: "Chủ Mai House Homestay · Trung tâm Quy Nhơn", rating: 5, text: "Turnover 5 phòng chỉ trong 1 giờ trước giờ check-in. Ảnh xác nhận gửi đầy đủ, mình không cần chạy tới nữa." },
  { name: "Anh Tú", role: "Seaview Mini Hotel · Nhơn Lý", rating: 5, text: "Có tracking rõ ràng, đội ngũ 2 người tới đúng giờ, checklist 7 hạng mục làm mình yên tâm cho khách check-in." },
  { name: "Chị Hà", role: "Bãi Xếp Ocean Studio", rating: 5, text: "Đặt trong khung 11–12h là được xử lý ngay. Rất tiện cho studio Airbnb mình cho thuê ngắn hạn." },
  { name: "Anh Long", role: "Eo Gió Sunset Home", rating: 4, text: "Người dọn chuyên nghiệp, có lần trễ 10 phút nhưng CleanLink báo trước và bồi hoàn phụ phí gấp." },
  { name: "Chị Lan", role: "Chủ 3 căn hộ Airbnb trung tâm", rating: 5, text: "Chi phí rõ ràng theo số phòng, thanh toán trên app tiện. Không còn phải quản lý người dọn thủ công như trước." },
  { name: "Anh Đức", role: "Nhơn Hải Beach Villa", rating: 5, text: "Cuối tuần cao điểm mà vẫn được điều phối đội 4 người – rất phù hợp cho mini hotel." },
];

function ReviewsPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Chủ cơ sở nói gì về CleanLink</h1>
          <div className="mt-5 flex items-center justify-center gap-1">
            {[0,1,2,3,4].map((i) => <Star key={i} className="h-6 w-6 fill-primary text-primary" />)}
            <span className="ml-2 font-semibold">4.8/5 · 620+ đánh giá tại Quy Nhơn</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl bg-card p-6 border border-border/60 shadow-card">
              <div className="flex items-center gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                {Array.from({ length: 5 - r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-muted-foreground/40" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-border/60">
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
