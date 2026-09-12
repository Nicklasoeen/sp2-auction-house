import { getAuth } from "../utils/auth-storage";
import { logout } from "../utils/logout";
import { getProfile } from "../api/profile";
import wordmark from "../assets/rekit-wordmark.svg";

export async function renderNav(containerId: string): Promise<void> {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) return;

  const auth = getAuth();

  containerEl.innerHTML = `
    <nav class="relative flex items-center justify-between gap-6 border-b border-stone bg-white px-6 py-4 md:px-16">
      <a href="./" aria-label="REKIT home">
        <img src="${wordmark}" alt="REKIT" class="h-8 w-auto" />
      </a>

      <div class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-xs font-medium uppercase tracking-wider text-charcoal md:flex">
        <a href="./" class="transition-opacity hover:opacity-60">Home</a>
        <a href="./browse.html" class="transition-opacity hover:opacity-60">Browse</a>
        <a href="./index.html#how-it-works" class="transition-opacity hover:opacity-60">How It Works</a>
      </div>

      <div class="flex items-center gap-4">
        ${
          auth
            ? `
              <a
                id="profile-avatar-link"
                href="./profile.html"
                class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-stone text-sm font-semibold text-forest"
                aria-label="${auth.name}'s profile"
                title="${auth.name}"
              >
                ${auth.name.charAt(0).toUpperCase()}
              </a>
              <span id="credit-balance" class="rounded-full bg-stone px-3 py-1 text-sm text-forest">...</span>
              <div class="hidden items-center gap-4 md:flex">
                <button type="button" class="logout-button text-sm text-forest transition-opacity hover:opacity-60">Log out</button>
                <a href="./create-listing.html" class="hidden rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 sm:inline-flex">List Your Gear</a>
              </div>
            `
            : `
              <a href="./login.html" class="hidden rounded-lg border border-forest px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white md:inline-flex">Log In</a>
            `
        }
        <button
          type="button"
          id="mobile-menu-button"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-stone text-forest md:hidden"
          aria-controls="mobile-menu"
          aria-expanded="false"
          aria-label="Open menu"
        >
          <span class="sr-only">Open menu</span>
          <span class="flex flex-col gap-1.5" aria-hidden="true">
            <span class="block h-0.5 w-5 bg-current"></span>
            <span class="block h-0.5 w-5 bg-current"></span>
            <span class="block h-0.5 w-5 bg-current"></span>
          </span>
        </button>
      </div>
    </nav>

    <div id="mobile-menu" class="hidden border-b border-stone bg-white px-6 py-5 md:hidden">
      <div class="flex flex-col gap-4 text-sm font-medium text-charcoal">
        <a href="./" class="transition-opacity hover:opacity-60">Home</a>
        <a href="./browse.html" class="transition-opacity hover:opacity-60">Browse</a>
        <a href="./index.html#how-it-works" class="transition-opacity hover:opacity-60">How It Works</a>
        ${
          auth
            ? `
              <a href="./create-listing.html" class="text-forest">List Your Gear</a>
              <button type="button" class="logout-button self-start text-forest transition-opacity hover:opacity-60">Log out</button>
            `
            : `<a href="./login.html" class="text-forest">Log In</a>`
        }
      </div>
    </div>
  `;

  if (auth) {
    document
      .querySelectorAll<HTMLButtonElement>(".logout-button")
      .forEach((button) => button.addEventListener("click", logout));

    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    mobileMenuButton?.addEventListener("click", () => {
      const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileMenuButton.setAttribute(
        "aria-label",
        isOpen ? "Open menu" : "Close menu",
      );
      mobileMenu?.classList.toggle("hidden", isOpen);
    });

    const creditBalance = document.getElementById("credit-balance");

    try {
      const profile = await getProfile(
        auth.name,
        auth.accessToken,
        auth.apiKey,
      );
      const profileAvatarLink = document.getElementById("profile-avatar-link");

      if (profileAvatarLink && profile.avatar?.url) {
        profileAvatarLink.innerHTML = `<img src="${profile.avatar.url}" alt="${profile.avatar.alt || `${auth.name}'s profile`}" class="h-full w-full object-cover" />`;
      }
      if (creditBalance)
        creditBalance.textContent = `${profile.credits} credits`;
    } catch {
      if (creditBalance) creditBalance.textContent = "—";
    }
  } else {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    mobileMenuButton?.addEventListener("click", () => {
      const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileMenuButton.setAttribute(
        "aria-label",
        isOpen ? "Open menu" : "Close menu",
      );
      mobileMenu?.classList.toggle("hidden", isOpen);
    });
  }
}
