export type AppRole = "host" | "cleaner";

/** Chuẩn hoá số điện thoại Việt Nam về dạng 0xxxxxxxxx */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("84")) digits = "0" + digits.slice(2);
  if (!digits.startsWith("0") && digits.length === 9) digits = "0" + digits;
  return digits;
}

export function isValidPhone(input: string): boolean {
  const p = normalizePhone(input);
  return /^0\d{9}$/.test(p);
}

/** Số điện thoại được dùng làm định danh đăng nhập nội bộ */
export function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@cleanlink.vn`;
}

export const roleLabel: Record<AppRole, string> = {
  host: "Chủ cơ sở lưu trú",
  cleaner: "Người dọn",
};
