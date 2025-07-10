import { API_BASE_URL } from "../scenes/utils/constants";

export async function checkPhoneValid(phone: string) {
  const res = await fetch(`${API_BASE_URL}/mobile/v1/user-info?phone=${phone}`);
  if (!res.ok) throw new Error("Invalid phone number");
  return await res.json();
}
