import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { DEFAULT_SERVICE_PRICING, formatVND, services, type ServicePricing } from "@/lib/cleanlink-data";
import { fetchServicePricing } from "@/lib/service-pricing";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dich-vu")({
  head: () => ({
    meta: [
      { title: "Dịch vụ dọn phòng lưu trú – CleanLink" },
      { name: "description", content: "Ba gói dọn phòng cốt lõi cho homestay, mini hotel, căn hộ thuê ngắn hạn tại Quy Nhơn – kèm checklist và ảnh xác nhận." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [pricing, setPricing] = useState<ServicePricing>(DEFAULT_SERVICE_PRICING);
  const core = services.slice(0, 3);
  const features = services.slice(3, 5);
  const expansion = services.slice(5);

  useEffect(() => {
    void fetchServicePricing()
      .then(setPricing)
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Không tải được bảng giá.");
      });
  }, []);

  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Dịch vụ CleanLink</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Chỉ tập trung vào bài toán turnover phòng cho cơ sở lưu trú ngắn hạn.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <h2 className="text-2xl font-bold">Dịch vụ chính</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {core.map((s) => {
            const price = s.slug === "co-ban"
              ? `${formatVND(pricing.standard_price)}/phòng`
              : s.slug === "phong-lon"
                ? `${formatVND(pricing.kitchen_price)}/phòng`
                : `Từ ${formatVND(pricing.standard_price)}/phòng`;
            return (
            <div key={s.slug} className="rounded-2xl bg-card p-7 shadow-card border border-border/60 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/50 text-mint-foreground">
                  <s.icon className="h-6 w-6" />
                </div>
                {s.tag && <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-1 font-medium">{s.tag}</span>}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{s.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/60 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Thời gian</p>
                  <p className="font-medium">{s.duration}</p>
                </div>
                <div className="rounded-lg bg-muted/60 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Giá</p>
                  <p className="font-semibold text-primary">{price}</p>
                </div>
              </div>
              <Button asChild className="mt-5 rounded-full">
                <Link to="/dat-lich">Đặt dịch vụ này <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            );
          })}
        </div>

        <h2 className="mt-16 text-2xl font-bold">Đi kèm mọi đơn</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {features.map((s) => (
            <div key={s.slug} className="rounded-2xl bg-gradient-soft p-7 border border-border/60 flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shrink-0">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <p className="mt-3 text-xs text-primary font-medium">{s.price}</p>
              </div>
            </div>
          ))}
        </div>

        {expansion.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl font-bold">Dịch vụ mở rộng (sắp mở)</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {expansion.map((s) => (
                <div key={s.slug} className="rounded-2xl bg-card p-6 border border-dashed border-border shadow-card/50 opacity-90">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/60 text-sky-foreground">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.price}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
