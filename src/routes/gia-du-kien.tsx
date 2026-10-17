import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  estimatePrice,
  formatVND,
  urgentFee,
  DEFAULT_SERVICE_PRICING,
  type ServicePricing,
  areas,
  timeSlots,
  labelFrom,
} from "@/lib/cleanlink-data";
import { Zap, Info } from "lucide-react";
import { fetchServicePricing } from "@/lib/service-pricing";

export const Route = createFileRoute("/gia-du-kien")({
  head: () => ({
    meta: [
      { title: "Giá dự kiến – CleanLink Quy Nhơn" },
      { name: "description", content: "Ước tính giá dọn phòng theo loại phòng, số phòng và phụ phí dọn gấp cho cơ sở lưu trú tại Quy Nhơn." },
    ],
  }),
  component: PricingPage,
});

const priceRows = [
  { rooms: 1 },
  { rooms: 2 },
  { rooms: 3 },
  { rooms: 4 },
  { rooms: 5 },
];

function PricingPage() {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<ServicePricing>(DEFAULT_SERVICE_PRICING);
  const [rooms, setRooms] = useState(3);
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [roomType, setRoomType] = useState<"standard" | "kitchen">("standard");
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("trung_tam");
  const [timeSlot, setTimeSlot] = useState("13-14");

  const price = estimatePrice(rooms, urgency, roomType, pricing);
  const overLimit = rooms > 5;

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
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Giá dự kiến</h1>
          <p className="mt-4 text-muted-foreground">
            Giá tính theo loại phòng và số phòng, phụ phí dọn gấp hiển thị rõ – biết trước khi xác nhận.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 py-14 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Bảng giá theo số phòng */}
          <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60">
              <h2 className="font-semibold">Bảng giá theo số phòng</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Không áp dụng giảm giá theo số phòng ở giai đoạn hiện tại.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Số phòng</th>
                    <th className="text-right px-6 py-3 font-medium">Tiêu chuẩn ({formatVND(pricing.standard_price)}/phòng)</th>
                    <th className="text-right px-6 py-3 font-medium">Phòng lớn / có bếp ({formatVND(pricing.kitchen_price)}/phòng)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {priceRows.map((r) => (
                    <tr key={r.rooms}>
                      <td className="px-6 py-3 font-medium">{r.rooms} phòng</td>
                      <td className="px-6 py-3 text-right">{formatVND(pricing.standard_price * r.rooms)}</td>
                      <td className="px-6 py-3 text-right">{formatVND(pricing.kitchen_price * r.rooms)}</td>
                    </tr>
                  ))}
                  <tr className="bg-mint/20">
                    <td className="px-6 py-3 font-medium">Trên 5 phòng</td>
                    <td className="px-6 py-3 text-right text-primary font-medium" colSpan={2}>
                      Liên hệ báo giá
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Phụ phí dọn gấp */}
          <div className="rounded-3xl bg-card border border-border/60 shadow-card p-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" /> Phụ phí dọn gấp
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Phụ phí tính theo đơn, không tính riêng từng phòng, hiển thị trước khi xác nhận.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "1 – 2 phòng", fee: pricing.urgent_fee_1_2 },
                { label: "3 – 4 phòng", fee: pricing.urgent_fee_3_4 },
                { label: "Từ 5 phòng", fee: pricing.urgent_fee_5_plus },
              ].map((u) => (
                <div key={u.label} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">{u.label}</p>
                  <p className="mt-1 font-semibold text-primary">{formatVND(u.fee)}/đơn</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ví dụ */}
          <div className="rounded-3xl bg-gradient-soft border border-border/60 p-6">
            <h2 className="font-semibold">Ví dụ tính giá</h2>
            <p className="text-xs text-muted-foreground mt-1">Tổng dự kiến = Đơn giá loại phòng × Số phòng + Phụ phí dọn gấp (nếu có).</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between border-b border-border/40 pb-2">
                <span>2 phòng tiêu chuẩn, không gấp</span>
                <span className="font-semibold">{formatVND(estimatePrice(2, "normal", "standard", pricing).total)}</span>
              </li>
              <li className="flex justify-between border-b border-border/40 pb-2">
                <span>3 phòng tiêu chuẩn, dọn gấp</span>
                <span className="font-semibold">{formatVND(estimatePrice(3, "urgent", "standard", pricing).total)}</span>
              </li>
              <li className="flex justify-between border-b border-border/40 pb-2">
                <span>5 phòng tiêu chuẩn, dọn gấp</span>
                <span className="font-semibold">{formatVND(estimatePrice(5, "urgent", "standard", pricing).total)}</span>
              </li>
              <li className="flex justify-between">
                <span>2 phòng có bếp, không gấp</span>
                <span className="font-semibold">{formatVND(estimatePrice(2, "normal", "kitchen", pricing).total)}</span>
              </li>
            </ul>
          </div>
        </div>

        <aside className="rounded-3xl bg-card border border-border/60 shadow-card p-6 h-fit lg:sticky lg:top-24 space-y-5">
          <div>
            <h3 className="font-semibold">Ước tính cho đơn của bạn</h3>
            <p className="text-xs text-muted-foreground">Nhập thông tin để xem giá trước khi xác nhận.</p>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <Label htmlFor="pname">Cơ sở</Label>
              <Input id="pname" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} placeholder="Tên cơ sở" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="paddr">Địa chỉ</Label>
              <Input id="paddr" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ cụ thể" className="mt-1.5" />
            </div>
            <div>
              <Label>Khu vực</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {areas.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loại phòng</Label>
              <RadioGroup
                value={roomType}
                onValueChange={(v) => setRoomType(v as "standard" | "kitchen")}
                className="mt-1.5 grid gap-2"
              >
                {[
                  { v: "standard", l: "Tiêu chuẩn (120.000đ)" },
                  { v: "kitchen", l: "Phòng lớn / có bếp (150.000đ)" },
                ].map((o) => (
                  <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-mint/30">
                    <RadioGroupItem value={o.v} />
                    <span className="text-xs font-medium">{o.l}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="r-slider">Số phòng: {rooms}</Label>
              <input
                id="r-slider"
                type="range"
                min={1}
                max={15}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>
            <div>
              <Label>Khung giờ</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mức độ</Label>
              <RadioGroup
                value={urgency}
                onValueChange={(v) => setUrgency(v as "normal" | "urgent")}
                className="mt-1.5 grid gap-2"
              >
                {[
                  { v: "normal", l: "Bình thường" },
                  { v: "urgent", l: `Gấp (+${formatVND(urgentFee(rooms, pricing))})` },
                ].map((o) => (
                  <label key={o.v} className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-mint/30">
                    <RadioGroupItem value={o.v} />
                    <span className="text-xs font-medium">{o.l}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Cơ sở</span><span className="truncate max-w-[60%] text-right text-foreground">{propertyName || "—"}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Địa chỉ</span><span className="truncate max-w-[60%] text-right text-foreground">{address || "—"}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Khu vực</span><span className="text-foreground">{labelFrom(areas, area)}</span>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Loại phòng</span><span>{roomType === "kitchen" ? "Phòng lớn / có bếp" : "Tiêu chuẩn"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Số phòng</span><span>{rooms} phòng</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Khung giờ</span><span>{labelFrom(timeSlots, timeSlot)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Mức độ</span><span>{urgency === "urgent" ? "Gấp" : "Bình thường"}</span></div>
            <div className="flex justify-between border-t border-border/40 pt-2"><span className="text-muted-foreground">Đơn giá/phòng</span><span>{formatVND(price.perRoom)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatVND(price.subtotal)}</span></div>
            {urgency === "urgent" && (
              <div className="flex justify-between text-amber-700"><span className="flex items-center gap-1"><Zap className="h-3 w-3" />Phụ phí dọn gấp</span><span>{formatVND(price.urgentFee)}</span></div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
              <span className="font-medium">Tổng dự kiến</span>
              <span className="text-2xl font-bold text-primary">{formatVND(price.total)}</span>
            </div>
            {overLimit && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                Trên 5 phòng vui lòng liên hệ để nhận báo giá chính xác.
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Button className="w-full rounded-full" onClick={() => navigate({ to: "/dat-lich" })}>
              Xác nhận đặt lịch
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link to="/dat-lich">Quay lại chỉnh sửa</Link>
            </Button>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
