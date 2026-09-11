import "./style.css";
import { renderFooter } from "./components/footer";
import { renderNav } from "./components/nav";
import { getListings, searchListings } from "./api/listings";
import { renderListingCard } from "./components/product-card";

await renderNav("nav-root");
renderFooter("footer-root");

const listingGrid = document.querySelector<HTMLDivElement>("#listing-grid")!;
const listingCount =
  document.querySelector<HTMLParagraphElement>("#listing-count")!;
const tagFilters = document.querySelectorAll<HTMLButtonElement>(
  "#tag-filters button",
);
const sortSelect = document.querySelector<HTMLSelectElement>("#sort-select")!;
const searchInput = document.querySelector<HTMLInputElement>("#search-input")!;
const loadMoreButton = document.querySelector<HTMLButtonElement>("#load-more")!;

let currentPage = 1;
let currentTag = "";
let currentSort = "created";
let currentSortOrder: "asc" | "desc" = "desc";
let currentSearchQuery = "";
let searchTimeout: number | undefined;

async function loadListings(append = false): Promise<void> {
  if (!append) {
    listingGrid.innerHTML = `<p class="text-sm text-charcoal/60">Loading...</p>`;
  }

  try {
    const result = currentSearchQuery
      ? await searchListings(currentSearchQuery, { page: currentPage })
      : await getListings({
          page: currentPage,
          tag: currentTag,
          sort: currentSort === "_count.bids" ? undefined : currentSort,
          sortOrder: currentSortOrder,
          active: true,
        });

    const listings =
      currentSort === "_count.bids"
        ? [...result.data].sort(
            (firstListing, secondListing) =>
              (secondListing._count?.bids ?? 0) -
              (firstListing._count?.bids ?? 0),
          )
        : result.data;
    const cards = listings.map(renderListingCard).join("");
    listingGrid.innerHTML = append ? listingGrid.innerHTML + cards : cards;
    listingCount.textContent = `${result.meta.totalCount} active listings — buy now, bid, or swap.`;
    loadMoreButton.classList.toggle("hidden", result.meta.isLastPage);
  } catch (error) {
    if (!append) {
      listingGrid.innerHTML = `<p class="text-sm text-red-600">${error instanceof Error ? error.message : "Something went wrong"}</p>`;
    }
    loadMoreButton.classList.add("hidden");
  }
}

tagFilters.forEach((button) => {
  button.addEventListener("click", () => {
    currentTag = button.dataset.tag ?? "";
    currentPage = 1;

    tagFilters.forEach((filter) => {
      filter.classList.remove("bg-forest", "text-white");
      filter.classList.add("bg-stone", "text-charcoal");
    });
    button.classList.remove("bg-stone", "text-charcoal");
    button.classList.add("bg-forest", "text-white");

    void loadListings();
  });
});

sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  void loadListings();
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimeout);

  // Wait until typing pauses before sending a new search request.
  searchTimeout = window.setTimeout(() => {
    currentSearchQuery = searchInput.value.trim();
    currentPage = 1;
    void loadListings();
  }, 400);
});

loadMoreButton.addEventListener("click", () => {
  currentPage += 1;
  void loadListings(true);
});

void loadListings();
