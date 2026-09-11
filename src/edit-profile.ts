import "./style.css";
import { getProfile, updateProfile } from "./api/profile";
import { renderFooter } from "./components/footer";
import { renderNav } from "./components/nav";
import { getAuth } from "./utils/auth-storage";

await renderNav("nav-root");
renderFooter("footer-root");

const auth = getAuth();

if (!auth) {
  window.location.href = "/login.html";
}

const form = document.querySelector<HTMLFormElement>("#edit-profile-form")!;
const bioInput = document.querySelector<HTMLTextAreaElement>("#bio")!;
const avatarInput = document.querySelector<HTMLInputElement>("#avatar-url")!;
const avatarPreview =
  document.querySelector<HTMLImageElement>("#avatar-preview")!;
const fullNameInput = document.querySelector<HTMLInputElement>("#full-name")!;
const saveButton = document.querySelector<HTMLButtonElement>("#save-btn")!;
const formError = document.querySelector<HTMLParagraphElement>("#form-error")!;

async function loadCurrentProfile(): Promise<void> {
  if (!auth) return;

  try {
    const profile = await getProfile(auth.name, auth.accessToken, auth.apiKey);
    bioInput.value = profile.bio ?? "";
    avatarInput.value = profile.avatar?.url ?? "";
    fullNameInput.value = profile.name;
    if (profile.avatar?.url) {
      avatarPreview.src = profile.avatar.url;
      avatarPreview.alt = profile.avatar.alt || profile.name;
    }
  } catch (error) {
    formError.textContent =
      error instanceof Error ? error.message : "Something went wrong";
    formError.classList.remove("hidden");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  formError.classList.add("hidden");

  if (!auth) return;

  const bio = bioInput.value.trim();
  const avatarUrl = avatarInput.value.trim();
  const payload = {
    bio,
    ...(avatarUrl
      ? { avatar: { url: avatarUrl, alt: `${auth.name}'s avatar` } }
      : {}),
  };

  try {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    await updateProfile(auth.name, payload, auth.accessToken, auth.apiKey);
    window.location.href = "/profile.html";
  } catch (error) {
    formError.textContent =
      error instanceof Error ? error.message : "Something went wrong";
    formError.classList.remove("hidden");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Changes";
  }
});

void loadCurrentProfile();
