import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MessageCircle, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/ho-tro")({
  head: () => ({
    meta: [
      { title: "Hỗ trợ & khiếu nại – CleanLink" },
      { name: "description", content: "Gửi khiếu nại hoặc yêu cầu hỗ trợ về đơn dọn phòng CleanLink tại Quy Nhơn." },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  { q: "Tôi có thể đổi khung giờ dọn không?", a: "Có, bạn có thể đổi khung giờ trước 2 giờ so với thời gian dọn đã đặt." },
  { q: "Người dọn không đến đúng giờ thì sao?", a: "CleanLink sẽ điều phối người dọn thay thế và bồi hoàn phụ phí gấp nếu có." },
  { q: "Chất lượng không đạt thì xử lý ra sao?", a: "Bạn có thể gửi khiếu nại kèm ảnh trong 24 giờ – CleanLink sẽ xử lý trong vòng 12 giờ." },
  { q: "Có xuất hóa đơn cho cơ sở lưu trú không?", a: "Có, CleanLink hỗ trợ xuất hóa đơn định kỳ hằng tháng cho homestay/mini hotel." },
];

function SupportPage() {
  const [type, setType] = useState("complaint");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Đã gửi yêu cầu hỗ trợ – CleanLink phản hồi trong 12 giờ");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-primary shadow-card">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-4xl font-bold">Hỗ trợ & khiếu nại</h1>
          <p className="mt-3 text-muted-foreground">Đội ngũ CleanLink Quy Nhơn hỗ trợ 7 ngày/tuần.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 py-14 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <form onSubmit={onSubmit} className="rounded-2xl bg-card border border-border/60 shadow-card p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-bold">Gửi yêu cầu</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Loại yêu cầu</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-1.5 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Khiếu nại chất lượng</SelectItem>
                    <SelectItem value="reschedule">Đổi/hủy lịch</SelectItem>
                    <SelectItem value="billing">Thanh toán / hóa đơn</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="s-order">Mã đơn liên quan</Label>
                <Input id="s-order" placeholder="VD: CL240712" className="mt-1.5" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="s-name">Họ tên / Tên cơ sở</Label>
                <Input id="s-name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="s-phone">SĐT / Zalo</Label>
                <Input id="s-phone" required className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="s-msg">Mô tả</Label>
              <Textarea id="s-msg" rows={4} required className="mt-1.5" />
            </div>
            <Button type="submit" size="lg" className="rounded-full w-full">Gửi yêu cầu</Button>
          </form>

          <h2 className="mt-10 text-xl font-bold">Câu hỏi thường gặp</h2>
          <Accordion type="single" collapsible className="mt-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <aside className="space-y-4 h-fit">
          {[
            { icon: Phone, label: "Hotline 24/7", value: "0905 123 456" },
            { icon: MessageCircle, label: "Zalo OA", value: "zalo.me/cleanlink" },
            { icon: Mail, label: "Email", value: "cleanlink.quynhon@gmail.com" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 rounded-2xl bg-card p-5 border border-border/60 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/50 text-mint-foreground shrink-0">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-mint/30 border border-mint p-5 text-sm">
            <p className="font-semibold">SLA hỗ trợ</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>· Khiếu nại chất lượng: 12 giờ</li>
              <li>· Đổi/hủy lịch: 30 phút</li>
              <li>· Thanh toán / hóa đơn: 24 giờ</li>
            </ul>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
