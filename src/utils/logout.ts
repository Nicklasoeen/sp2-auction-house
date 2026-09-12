import { clearAuth } from "./auth-storage";

export function logout(): void {
  clearAuth();
  window.location.href = "./login.html";
}
