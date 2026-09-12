export function renderFooter(containerId: string): void {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) return;

  containerEl.innerHTML = `
    <footer class="bg-white px-6 pt-6 md:px-8 md:pt-8">
      <div class="rounded-t-3xl bg-forest px-6 py-14 text-white md:px-16 md:py-16">
        <div class="mx-auto w-full max-w-[1280px]">
          <div class="text-center">
            <p class="text-xs font-medium uppercase tracking-[0.2em] text-sage">Sell your gear</p>
            <h2 class="mt-5 text-3xl font-semibold md:text-4xl">Got gear collecting dust?</h2>
            <p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone md:text-base">
              List it in five minutes. Someone on your campus is probably looking for it right now.
            </p>
            <a href="./create-listing.html" class="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-stone">
              List Your Gear
            </a>
          </div>

          <div class="my-12 border-t border-sage/30"></div>

          <div class="grid gap-8 text-sm text-white/75 md:grid-cols-2">
            <nav aria-label="Footer navigation" class="flex flex-col gap-4">
              <a href="./" class="transition-colors hover:text-white">Home</a>
              <a href="./browse.html" class="transition-colors hover:text-white">Browse Gear</a>
              <a href="./index.html#how-it-works" class="transition-colors hover:text-white">How It Works</a>
              <a href="./create-listing.html" class="transition-colors hover:text-white">Sell Your Gear</a>
            </nav>

            <div class="flex flex-col gap-4">
              <a href="mailto:hello@rekit.com" class="transition-colors hover:text-white">hello@rekit.com</a>
              <a href="tel:+15550132" class="transition-colors hover:text-white">+1 555 0132</a>
            </div>
          </div>

          <div class="my-12 border-t border-sage/30"></div>

          <div class="flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; 2026 REKIT</span>
            <div class="flex gap-6">
              <a href="tel:+15550132" class="transition-colors hover:text-white">+1 555 0132</a>
              <a href="mailto:hello@rekit.com" class="transition-colors hover:text-white">hello@rekit.com</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
}
