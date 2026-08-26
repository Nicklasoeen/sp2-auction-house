import "./style.css";
import heroImage from "./assets/hero.jpg";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <section
    class="relative min-h-screen bg-cover bg-center"
    style="background-image: url('${heroImage}')"
  >
    <div class="absolute inset-0 bg-black/35"></div>

    <div class="relative z-10 min-h-screen px-6 py-6 text-white md:px-16 md:py-8">
      <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1280px] flex-col md:min-h-[calc(100vh-4rem)]">
        <header class="flex items-center justify-between">
          <a href="/" class="text-2xl font-medium tracking-wide">REKIT</a>

          <nav class="hidden items-center gap-8 text-xs uppercase tracking-wider md:flex">
            <a href="#browse" class="transition-opacity hover:opacity-70">Browse</a>
            <a href="#categories" class="transition-opacity hover:opacity-70">Categories</a>
            <a href="#how-it-works" class="transition-opacity hover:opacity-70">How it works</a>
            <a href="#sell" class="transition-opacity hover:opacity-70">Sell your gear</a>
          </nav>

          <a
            href="/login.html"
            class="rounded-lg border border-white/70 px-4 py-2 text-xs transition-colors hover:bg-white hover:text-charcoal"
          >
            Log In
          </a>
        </header>

        <div class="mt-auto max-w-xl pb-2 md:pb-4">
          <h1 class="max-w-lg text-4xl font-semibold leading-tight md:text-6xl">
            Turn old gear into a new sport.
          </h1>
          <p class="mt-6 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
            The marketplace made exclusively for students &mdash; buy, sell, swap, or bid on sports gear with other students.
          </p>

          <div class="mt-7 flex flex-wrap gap-3">
            <a
              href="#browse"
              class="rounded-lg bg-white px-5 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-stone"
            >
              Browse Gear
            </a>
            <a
              href="#how-it-works"
              class="rounded-lg border border-white/70 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              How it works
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
`;
