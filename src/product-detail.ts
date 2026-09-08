import "./style.css";
import { renderFooter } from "./components/footer";
import { renderNav } from "./components/nav";
import { getListing, placeBid } from "./api/listings";
import { getAuth } from "./utils/auth-storage";
import { getRelativeTime, getTimeLeft } from "./utils/time";

renderNav("nav-root");
renderFooter("footer-root");

const listingId = new URLSearchParams(window.location.search).get("id");
const breadcrumb = document.querySelector<HTMLParagraphElement>("#breadcrumb")!;
const mainImage = document.querySelector<HTMLImageElement>("#main-image")!;
const thumbnailRow = document.querySelector<HTMLDivElement>("#thumbnail-row")!;
const listingTitle =
  document.querySelector<HTMLHeadingElement>("#listing-title")!;
const listingDescription = document.querySelector<HTMLParagraphElement>(
  "#listing-description",
)!;
const sellerName = document.querySelector<HTMLElement>("#seller-name")!;
const timeLeft = document.querySelector<HTMLElement>("#time-left")!;
const bidCount = document.querySelector<HTMLElement>("#bid-count")!;
const currentBid = document.querySelector<HTMLElement>("#current-bid")!;
const bidHistoryList =
  document.querySelector<HTMLDivElement>("#bid-history-list")!;
const bidAmountInput = document.querySelector<HTMLInputElement>("#bid-amount")!;
const placeBidButton = document.querySelector<HTMLButtonElement>("#place-bid-btn")!;
const bidError = document.querySelector<HTMLParagraphElement>("#bid-error")!;
const bidFormArea = bidAmountInput.parentElement!;
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

    breadcrumb.textContent = `Home / Browse / ${listing.title}`;
    listingTitle.textContent = listing.title;
    listingDescription.textContent = listing.description ?? "";
    sellerName.textContent = listing.seller?.name ?? "Unknown";
    timeLeft.textContent = getTimeLeft(listing.endsAt);
    bidCount.textContent = `${bids.length} bids`;
    currentBid.textContent = `$${highestBid}`;

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
        "h-16 w-16 cursor-pointer rounded-lg object-cover ring-1 ring-stone transition-opacity hover:opacity-75";
      thumbnail.addEventListener("click", () => {
        mainImage.src = image.url;
        mainImage.alt = image.alt || listing.title;
      });
      thumbnailRow.append(thumbnail);
    });

    if (bids.length === 0) return;

    // sort by amount so leading bid matches current bid
    bidHistoryList.innerHTML = [...bids]
      .sort((firstBid, secondBid) => secondBid.amount - firstBid.amount)
      .map(
        (bid) => `
					<div class="flex items-center justify-between gap-4 border-b border-stone px-5 py-4 last:border-b-0">
						<div>
							<p class="text-sm font-medium text-charcoal">${bid.bidder.name}</p>
							<p class="mt-1 text-xs text-charcoal/60">${getRelativeTime(bid.created)}</p>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm font-semibold text-forest">$${bid.amount}</span>
							${bid.amount === highestBid ? '<span class="rounded-full bg-forest px-2 py-1 text-xs font-medium text-white">Highest bid</span>' : ""}
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

    // A bid must be a positive number and exceed the highest amount currently shown.
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
