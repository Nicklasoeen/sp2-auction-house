import "./style.css";
import heroImage from "./assets/hero.jpg";
import productImageOne from "./assets/1c1c7ea9-37ee-492f-a40d-801aca34ea17-2026-08-13.jpg";
import productImageTwo from "./assets/35b67c66-0b9d-4fe0-805d-a84fbbbab7a2-2026-08-13.jpg";
import productImageThree from "./assets/4c9cf5be-0c67-4359-a139-9d63e02e8788-2026-08-13.jpg";
import productImageFour from "./assets/6ec4bd0f-064d-4fcf-8206-48a06137fb12-2026-08-13.jpg";
import productImageFive from "./assets/713954d6-bc10-4f90-8417-0e3ab5b3623e-2026-08-13.jpg";
import productImageSix from "./assets/93b5fce2-42e8-4f80-8dc4-aae4d00ad38b-2026-08-13.jpg";
import productImageSeven from "./assets/af5ca31b-629a-40e0-be7e-e51cacb590b7-2026-08-13.jpg";
import productImageEight from "./assets/d8d1c8f7-cdc6-4f14-afd1-25f6f8904ec9-2026-08-13.jpg";
import productImageNine from "./assets/da55d7a6-5630-4f90-acd6-c9a32c45877d-2026-08-13.jpg";
import { productCard, type Product } from "./components/product-card";
import { footer } from "./components/footer";
import { renderNav } from "./components/nav";

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
  {
    image: productImageFour,
    category: "Padel",
    title: "Padel kit",
    price: "$45",
    tradeFor: "Open to tennis gear",
  },
  {
    image: productImageFive,
    category: "Golf",
    title: "Golf knitwear & winter set",
    price: "$30",
    tradeFor: "Open to any swap",
  },
  {
    image: productImageSix,
    category: "Tennis",
    title: "Complete tennis set",
    price: "$180",
    tradeFor: "Open to ski gear",
  },
  {
    image: productImageSeven,
    category: "Golf",
    title: "Embroidered towel set",
    price: "$20",
    tradeFor: "Open to any swap",
  },
  {
    image: productImageEight,
    category: "Paddling",
    title: "Kayak, paddles and matching kit",
    price: "$670",
    tradeFor: "Open to tennis gear",
  },
  {
    image: productImageNine,
    category: "Tennis",
    title: "Tennis racket",
    price: "$25",
    tradeFor: "Open to running gear",
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
        <div class="mt-auto max-w-xl pb-2 md:pb-4">
          <h1 class="max-w-lg text-4xl font-semibold leading-tight md:text-6xl">
            Turn old gear into a new sport.
          </h1>
          <p class="mt-6 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
            Bid on sports gear from students on your campus. Buy Now and Swap are coming soon.
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

  <section id="popular" class="bg-white px-6 py-20 md:px-16 md:py-28">
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

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${products.slice(0, 3).map(productCard).join("")}
      </div>
    </div>
  </section>

  <section id="how-it-works" class="bg-forest px-6 py-20 text-white md:px-16 md:py-28">
    <div class="mx-auto w-full max-w-[1280px]">
      <div class="max-w-2xl">
        <p class="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-sage">
          How it works
        </p>
        <h2 class="text-4xl font-semibold leading-tight md:text-5xl">
          Three steps to your next favorite gear.
        </h2>
      </div>

      <ol class="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-20 lg:gap-16">
        <li>
          <span class="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-sage text-lg text-white">
            01
          </span>
          <h3 class="mt-7 text-2xl font-semibold">List your gear</h3>
          <p class="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            Snap a few photos, set a price or mark it open to swap. Takes less than five minutes.
          </p>
        </li>
        <li>
          <span class="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-sage text-lg text-white">
            02
          </span>
          <h3 class="mt-7 text-2xl font-semibold">Get offers</h3>
          <p class="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            Other students buy, bid, or propose a swap from their own gear. You choose what works.
          </p>
        </li>
        <li>
          <span class="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-sage text-lg text-white">
            03
          </span>
          <h3 class="mt-7 text-2xl font-semibold">Meet on campus or send the gear</h3>
          <p class="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            Trade safely with someone from your own school. No shipping, no strangers off-campus.
          </p>
        </li>
      </ol>
    </div>
  </section>

  <section id="browse" class="bg-white px-6 py-20 md:px-16 md:py-28">
    <div class="mx-auto w-full max-w-[1280px]">
      <div class="mb-8">
        <p class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-forest/80">
          Browse
        </p>
        <h2 class="text-3xl font-semibold tracking-tight text-charcoal md:text-4xl">
          Find gear by sport
        </h2>
      </div>

      <div class="mb-8 flex flex-wrap gap-2">
        <button class="rounded-full bg-forest px-4 py-2 text-xs font-medium text-white" type="button">
          Golf
        </button>
        <button class="rounded-full bg-stone px-4 py-2 text-xs font-medium text-charcoal" type="button">
          Tennis
        </button>
        <button class="rounded-full bg-stone px-4 py-2 text-xs font-medium text-charcoal" type="button">
          Ski &amp; Snow
        </button>
        <button class="rounded-full bg-stone px-4 py-2 text-xs font-medium text-charcoal" type="button">
          Running
        </button>
        <button class="rounded-full bg-stone px-4 py-2 text-xs font-medium text-charcoal" type="button">
          Cycling
        </button>
        <button class="rounded-full bg-stone px-4 py-2 text-xs font-medium text-charcoal" type="button">
          Team Sports
        </button>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${products.map(productCard).join("")}
      </div>

      <div class="mt-10 text-center">
        <a
          href="#browse"
          class="inline-flex rounded-lg border border-forest px-5 py-2.5 text-xs font-medium text-forest transition-colors hover:bg-forest hover:text-white"
        >
          See all listings
        </a>
      </div>
    </div>
  </section>

  ${footer()}
`;

renderNav("nav-root");
