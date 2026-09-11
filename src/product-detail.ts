import "./style.css";
import { renderFooter } from "./components/footer";
import { renderNav } from "./components/nav";
import { getListing, placeBid } from "./api/listings";
import { getAuth } from "./utils/auth-storage";
import { getRelativeTime, getTimeLeft } from "./utils/time";

renderNav("nav-root");
renderFooter("footer-root");

const listingId = new URLSearchParams(window.location.search).get("id");
const breadcrumbTitle =
  document.querySelector<HTMLSpanElement>("#breadcrumb-title")!;
const mainImage = document.querySelector<HTMLImageElement>("#main-image")!;
const thumbnailRow = document.querySelector<HTMLDivElement>("#thumbnail-row")!;
const listingTitle =
  document.querySelector<HTMLHeadingElement>("#listing-title")!;
const listingDescription = document.querySelector<HTMLParagraphElement>(
  "#listing-description",
)!;
const listingCategory =
  document.querySelector<HTMLElement>("#listing-category")!;
const startingBid = document.querySelector<HTMLElement>("#starting-bid")!;
const sellerName = document.querySelector<HTMLElement>("#seller-name")!;
const sellerAvatar = document.querySelector<HTMLElement>("#seller-avatar")!;
const sellerMeta = document.querySelector<HTMLElement>("#seller-meta")!;
const listingIdLabel = document.querySelector<HTMLElement>("#listing-id")!;
const listedDate = document.querySelector<HTMLElement>("#listed-date")!;
const timeLeft = document.querySelector<HTMLElement>("#time-left")!;
const bidCount = document.querySelector<HTMLElement>("#bid-count")!;
const currentBid = document.querySelector<HTMLElement>("#current-bid")!;
const bidHistoryList =
  document.querySelector<HTMLDivElement>("#bid-history-list")!;
const bidAmountInput = document.querySelector<HTMLInputElement>("#bid-amount")!;
const placeBidButton =
  document.querySelector<HTMLButtonElement>("#place-bid-btn")!;
const bidError = document.querySelector<HTMLParagraphElement>("#bid-error")!;
const bidFormArea = bidAmountInput.parentElement!;
const editListingLink =
  document.querySelector<HTMLAnchorElement>("#edit-listing-link")!;
const auth = getAuth();
let highestBidAmount = 0;

if (!auth) {
  bidFormArea.innerHTML = `
    <p class="text-center text-sm text-charcoal/70">
      <a href="/login.html" class="font-medium text-forest hover:underline">Log in</a> to place a bid.
    </p>
  `;
}

async function loadListing(): Promise<void> {
  if (!listingId) {
    listingTitle.textContent = "Listing not found";
    return;
  }

  try {
    const listing = await getListing(listingId);
    const bids = listing.bids ?? [];
    const highestBid = Math.max(0, ...bids.map((bid) => bid.amount));
    highestBidAmount = highestBid;

    breadcrumbTitle.textContent = listing.title;
    listingTitle.textContent = listing.title;
    listingDescription.textContent = listing.description ?? "";
    sellerName.textContent = listing.seller?.name ?? "Unknown";
    sellerAvatar.textContent = (listing.seller?.name ?? "?")
      .charAt(0)
      .toUpperCase();
    sellerMeta.textContent = `${listing.tags[0] ?? "General"} · ${bids.length} bids`;
    timeLeft.textContent = getTimeLeft(listing.endsAt);
    bidCount.textContent = `${bids.length} bids`;
    currentBid.textContent = `$${highestBid}`;
    listingCategory.textContent = listing.tags[0] ?? "General";
    startingBid.textContent = `$${bids.length > 0 ? Math.min(...bids.map((bid) => bid.amount)) : 0}`;
    listingIdLabel.textContent = listing.id;
    listedDate.textContent = new Date(listing.created).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    );

    if (auth && listing.seller?.name === auth.name) {
      editListingLink.classList.remove("hidden");
      editListingLink.href = `/create-listing.html?id=${listingId}`;
    }

    const firstImage = listing.media[0];
    if (firstImage) {
      mainImage.src = firstImage.url;
      mainImage.alt = firstImage.alt || listing.title;
    }

    thumbnailRow.innerHTML = "";
    listing.media.forEach((image, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = image.url;
      thumbnail.alt = image.alt || `${listing.title} image ${index + 1}`;
      thumbnail.className =
        "h-12 w-12 cursor-pointer rounded-lg object-cover ring-1 ring-stone transition-opacity hover:opacity-75";
      thumbnail.addEventListener("click", () => {
        mainImage.src = image.url;
        mainImage.alt = image.alt || listing.title;
      });
      thumbnailRow.append(thumbnail);
    });

    if (bids.length === 0) return;

    // sort by amount
    bidHistoryList.innerHTML = [...bids]
      .sort((firstBid, secondBid) => secondBid.amount - firstBid.amount)
      .map(
        (bid) => `
          <div class="flex items-center justify-between gap-4 border-b border-stone px-3 py-2 last:border-b-0 ${bid.amount === highestBid ? "bg-stone" : ""}">
            <div class="flex items-center gap-3">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-white">${bid.bidder.name.charAt(0).toUpperCase()}</span>
              <div>
                <p class="text-xs font-medium text-charcoal">${bid.bidder.name}</p>
                <p class="text-[9px] text-charcoal/60">${getRelativeTime(bid.created)}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              ${bid.amount === highestBid ? '<span class="rounded-full bg-forest px-2 py-1 text-[8px] font-medium uppercase text-white">Highest bid</span>' : ""}
              <span class="text-sm font-semibold text-forest">$${bid.amount}</span>
            </div>
          </div>
        `,
      )
      .join("");
  } catch (error) {
    listingTitle.textContent =
      error instanceof Error ? error.message : "Listing not found";
  }
}

if (auth) {
  placeBidButton.addEventListener("click", async () => {
    bidError.textContent = "";
    bidError.classList.add("hidden");

    const amount = Number(bidAmountInput.value);

    // A bid must be positive and higher than last bid
    if (!Number.isFinite(amount) || amount <= 0 || amount <= highestBidAmount) {
      bidError.textContent = "Your bid must be higher than the current bid.";
      bidError.classList.remove("hidden");
      return;
    }

    if (!listingId) {
      bidError.textContent = "Listing not found";
      bidError.classList.remove("hidden");
      return;
    }

    try {
      placeBidButton.disabled = true;
      placeBidButton.textContent = "Placing bid...";

      await placeBid(listingId, amount, auth.accessToken, auth.apiKey);
      bidAmountInput.value = "";
      await loadListing();
    } catch (error) {
      bidError.textContent =
        error instanceof Error ? error.message : "Something went wrong";
      bidError.classList.remove("hidden");
    } finally {
      placeBidButton.disabled = false;
      placeBidButton.textContent = "Place Bid";
    }
  });
}

void loadListing();
