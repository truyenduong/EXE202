import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Upload } from "lucide-react";
import heroImg from "@/assets/hero-clean.jpg";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/anh-xac-nhan")({
  head: () => ({
    meta: [
      { title: "Hình ảnh sau khi dọn – CleanLink" },
      { name: "description", content: "Gửi hình ảnh trước và sau khi dọn phòng cho chủ cơ sở lưu trú để kiểm tra chất lượng từ xa." },
    ],
  }),
  component: PhotoPage,
});

function PhotoPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 md:px-6 py-10">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">Đơn CL240712 · Mai House Homestay</p>
        <h1 className="mt-1 text-3xl font-bold">Hình ảnh sau khi dọn</h1>
        <p className="mt-2 text-muted-foreground">
          Chụp lại phòng trước và sau khi dọn để chủ cơ sở kiểm tra chất lượng từ xa.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <PhotoSlot label="Ảnh trước khi dọn" timestamp="13:12" sender="Nguyễn Thị Lan" sent={sent} />
          <PhotoSlot label="Ảnh sau khi dọn" timestamp="13:52" sender="Nguyễn Thị Lan" sent={sent} isAfter />
        </div>

        <div className="mt-8 rounded-2xl bg-card border border-border/60 shadow-card p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-mint/60 text-primary flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {sent ? "Hình ảnh đã được gửi cho chủ cơ sở." : "Sẵn sàng gửi hình ảnh xác nhận"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {sent
                  ? "Người gửi: Nguyễn Thị Lan · Gửi lúc 13:52 · Chủ cơ sở đã nhận được thông báo."
                  : "2 ảnh đã chụp · Người gửi: Nguyễn Thị Lan · sẵn sàng gửi cho chủ cơ sở."}
              </p>
            </div>
            <Button
              className="rounded-full"
              onClick={() => {
                setSent(true);
                toast.success("Hình ảnh đã được gửi cho chủ cơ sở");
              }}
              disabled={sent}
            >
              {sent ? "Đã gửi" : "Gửi ảnh xác nhận"}
            </Button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button asChild variant="outline" className="rounded-full flex-1"><Link to="/checklist">Về danh sách công việc</Link></Button>
          <Button asChild className="rounded-full flex-1"><Link to="/theo-doi-don">Xem trạng thái đơn</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function PhotoSlot({
  label,
  timestamp,
  sender,
  sent,
  isAfter,
}: {
  label: string;
  timestamp: string;
  sender: string;
  sent: boolean;
  isAfter?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        <img
          src={heroImg}
          alt={label}
          className={`h-full w-full object-cover ${isAfter ? "" : "grayscale-[35%] brightness-90"}`}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white text-xs flex items-center justify-between">
          <span>{label}</span>
          <span>{timestamp}</span>
        </div>
      </div>
      <div className="px-4 pt-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>Người gửi: {sender}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sent ? "bg-emerald-100 text-emerald-700" : "bg-muted"}`}>
          {sent ? "Đã gửi" : "Chưa gửi"}
        </span>
      </div>
      <div className="p-4 flex gap-2">
        <Button size="sm" variant="outline" className="rounded-full flex-1"><Camera className="h-3.5 w-3.5 mr-1" /> Chụp ảnh</Button>
        <Button size="sm" variant="ghost" className="rounded-full"><Upload className="h-3.5 w-3.5 mr-1" /> Tải ảnh lên</Button>
      </div>
    </div>
  );
}
