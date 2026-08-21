/**
 * DOM helpers for showing per-field and form errors
 */

export function setFieldError(fieldName: string, message: string): void {
  const el = document.querySelector<HTMLElement>(
    `[data-error-for="${fieldName}"]`,
  );
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("hidden", !message);
}

export function clearFieldErrors(fieldNames: string[]): void {
  fieldNames.forEach((name) => setFieldError(name, ""));
}

export function setFormStatus(
  statusEl: HTMLElement,
  message: string | null,
): void {
  statusEl.textContent = message ?? "";
  statusEl.classList.toggle("hidden", !message);
}
