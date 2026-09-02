import { getAuth } from "../utils/auth-storage";
import { logout } from "../utils/logout";

export function renderNav(containerId: string): void {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) return;

  const auth = getAuth();

  containerEl.innerHTML = `
    <nav class="flex items-center justify-between gap-6 border-b border-stone bg-white px-6 py-4 md:px-16">
      <a href="/index.html" class="text-2xl font-bold tracking-wide text-forest">REKIT</a>

      <div class="hidden items-center gap-8 text-xs font-medium uppercase tracking-wider text-charcoal md:flex">
        <a href="#browse" class="transition-opacity hover:opacity-60">Browse</a>
        <a href="#categories" class="transition-opacity hover:opacity-60">Categories</a>
        <a href="#how-it-works" class="transition-opacity hover:opacity-60">How it works</a>
        <a href="#sell" class="transition-opacity hover:opacity-60">Sell your gear</a>
      </div>

      ${
        auth
          ? `
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-full bg-stone text-sm font-semibold text-forest"
                aria-label="${auth.name}'s profile"
                title="${auth.name}"
              >
                ${auth.name.charAt(0).toUpperCase()}
              </button>
              <button type="button" id="logout-button" class="text-sm text-forest transition-opacity hover:opacity-60">Log out</button>
              <a href="#sell" class="hidden rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 sm:inline-flex">List Your Gear</a>
            </div>
          `
          : `
            <a href="/login.html" class="rounded-lg border border-forest px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white">Log In</a>
          `
      }
    </nav>
  `;

  if (auth) {
    document.getElementById("logout-button")?.addEventListener("click", logout);
  }
}