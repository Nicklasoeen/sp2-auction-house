import type { Listing } from "../api/listings";

export type Product = {
  image: string;
  category: string;
  title: string;
  price: string;
  tradeFor: string;
};

export function productCard({
  image,
  category,
  title,
  price,
  tradeFor,
}: Product): string {
  return `
    <article class="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(43,43,43,0.08)] transition-shadow hover:shadow-[0_12px_30px_rgba(43,43,43,0.12)]">
      <img
        src="${image}"
        alt="${title}"
        class="aspect-[4/3] w-full rounded-2xl object-cover"
      />
      <div class="flex flex-1 flex-col gap-3">
        <span class="w-fit rounded-full bg-stone px-3 py-1 text-xs font-medium uppercase tracking-wide text-forest">
          ${category}
        </span>
        <h3 class="text-xl leading-tight text-charcoal">${title}</h3>
        <div class="mt-auto flex items-end justify-between gap-3">
          <strong class="text-2xl text-forest">${price}</strong>
          <span class="text-right text-xs text-charcoal/70">${tradeFor}</span>
        </div>
      </div>
    </article>
  `;
}

function getTimeLeft(endsAt: string): string {
  const timeLeft = new Date(endsAt).getTime() - Date.now();
  if (Number.isNaN(timeLeft) || timeLeft <= 0) return "Ended";

  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  if (hoursLeft < 24) return `${Math.max(hoursLeft, 1)}h left`;

  return `${Math.ceil(hoursLeft / 24)}d left`;
}

export function renderListingCard(listing: Listing): string {
  const image = listing.media[0];
  const category = listing.tags[0] ?? "GENERAL";
  const bidCount = listing._count?.bids ?? 0;

  return `
    <a
      href="/product-detail.html?id=${encodeURIComponent(listing.id)}"
      class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(43,43,43,0.08)] transition-shadow hover:shadow-[0_12px_30px_rgba(43,43,43,0.12)]"
    >
      <div class="relative aspect-[4/3] bg-stone">
        ${
          image
            ? `<img src="${image.url}" alt="${image.alt || listing.title}" class="h-full w-full object-cover" />`
            : `<div class="h-full w-full bg-stone"></div>`
        }
        <span class="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
          Auction
        </span>
      </div>

      <div class="flex flex-1 flex-col gap-3 p-4">
        <span class="w-fit rounded-full bg-stone px-3 py-1 text-xs font-medium uppercase tracking-wide text-forest">
          ${category}
        </span>
        <h2 class="text-lg leading-tight text-charcoal">${listing.title}</h2>
        <div class="mt-auto flex items-end justify-between gap-3">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-charcoal/60">Current bid</p>
            <strong class="mt-1 block text-xl text-forest">${bidCount} bids</strong>
          </div>
          <span class="text-right text-xs text-charcoal/70">${getTimeLeft(listing.endsAt)}</span>
        </div>
      </div>
    </a>
  `;
}
