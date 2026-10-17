import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { checklistItems } from "@/lib/cleanlink-data";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Danh sách công việc – CleanLink" },
      { name: "description", content: "Danh sách 7 công việc chuẩn cho người dọn CleanLink – đánh dấu từng mục để đảm bảo không bỏ sót." },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const [done, setDone] = useState<string[]>([]);
  const progress = Math.round((done.length / checklistItems.length) * 100);
  const allDone = done.length === checklistItems.length;

  function toggle(id: string) {
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 md:px-6 py-10">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">Đơn CL240712 · 5 phòng</p>
        <h1 className="mt-1 text-3xl font-bold">Danh sách công việc</h1>
        <p className="mt-2 text-muted-foreground">Hoàn thành 7 công việc trước khi gửi hình ảnh xác nhận cho chủ cơ sở.</p>

        <div className="mt-6 rounded-2xl bg-card border border-border/60 shadow-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Tiến độ</span>
            <span className="font-bold text-primary">{done.length}/{checklistItems.length} công việc đã hoàn thành</span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {checklistItems.map((it, i) => {
            const isDone = done.includes(it.id);
            return (
              <li key={it.id}>
                <label
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                    isDone ? "border-primary bg-mint/30" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <Checkbox checked={isDone} onCheckedChange={() => toggle(it.id)} />
                  <span className="flex-1 text-sm font-medium">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {it.label}
                  </span>
                  {isDone && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex gap-3">
          <Button asChild variant="outline" className="rounded-full flex-1">
            <Link to="/anh-xac-nhan">Gửi hình ảnh sau khi dọn</Link>
          </Button>
          <Button
            className="rounded-full flex-1"
            disabled={!allDone}
            onClick={() => toast.success("Đã báo hoàn thành các công việc cho chủ cơ sở")}
          >
            {allDone ? "Hoàn thành các công việc" : `Còn ${checklistItems.length - done.length} công việc`}
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
