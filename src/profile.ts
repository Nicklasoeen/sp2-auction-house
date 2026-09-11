import "./style.css";
import { renderNav } from "./components/nav";
import { renderFooter } from "./components/footer";
import { getAuth } from "./utils/auth-storage";
import { getProfile, getProfileListings, getProfileBids } from "./api/profile";
import { getRelativeTime, getTimeLeft } from "./utils/time";

await renderNav("nav-root");
renderFooter("footer-root");

const auth = getAuth();

if (!auth) {
  window.location.href = "/login.html";
}

const profileAvatar =
  document.querySelector<HTMLImageElement>("#profile-avatar")!;
const profileName =
  document.querySelector<HTMLHeadingElement>("#profile-name")!;
const profileBio =
  document.querySelector<HTMLParagraphElement>("#profile-bio")!;
const statListings = document.querySelector<HTMLElement>("#stat-listings")!;
const statWins = document.querySelector<HTMLElement>("#stat-wins")!;
const statCredits = document.querySelector<HTMLElement>("#stat-credits")!;
const tabListings = document.querySelector<HTMLButtonElement>("#tab-listings")!;
const tabBids = document.querySelector<HTMLButtonElement>("#tab-bids")!;
const listingsPanel =
  document.querySelector<HTMLDivElement>("#listings-panel")!;
const bidsPanel = document.querySelector<HTMLDivElement>("#bids-panel")!;
const bidsCount = document.querySelector<HTMLSpanElement>("#bids-count")!;

async function loadProfile(): Promise<void> {
  if (!auth) return;

  try {
    const profile = await getProfile(auth.name, auth.accessToken, auth.apiKey);

    if (profile.avatar?.url) {
      profileAvatar.src = profile.avatar.url;
      profileAvatar.alt = profile.avatar.alt || profile.name;
    } else {
      profileAvatar.classList.add("hidden");
    }

    profileName.textContent = profile.name;
    profileBio.textContent = profile.bio || "No bio yet";
    statListings.textContent = String(profile._count?.listings ?? 0);
    statWins.textContent = String(profile._count?.wins ?? 0);
    statCredits.textContent = String(profile.credits);
  } catch (error) {
    profileBio.textContent =
      error instanceof Error ? error.message : "Something went wrong";
  }
}

async function loadListingsTab(): Promise<void> {
  if (!auth) return;

  try {
    const listings = await getProfileListings(
      auth.name,
      auth.accessToken,
      auth.apiKey,
    );

    listingsPanel.innerHTML =
      listings.length > 0
        ? listings
            .map((listing) => {
              const image = listing.media[0];
              const bids = listing.bids ?? [];
              const bidCount = listing._count?.bids ?? bids.length;
              const highestBid = Math.max(0, ...bids.map((bid) => bid.amount));
              const isActive = new Date(listing.endsAt).getTime() > Date.now();
              const price = highestBid > 0 ? `$${highestBid}` : "—";
              const details =
                bidCount > 0
                  ? `${bidCount} bids · ${getTimeLeft(listing.endsAt)}`
                  : `Open to ${listing.tags[1] ?? "offers"}`;

              return `
              <div class="flex flex-wrap items-center gap-6 border-b border-stone px-6 py-5 last:border-b-0 md:flex-nowrap">
                ${image ? `<img src="${image.url}" alt="${image.alt || listing.title}" class="h-16 w-16 shrink-0 rounded-lg object-cover" />` : `<div class="h-16 w-16 shrink-0 rounded-lg bg-stone"></div>`}
                <div class="min-w-[280px] flex-1">
                  <p class="text-[10px] uppercase tracking-wide text-charcoal/50">${listing.tags[0] ?? "General"}</p>
                  <a href="/product-detail.html?id=${encodeURIComponent(listing.id)}" class="text-sm font-medium text-charcoal hover:text-forest">${listing.title}</a>
                </div>
                <div class="w-28 text-sm">
                  <p class="text-[10px] uppercase text-charcoal/50">${highestBid > 0 ? "Current bid" : "Price"}</p>
                  <p class="font-semibold text-forest">${price}</p>
                </div>
                <div class="w-40 text-xs text-charcoal/60">
                  <p class="uppercase text-charcoal/40">Details</p>
                  <p>${details}</p>
                </div>
                <span class="rounded-full px-2 py-1 text-[8px] font-medium uppercase ${isActive ? "bg-forest text-white" : "bg-charcoal/50 text-white"}">${isActive ? "Active" : "Sold"}</span>
                <div class="flex gap-2 text-[9px]">
                  <a href="/create-listing.html?id=${encodeURIComponent(listing.id)}" class="text-forest hover:underline">Edit</a>
                  <span class="text-charcoal/30">Delete</span>
                </div>
              </div>
            `;
            })
            .join("")
        : `<p class="px-5 py-4 text-sm text-charcoal/60">You haven't listed anything yet.</p>`;
  } catch (error) {
    listingsPanel.innerHTML = `<p class="text-sm text-red-600">${
      error instanceof Error ? error.message : "Something went wrong"
    }</p>`;
  }
}

async function loadBidsTab(): Promise<void> {
  if (!auth) return;

  try {
    const bids = await getProfileBids(auth.name, auth.accessToken, auth.apiKey);
    bidsCount.textContent = bids.length > 0 ? `(${bids.length})` : "";

    bidsPanel.innerHTML =
      bids.length > 0
        ? bids
            .map((bid) => {
              const listing = bid.listing;
              const image = listing?.media?.[0];
              const listingTitle = listing?.title ?? "Listing unavailable";
              const listingHref = listing?.id
                ? `/product-detail.html?id=${encodeURIComponent(listing.id)}`
                : "/browse.html";
              const currentBid = listing?.bids?.length
                ? Math.max(
                    ...listing.bids.map((listingBid) => listingBid.amount),
                  )
                : bid.amount;
              const isWinning = bid.amount >= currentBid;

              return `
                <a
                  href="${listingHref}"
                  class="flex flex-wrap items-center gap-6 border-b border-stone px-6 py-5 last:border-b-0 hover:bg-stone/50 md:flex-nowrap"
                >
                  <div class="flex min-w-[280px] flex-1 items-center gap-4">
                    ${
                      image
                        ? `<img src="${image.url}" alt="${image.alt || listingTitle}" class="h-16 w-16 rounded-lg object-cover" />`
                        : `<div class="h-16 w-16 rounded-lg bg-stone"></div>`
                    }
                    <div>
                      <p class="text-[10px] uppercase tracking-wide text-charcoal/50">${listing?.tags?.[0] ?? "General"}</p>
                      <p class="text-sm font-medium text-charcoal">${listingTitle}</p>
                      <p class="mt-1 text-xs text-charcoal/60">${getRelativeTime(bid.created)}</p>
                    </div>
                  </div>
                  <div class="w-28 text-sm">
                    <p class="text-[10px] uppercase text-charcoal/50">Your bid</p>
                    <p class="font-semibold text-charcoal">$${bid.amount}</p>
                  </div>
                  <div class="w-28 text-sm">
                    <p class="text-[10px] uppercase text-charcoal/50">Current bid</p>
                    <p class="font-semibold text-forest">$${currentBid}</p>
                  </div>
                  <span class="rounded-full px-2 py-1 text-[8px] font-medium uppercase ${isWinning ? "bg-forest text-white" : "bg-charcoal text-white"}">${isWinning ? "Winning" : "Outbid"}</span>
                  <span class="w-16 text-right text-xs text-charcoal/60">${listing ? getTimeLeft(listing.endsAt) : ""}</span>
                </a>
              `;
            })
            .join("")
        : `<p class="px-5 py-4 text-sm text-charcoal/60">You haven't placed any bids yet.</p>`;
  } catch (error) {
    bidsPanel.innerHTML = `<p class="px-5 py-4 text-sm text-red-600">${
      error instanceof Error ? error.message : "Something went wrong"
    }</p>`;
  }
}

const activeTabClasses = ["border-forest", "text-forest"];
const inactiveTabClasses = ["border-transparent", "opacity-60"];

// only fetch each tabs data on its first click
let listingsLoaded = true;
let bidsLoaded = false;
tabListings.addEventListener("click", () => {
  listingsPanel.classList.remove("hidden");
  bidsPanel.classList.add("hidden");
  tabListings.classList.add(...activeTabClasses);
  tabListings.classList.remove(...inactiveTabClasses);
  tabBids.classList.add(...inactiveTabClasses);
  tabBids.classList.remove(...activeTabClasses);

  if (!listingsLoaded) {
    listingsLoaded = true;
    void loadListingsTab();
  }
});

tabBids.addEventListener("click", () => {
  bidsPanel.classList.remove("hidden");
  listingsPanel.classList.add("hidden");
  tabBids.classList.add(...activeTabClasses);
  tabBids.classList.remove(...inactiveTabClasses);
  tabListings.classList.add(...inactiveTabClasses);
  tabListings.classList.remove(...activeTabClasses);

  if (!bidsLoaded) {
    bidsLoaded = true;
    void loadBidsTab();
  }
});

void loadProfile();
void loadListingsTab();
