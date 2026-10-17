import {
  LogOut,
  Building2,
  Camera,
  ListChecks,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  icon: LucideIcon;
  tag?: string;
};

export const services: Service[] = [
  {
    slug: "co-ban",
    name: "Dọn phòng tiêu chuẩn sau khi khách trả phòng",
    description:
      "Vệ sinh phòng chuẩn giữa hai lượt khách: thay ga, dọn rác, lau bề mặt, chỉnh ga giường – áp dụng cho phòng 15–25 m², không có bếp riêng.",
    duration: "45 – 60 phút/phòng",
    price: "120.000đ/phòng",
    icon: LogOut,
    tag: "Phổ biến nhất",
  },
  {
    slug: "phong-lon",
    name: "Dọn phòng lớn hoặc phòng có bếp",
    description:
      "Áp dụng cho phòng trên 25 m² hoặc có khu vực bếp riêng – khối lượng công việc lớn hơn, thời gian dọn dài hơn.",
    duration: "60 – 90 phút/phòng",
    price: "150.000đ/phòng",
    icon: Building2,
  },
  {
    slug: "nhieu-phong",
    name: "Dọn nhiều phòng cho homestay / khách sạn nhỏ",
    description:
      "Điều phối nhiều người dọn xử lý cùng lúc 3–5 phòng, hoàn tất trước khung giờ khách mới nhận phòng, có người điều phối theo dõi tiến độ.",
    duration: "1 – 3 giờ",
    price: "Từ 120.000đ/phòng",
    icon: Building2,
  },
  {
    slug: "anh-xac-nhan",
    name: "Gửi hình ảnh sau khi dọn",
    description:
      "Người dọn chụp hình từng phòng sau khi hoàn tất, gửi trực tiếp về ứng dụng cho chủ cơ sở kiểm tra từ xa.",
    duration: "Đi kèm mọi đơn",
    price: "Miễn phí",
    icon: Camera,
  },
  {
    slug: "checklist",
    name: "Danh sách công việc từng phòng",
    description:
      "Chuẩn hoá 7 hạng mục công việc cho từng phòng, giúp hạn chế bỏ sót và giữ chất lượng ổn định.",
    duration: "Đi kèm mọi đơn",
    price: "Miễn phí",
    icon: ListChecks,
  },
  {
    slug: "mo-rong",
    name: "Dịch vụ mở rộng (giặt ga, tổng vệ sinh)",
    description:
      "Giặt ga gối, giặt rèm, tổng vệ sinh sâu định kỳ cho toàn bộ cơ sở lưu trú.",
    duration: "Đặt theo yêu cầu",
    price: "Liên hệ báo giá",
    icon: Sparkles,
    tag: "Sắp mở",
  },
];

export const propertyTypes = [
  { value: "homestay", label: "Homestay" },
  { value: "mini_hotel", label: "Khách sạn nhỏ" },
  { value: "guesthouse", label: "Nhà nghỉ" },
  { value: "apartment", label: "Căn hộ thuê ngắn hạn" },
] as const;

export const roomTypes = [
  { value: "standard", label: "Phòng tiêu chuẩn (15–25 m², không có bếp)" },
  { value: "kitchen", label: "Phòng lớn hoặc có bếp (trên 25 m²)" },
] as const;

export const areas = [
  { value: "trung_tam", label: "Trung tâm Quy Nhơn" },
  { value: "nhon_ly", label: "Nhơn Lý" },
  { value: "eo_gio", label: "Eo Gió" },
  { value: "bai_xep", label: "Bãi Xếp" },
  { value: "nhon_hai", label: "Nhơn Hải" },
] as const;

export const timeSlots = [
  { value: "11-12", label: "11:00 – 12:00" },
  { value: "12-13", label: "12:00 – 13:00" },
  { value: "13-14", label: "13:00 – 14:00" },
  { value: "khac", label: "Khung giờ khác" },
] as const;

export const addonOptions = [
  { value: "toilet", label: "Dọn nhà vệ sinh" },
  { value: "rac", label: "Thu gom rác" },
  { value: "ga", label: "Chỉnh ga giường" },
  { value: "san", label: "Lau sàn" },
  { value: "khan", label: "Kiểm tra khăn / vật dụng" },
  { value: "khac", label: "Khác (ghi chú thêm)" },
] as const;

export type BookingStatus =
  | "created"
  | "searching"
  | "accepted"
  | "on_the_way"
  | "in_progress"
  | "work_done"
  | "photo_sent"
  | "completed"
  | "reviewed"
  | "cancelled";

export type ServicePricing = {
  standard_price: number;
  kitchen_price: number;
  urgent_fee_1_2: number;
  urgent_fee_3_4: number;
  urgent_fee_5_plus: number;
  bank_name: string;
  bank_account: string;
  bank_account_holder: string;
};

export const DEFAULT_SERVICE_PRICING: ServicePricing = {
  standard_price: 120000,
  kitchen_price: 150000,
  urgent_fee_1_2: 20000,
  urgent_fee_3_4: 35000,
  urgent_fee_5_plus: 50000,
  bank_name: "",
  bank_account: "",
  bank_account_holder: "",
};

export type Booking = {
  id: string;
  createdAt: string;
  propertyName: string;
  propertyType: string;
  area: string;
  address: string;
  phone: string;
  rooms: number;
  roomType: "standard" | "kitchen";
  timeSlot: string;
  urgency: "normal" | "urgent";
  addons: string[];
  note?: string;
  price: number;
  cleaner?: string;
  status: BookingStatus;
};

export const statusLabel: Record<BookingStatus, string> = {
  created: "Đã tạo đơn",
  searching: "Đang tìm người dọn",
  accepted: "Người dọn đã nhận việc",
  on_the_way: "Người dọn đang đến cơ sở",
  in_progress: "Đang thực hiện",
  work_done: "Đã hoàn thành các công việc",
  photo_sent: "Đã gửi ảnh xác nhận",
  completed: "Hoàn tất dịch vụ",
  reviewed: "Đã đánh giá",
  cancelled: "Đã huỷ",
};

export const statusColor: Record<BookingStatus, string> = {
  created: "bg-slate-100 text-slate-800 border-slate-200",
  searching: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-sky-100 text-sky-800 border-sky-200",
  on_the_way: "bg-indigo-100 text-indigo-800 border-indigo-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  work_done: "bg-teal-100 text-teal-800 border-teal-200",
  photo_sent: "bg-cyan-100 text-cyan-800 border-cyan-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  reviewed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

// ===== Pricing =====
// - Đơn giá / phòng: tiêu chuẩn 120.000đ, phòng lớn / có bếp 150.000đ
// - Phụ phí dọn gấp tính theo đơn: 1–2 phòng: 20.000đ, 3–4 phòng: 35.000đ, ≥5 phòng: 50.000đ
// - Không áp dụng giảm giá theo số phòng ở giai đoạn hiện tại
export const ROOM_PRICE = {
  standard: 120000,
  kitchen: 150000,
} as const;

export function urgentFee(rooms: number, pricing = DEFAULT_SERVICE_PRICING) {
  if (rooms <= 0) return 0;
  if (rooms <= 2) return pricing.urgent_fee_1_2;
  if (rooms <= 4) return pricing.urgent_fee_3_4;
  return pricing.urgent_fee_5_plus;
}

export function estimatePrice(
  rooms: number,
  urgency: "normal" | "urgent",
  roomType: "standard" | "kitchen" = "standard",
  pricing = DEFAULT_SERVICE_PRICING,
) {
  const r = Math.max(1, rooms);
  const perRoom = roomType === "standard" ? pricing.standard_price : pricing.kitchen_price;
  const subtotal = perRoom * r;
  const fee = urgency === "urgent" ? urgentFee(r, pricing) : 0;
  const total = subtotal + fee;
  return { perRoom, subtotal, urgentFee: fee, total };
}

export function formatVND(v: number) {
  return v.toLocaleString("vi-VN") + "đ";
}

// ===== Sample data (in-memory demo) =====
export const sampleBookings: Booking[] = [
  {
    id: "CL240712",
    createdAt: new Date().toISOString(),
    propertyName: "Mai House Homestay",
    propertyType: "homestay",
    area: "trung_tam",
    address: "12 Xuân Diệu, Quy Nhơn",
    phone: "0905 111 222",
    rooms: 5,
    roomType: "standard",
    timeSlot: "13-14",
    urgency: "urgent",
    addons: ["toilet", "rac", "ga"],
    price: 650000,
    cleaner: "Nguyễn Thị Lan",
    status: "on_the_way",
  },
  {
    id: "CL240711",
    createdAt: new Date().toISOString(),
    propertyName: "Seaview Mini Hotel",
    propertyType: "mini_hotel",
    area: "nhon_ly",
    address: "68 Nhơn Lý, Quy Nhơn",
    phone: "0905 333 444",
    rooms: 4,
    roomType: "standard",
    timeSlot: "12-13",
    urgency: "normal",
    addons: ["toilet", "rac", "ga", "san"],
    price: 480000,
    cleaner: "Trần Văn Sơn + 1",
    status: "in_progress",
  },
  {
    id: "CL240710",
    createdAt: new Date().toISOString(),
    propertyName: "Bãi Xếp Ocean Studio",
    propertyType: "apartment",
    area: "bai_xep",
    address: "Bãi Xếp, Ghềnh Ráng",
    phone: "0905 555 666",
    rooms: 2,
    roomType: "kitchen",
    timeSlot: "11-12",
    urgency: "normal",
    addons: ["ga", "khan"],
    price: 300000,
    cleaner: "Lê Thị Lan",
    status: "completed",
  },
  {
    id: "CL240709",
    createdAt: new Date().toISOString(),
    propertyName: "Eo Gió Sunset Home",
    propertyType: "homestay",
    area: "eo_gio",
    address: "Eo Gió, Nhơn Lý",
    phone: "0905 777 888",
    rooms: 3,
    roomType: "standard",
    timeSlot: "13-14",
    urgency: "normal",
    addons: ["toilet", "ga"],
    price: 360000,
    status: "searching",
  },
  {
    id: "CL240708",
    createdAt: new Date().toISOString(),
    propertyName: "Nhơn Hải Beach Villa",
    propertyType: "homestay",
    area: "nhon_hai",
    address: "Thôn Hải Đông, Nhơn Hải",
    phone: "0905 999 000",
    rooms: 4,
    roomType: "standard",
    timeSlot: "12-13",
    urgency: "urgent",
    addons: ["toilet", "rac", "ga", "san", "khan"],
    price: 515000,
    cleaner: "Phạm Thị Mai + 1",
    status: "accepted",
  },
  {
    id: "CL240707",
    createdAt: new Date().toISOString(),
    propertyName: "Quy Nhơn Center Apartment",
    propertyType: "apartment",
    area: "trung_tam",
    address: "45 An Dương Vương, Quy Nhơn",
    phone: "0905 121 212",
    rooms: 1,
    roomType: "standard",
    timeSlot: "11-12",
    urgency: "normal",
    addons: ["ga"],
    price: 120000,
    cleaner: "Đoàn Thị Thu",
    status: "reviewed",
  },
];

// ===== Sample jobs for cleaner-facing screen =====
export type Job = {
  id: string;
  property: string;
  address: string;
  area: string;
  rooms: number;
  roomType: "standard" | "kitchen";
  timeSlot: string;
  distanceKm: number;
  earnMin: number;
  earnMax: number;
  urgency: "normal" | "urgent";
  requirements: string[];
};

export const sampleJobs: Job[] = [
  {
    id: "JOB-1042",
    property: "Mai House Homestay",
    address: "12 Xuân Diệu, Quy Nhơn",
    area: "trung_tam",
    rooms: 5,
    roomType: "standard",
    timeSlot: "13-14",
    distanceKm: 2.1,
    earnMin: 600000,
    earnMax: 650000,
    urgency: "urgent",
    requirements: [
      "Dọn 5 phòng tiêu chuẩn sau khi khách trả phòng",
      "Chỉnh ga giường, kiểm tra khăn",
      "Gửi hình ảnh sau khi hoàn tất",
    ],
  },
  {
    id: "JOB-1041",
    property: "Seaview Mini Hotel",
    address: "68 Nhơn Lý, Quy Nhơn",
    area: "nhon_ly",
    rooms: 4,
    roomType: "standard",
    timeSlot: "12-13",
    distanceKm: 12.4,
    earnMin: 480000,
    earnMax: 480000,
    urgency: "normal",
    requirements: [
      "Dọn 4 phòng tiêu chuẩn",
      "Thu gom rác, lau sàn",
      "Kiểm tra khăn và vật dụng cơ bản",
    ],
  },
  {
    id: "JOB-1040",
    property: "Bãi Xếp Ocean Studio",
    address: "Bãi Xếp, Ghềnh Ráng",
    area: "bai_xep",
    rooms: 2,
    roomType: "kitchen",
    timeSlot: "11-12",
    distanceKm: 5.8,
    earnMin: 300000,
    earnMax: 300000,
    urgency: "normal",
    requirements: [
      "Dọn 2 phòng có bếp riêng",
      "Chú ý khu vực bếp và bồn rửa",
      "Chỉnh ga giường, kiểm tra khăn",
    ],
  },
];

// ===== Danh sách công việc cho từng phòng =====
export const checklistItems = [
  { id: "rac", label: "Thu gom rác" },
  { id: "toilet", label: "Dọn nhà vệ sinh" },
  { id: "surface", label: "Lau bàn, kệ và bề mặt dễ thấy" },
  { id: "floor", label: "Quét và lau sàn" },
  { id: "bed", label: "Chỉnh ga giường" },
  { id: "khan", label: "Kiểm tra khăn và vật dụng cơ bản" },
  { id: "photo", label: "Gửi ảnh sau khi dọn" },
];

export function labelFrom<T extends { value: string; label: string }>(
  list: readonly T[],
  value: string,
) {
  return list.find((x) => x.value === value)?.label ?? value;
}
