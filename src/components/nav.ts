import { getAuth } from "../utils/auth-storage";
import { logout } from "../utils/logout";
import { getProfile } from "../api/profile";

export async function renderNav(containerId: string): Promise<void> {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) return;

  const auth = getAuth();

  containerEl.innerHTML = `
    <nav class="relative flex items-center justify-between gap-6 border-b border-stone bg-white px-6 py-4 md:px-16">
      <a href="/index.html" class="text-2xl font-bold tracking-wide text-forest">REKIT</a>

      <div class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-xs font-medium uppercase tracking-wider text-charcoal md:flex">
        <a href="/index.html" class="transition-opacity hover:opacity-60">Home</a>
        <a href="/browse.html" class="transition-opacity hover:opacity-60">Browse</a>
        <a href="/index.html#how-it-works" class="transition-opacity hover:opacity-60">How It Works</a>
      </div>

      ${
        auth
          ? `
            <div class="flex items-center gap-4">
              <a
                id="profile-avatar-link"
                href="/profile.html"
                class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-stone text-sm font-semibold text-forest"
                aria-label="${auth.name}'s profile"
                title="${auth.name}"
              >
                ${auth.name.charAt(0).toUpperCase()}
              </a>
              <span id="credit-balance" class="rounded-full bg-stone px-3 py-1 text-sm text-forest">...</span>
              <button type="button" id="logout-button" class="text-sm text-forest transition-opacity hover:opacity-60">Log out</button>
              <a href="/create-listing.html" class="hidden rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 sm:inline-flex">List Your Gear</a>
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
  }
}
