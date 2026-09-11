import "./style.css";
import { renderNav } from "./components/nav";
import { renderFooter } from "./components/footer";
import {
  createListing,
  deleteListing,
  getListing,
  updateListing,
} from "./api/listings";
import { getAuth } from "./utils/auth-storage";

await renderNav("nav-root");
renderFooter("footer-root");

const auth = getAuth();

if (!auth) {
  window.location.href = "/login.html";
}

const listingId = new URLSearchParams(window.location.search).get("id");

const form = document.querySelector<HTMLFormElement>("#listing-form")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const deadlineInput = document.querySelector<HTMLInputElement>("#deadline")!;
const descriptionInput =
  document.querySelector<HTMLTextAreaElement>("#description")!;
const mediaInputs = document.querySelector<HTMLDivElement>("#media-inputs")!;
const addMediaButton =
  document.querySelector<HTMLButtonElement>("#add-media-btn")!;
const formError = document.querySelector<HTMLParagraphElement>("#form-error")!;
const submitButton = document.querySelector<HTMLButtonElement>("#submit-btn")!;
const pageTitle = document.querySelector<HTMLHeadingElement>("#page-title")!;
const deleteButton = document.querySelector<HTMLButtonElement>("#delete-btn")!;

function addMediaField(startValue = ""): void {
  const input = document.createElement("input");
  input.type = "url";
  input.placeholder = "https://...";
  input.value = startValue;
  input.className =
    "media-url-input w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
  mediaInputs.append(input);
}

addMediaButton.addEventListener("click", () => addMediaField());

// edit mode
if (listingId && auth) {
  getListing(listingId)
    .then((listing) => {
      if (listing.seller?.name !== auth.name) {
        formError.textContent = "You can only edit your own listings.";
        formError.classList.remove("hidden");
        setTimeout(() => {
          window.location.href = `/product-detail.html?id=${listingId}`;
        }, 2000);
        return;
      }

      titleInput.value = listing.title;
      descriptionInput.value = listing.description;
      deadlineInput.value = listing.endsAt.slice(0, 10);

      mediaInputs.innerHTML = "";
      if (listing.media.length > 0) {
        for (const media of listing.media) {
          addMediaField(media.url);
        }
      } else {
        addMediaField();
      }

      pageTitle.textContent = "Edit your gear";
      submitButton.textContent = "Save Changes";
      deleteButton.classList.remove("hidden");
    })
    .catch((error) => {
      formError.textContent =
        error instanceof Error ? error.message : "Something went wrong";
      formError.classList.remove("hidden");
    });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formError.textContent = "";
  formError.classList.add("hidden");

  const title = titleInput.value.trim();
  const deadline = deadlineInput.value;
  const description = descriptionInput.value.trim();
  const media = Array.from(
    document.querySelectorAll<HTMLInputElement>(".media-url-input"),
  )
    .map((input) => input.value.trim())
    .filter((url) => url !== "")
    .map((url) => ({ url, alt: title }));

  if (!title || !description) {
    formError.textContent = "Title and description are required.";
    formError.classList.remove("hidden");
    return;
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
    formError.textContent = "Deadline must be in the future.";
    formError.classList.remove("hidden");
    return;
  }

  if (!auth) {
    formError.textContent = "You must be logged in to create a listing.";
    formError.classList.remove("hidden");
    return;
  }

  const endsAt = deadlineDate.toISOString();

  try {
    submitButton.disabled = true;

    if (listingId) {
      // edit mode
      submitButton.textContent = "Saving...";

      await updateListing(
        listingId,
        { title, description, media, endsAt },
        auth.accessToken,
        auth.apiKey,
      );

      window.location.href = `/product-detail.html?id=${listingId}`;
    } else {
      // create
      submitButton.textContent = "Publishing...";

      const listing = await createListing(
        { title, description, media, endsAt },
        auth.accessToken,
        auth.apiKey,
      );

      window.location.href = `/product-detail.html?id=${listing.id}`;
    }
  } catch (error) {
    formError.textContent =
      error instanceof Error ? error.message : "Something went wrong";
    formError.classList.remove("hidden");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = listingId ? "Save Changes" : "Publish Listing";
  }
});

// delete button
deleteButton.addEventListener("click", async () => {
  if (
    !confirm(
      "Are you sure you want to delete this listing? This cannot be undone.",
    )
  ) {
    return;
  }

  if (!listingId || !auth) return;

  try {
    await deleteListing(listingId, auth.accessToken, auth.apiKey);

    window.location.href = "/browse.html";
  } catch (error) {
    formError.textContent =
      error instanceof Error ? error.message : "Something went wrong";
    formError.classList.remove("hidden");
  }
});
