import "./style.css";
import { renderNav } from "./components/nav";
import { renderFooter } from "./components/footer";
import { createListing } from "./api/listings";
import { getAuth } from "./utils/auth-storage";

renderNav("nav-root");
renderFooter("footer-root");

const auth = getAuth();

if (!auth) {
  window.location.href = "/login.html";
}

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

addMediaButton.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "url";
  input.placeholder = "https://...";
  input.className =
    "media-url-input w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
  mediaInputs.append(input);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formError.textContent = "";
  formError.classList.add("hidden");

  const title = titleInput.value.trim();
  const deadline = deadlineInput.value;
  const description = descriptionInput.value.trim();

  // gather every non-empty media URL field, since more can be added dynamically
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
    submitButton.textContent = "Publishing...";

    const listing = await createListing(
      { title, description, media, endsAt },
      auth.accessToken,
      auth.apiKey,
    );

    window.location.href = `/product-detail.html?id=${listing.id}`;
  } catch (error) {
    formError.textContent =
      error instanceof Error ? error.message : "Something went wrong";
    formError.classList.remove("hidden");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Publish Listing";
  }
});
