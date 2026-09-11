import "./style.css";
import heroImage from "./assets/hero.jpg";
import { getListings } from "./api/listings";
import { renderListingCard } from "./components/product-card";
import { renderFooter } from "./components/footer";
import { renderNav } from "./components/nav";

const app = document.querySelector<HTMLDivElement>("#app")!;

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
              href="/browse.html"
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
              href="/browse.html"
          class="hidden text-xs font-medium uppercase tracking-wider text-forest transition-opacity hover:opacity-60 sm:block"
        >
          See all listings
        </a>
      </div>

      <div id="popular-listings" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <p class="text-sm text-charcoal/60">Loading listings...</p>
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

      <div id="sport-listings" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <p class="text-sm text-charcoal/60">Loading listings...</p>
      </div>

      <div class="mt-10 text-center">
        <a
          href="/browse.html"
          class="inline-flex rounded-lg border border-forest px-5 py-2.5 text-xs font-medium text-forest transition-colors hover:bg-forest hover:text-white"
        >
          See all listings
        </a>
      </div>
    </div>
  </section>

`;

renderNav("nav-root");
renderFooter("footer-root");

const popularListings =
  document.querySelector<HTMLDivElement>("#popular-listings")!;
const sportListings =
  document.querySelector<HTMLDivElement>("#sport-listings")!;

async function loadHomeListings(): Promise<void> {
  try {
    const result = await getListings({
      limit: 30,
      sort: "created",
      sortOrder: "desc",
    });
    const listings = result.data;

    // The API cannot sort by bid count, so popular listings are sorted in JavaScript.
    const popular = [...listings]
      .sort(
        (firstListing, secondListing) =>
          (secondListing.bids?.length ?? 0) - (firstListing.bids?.length ?? 0),
      )
      .slice(0, 3);
    const newest = listings.slice(0, 9);

    popularListings.innerHTML = popular.map(renderListingCard).join("");
    sportListings.innerHTML = newest.map(renderListingCard).join("");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    popularListings.innerHTML = `<p class="text-sm text-red-600">${message}</p>`;
    sportListings.innerHTML = `<p class="text-sm text-red-600">${message}</p>`;
  }
}

void loadHomeListings();
