import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { BookingStatus } from "@/lib/cleanlink-data";

export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

/** Các bước trạng thái hiển thị cho chủ cơ sở và người dọn */
export const flowSteps: { key: BookingStatus; label: string }[] = [
  { key: "searching", label: "Đang tìm người dọn" },
  { key: "accepted", label: "Người dọn đã nhận việc" },
  { key: "in_progress", label: "Đang thực hiện" },
  { key: "photo_sent", label: "Đã gửi ảnh sau khi dọn" },
  { key: "completed", label: "Chủ cơ sở đã xác nhận hoàn thành" },
  { key: "reviewed", label: "Đã đánh giá" },
];

export function stepIndex(status: string) {
  const i = flowSteps.findIndex((s) => s.key === status);
  return i < 0 ? 0 : i;
}

export function newBookingCode() {
  return `CL${Date.now().toString().slice(-6)}`;
}

export async function fetchBooking(id: string) {
  const { data, error } = await supabase.from("bookings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as BookingRow | null;
}

export async function fetchHostBookings(hostId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BookingRow[];
}

/** Người dọn: công việc đang mở + công việc của chính mình */
export async function fetchCleanerBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BookingRow[];
}

export async function acceptJob(bookingId: string, cleanerId: string, cleanerName: string) {
  const { error } = await supabase
    .from("bookings")
    .update({
      cleaner_id: cleanerId,
      cleaner_name: cleanerName,
      status: "accepted",
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .is("cleaner_id", null);
  if (error) throw error;
}

export async function updateBooking(bookingId: string, patch: Partial<BookingInsert>) {
  const { error } = await supabase
    .from("bookings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) throw error;
}

export async function uploadBookingPhoto(bookingId: string, kind: "before" | "after", file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${bookingId}/${kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("booking-photos").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return path;
}

export async function signedPhotoUrl(path: string | null) {
  if (!path) return null;
  const { data } = await supabase.storage.from("booking-photos").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
