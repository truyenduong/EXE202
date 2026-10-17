import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone } from "lucide-react";
import staffImg from "@/assets/staff.jpg";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/tin-nhan")({
  head: () => ({
    meta: [
      { title: "Tin nhắn – CleanLink" },
      { name: "description", content: "Kênh nhắn tin giữa chủ cơ sở và người dọn ngay trong app CleanLink." },
    ],
  }),
  component: ChatPage,
});

type Msg = { from: "host" | "cleaner"; text: string; time: string };

const initial: Msg[] = [
  { from: "cleaner", text: "Chào anh/chị, em là Hồng của CleanLink. Em đang trên đường tới ạ.", time: "13:14" },
  { from: "host", text: "Chào chị Hồng, mã cửa là 2468 nhé. 5 phòng đều mở sẵn cửa.", time: "13:15" },
  { from: "cleaner", text: "Dạ em ghi nhận. ETA còn 8 phút.", time: "13:16" },
  { from: "host", text: "Phòng 302 khách vừa trả, cần ưu tiên vì có khách check-in lúc 14:00.", time: "13:18" },
  { from: "cleaner", text: "Vâng em sẽ làm 302 đầu tiên và gửi ảnh xác nhận ạ.", time: "13:19" },
];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMsgs((m) => [...m, { from: "host", text: text.trim(), time }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "cleaner", text: "Dạ em nhận thông tin ạ.", time }]);
    }, 700);
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 md:px-6 py-8">
        <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden flex flex-col h-[70vh]">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4 bg-gradient-soft">
            <img src={staffImg} alt="Người dọn" className="h-11 w-11 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-semibold">Chị Hồng</p>
              <p className="text-xs text-primary">● Đang online · Đơn CL240712</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full"><Phone className="h-4 w-4" /></Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-background">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "host" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === "host"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.from === "host" ? "opacity-80" : "text-muted-foreground"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border/60 p-3 bg-card">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhắn cho người dọn…"
              className="flex-1"
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
