import "./style.css";
import heroImage from "./assets/hero.jpg";
import productImageOne from "./assets/1c1c7ea9-37ee-492f-a40d-801aca34ea17-2026-08-13.jpg";
import productImageTwo from "./assets/35b67c66-0b9d-4fe0-805d-a84fbbbab7a2-2026-08-13.jpg";
import productImageThree from "./assets/4c9cf5be-0c67-4359-a139-9d63e02e8788-2026-08-13.jpg";
import { productCard, type Product } from "./components/product-card";

const app = document.querySelector<HTMLDivElement>("#app")!;

const products: Product[] = [
  {
    image: productImageOne,
    category: "Golf",
    title: "Golf towel & accessories bundle",
    price: "$45",
    tradeFor: "Open to tennis gear",
  },
  {
    image: productImageTwo,
    category: "Apparel",
    title: "Knit beanies & gloves set",
    price: "$30",
    tradeFor: "Open to any swap",
  },
  {
    image: productImageThree,
    category: "Golf",
    title: "Full golf bag with club set",
    price: "$180",
    tradeFor: "Open to ski gear",
  },
];

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

  <section id="browse" class="bg-white px-6 py-20 md:px-16 md:py-28">
    <div class="mx-auto w-full max-w-[1280px]">
      <div class="mb-10 flex items-end justify-between gap-6">
        <div>
          <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-forest/80">
            Fresh on campus
          </p>
          <h2 class="text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
            Popular right now
          </h2>
        </div>
        <a
          href="#browse"
          class="hidden text-xs font-medium uppercase tracking-wider text-forest transition-opacity hover:opacity-60 sm:block"
        >
          See all listings
        </a>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        ${products.map(productCard).join("")}
      </div>
    </div>
  </section>
`;
