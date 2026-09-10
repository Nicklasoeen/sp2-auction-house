import "./style.css";
import { renderNav } from "./components/nav";
import { renderFooter } from "./components/footer";
import { getAuth } from "./utils/auth-storage";
import { getProfile, getProfileListings, getProfileBids } from "./api/profile";
import { renderListingCard } from "./components/product-card";
import { getRelativeTime } from "./utils/time";

renderNav("nav-root");
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
        ? listings.map(renderListingCard).join("")
        : `<p class="text-sm text-charcoal/60">You haven't listed anything yet.</p>`;
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

    bidsPanel.innerHTML =
      bids.length > 0
        ? bids
            .map((bid) => {
              const image = bid.listing.media[0];

              return `
                <a
                  href="/product-detail.html?id=${encodeURIComponent(bid.listing.id)}"
                  class="flex items-center justify-between gap-4 border-b border-stone px-5 py-4 last:border-b-0 hover:bg-stone/50"
                >
                  <div class="flex items-center gap-4">
                    ${
                      image
                        ? `<img src="${image.url}" alt="${image.alt || bid.listing.title}" class="h-14 w-14 rounded-lg object-cover" />`
                        : `<div class="h-14 w-14 rounded-lg bg-stone"></div>`
                    }
                    <div>
                      <p class="text-sm font-medium text-charcoal">${bid.listing.title}</p>
                      <p class="mt-1 text-xs text-charcoal/60">${getRelativeTime(bid.created)}</p>
                    </div>
                  </div>
                  <span class="text-sm font-semibold text-forest">$${bid.amount}</span>
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
