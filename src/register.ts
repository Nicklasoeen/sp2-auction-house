import "./style.css";
import authImage from "./assets/d8d1c8f7-cdc6-4f14-afd1-25f6f8904ec9-2026-08-13.jpg";
import { registerUser, loginUser, createApiKey } from "./api/auth";
import { saveAuth } from "./utils/auth-storage";

const app = document.querySelector<HTMLDivElement>("#app")!;

// register: photo panel on the left (desktop only), sign-up form on the right
app.innerHTML = `
  <div class="flex min-h-screen bg-white text-charcoal">
    <div
      class="relative hidden bg-cover bg-center md:flex md:w-1/2 md:flex-col md:justify-between md:p-8 lg:p-12"
      style="background-image: url('${authImage}')"
    >
      <div class="absolute inset-0 bg-black/35"></div>

      <div class="relative z-10 text-3xl font-bold uppercase tracking-widest text-white">REKIT</div>

      <div class="relative z-10 space-y-4">
        <h1 class="text-5xl font-bold leading-tight text-white">Your campus's gear marketplace.</h1>
        <p class="text-lg text-stone">Buy, sell, swap, or bid on sports gear — student to student.</p>
      </div>
    </div>

    <div class="flex w-full items-center justify-center bg-white md:w-1/2 md:p-8">
      <div class="w-full max-w-[380px] space-y-6 px-6 py-12 md:px-0 md:py-0">
        <div class="flex gap-6 border-b border-stone">
            <a
              href="/login.html"
              class="border-b-2 border-transparent pb-4 text-sm text-charcoal/50 transition-colors hover:text-charcoal"
            >
              Log In
            </a>
            <div class="border-b-2 border-forest pb-4 text-sm font-medium text-forest">
              Sign Up
            </div>
          </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-charcoal">Create your account</h2>
          <p class="text-sm text-charcoal/70">Sign up with your student email to get started.</p>
        </div>

        <form id="signup-form" class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium text-charcoal">Full name</label>
            <input
              type="text"
              id="name"
              placeholder="JonasHalvorsen"
              required
              class="w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
            <p class="text-xs text-charcoal/60">No spaces — letters, numbers, and underscores only.</p>
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-charcoal">Student email</label>
            <input
              type="email"
              id="email"
              placeholder="you@stud.university.edu"
              required
              class="w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
            <p class="text-xs text-charcoal/60">Must end in a valid student email domain.</p>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-charcoal">Password</label>
            <input
              type="password"
              id="password"
              placeholder="At least 8 characters"
              required
              minlength="8"
              class="w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <p id="form-error" class="hidden text-sm text-red-600"></p>

          <button
            type="submit"
            class="w-full rounded-lg bg-forest py-3.5 font-medium text-white transition-colors hover:bg-forest/90 active:bg-forest/80"
          >
            Sign Up
          </button>
        </form>

        <p class="text-center text-sm text-charcoal">
          Already have an account?
          <a href="/login.html" class="font-medium text-forest hover:underline">Log in</a>
        </p>

        <p class="text-center text-xs text-charcoal/60">
          REKIT is exclusively for verified students. We'll check your email domain before activating your account.
        </p>
      </div>
    </div>
  </div>
`;

const form = document.querySelector<HTMLFormElement>("#signup-form")!;
const nameInput = document.querySelector<HTMLInputElement>("#name")!;
const emailInput = document.querySelector<HTMLInputElement>("#email")!;
const passwordInput = document.querySelector<HTMLInputElement>("#password")!;
const submitButton = form.querySelector<HTMLButtonElement>(
  "button[type='submit']",
)!;
const errorMessage =
  document.querySelector<HTMLParagraphElement>("#form-error")!;
const submitButtonDefaultText = submitButton.textContent ?? "Sign Up";

function isValidStudentEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@stud.noroff.no");
}

function isValidName(name: string): boolean {
  return /^\w+$/.test(name);
}

function showError(message: string): void {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError(): void {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name || !email || !password) {
    showError("Please fill in all fields.");
    return;
  }

  if (!isValidName(name)) {
    showError("Name can only contain letters, numbers, and underscores (no spaces).");
    return;
  }

  if (!isValidStudentEmail(email)) {
    showError("Please use your @stud.noroff.no email address.");
    return;
  }

  if (password.length < 8) {
    showError("Password must be at least 8 characters.");
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Signing up...";

    const user = await registerUser({ name, email, password });
    const { accessToken } = await loginUser({ email, password });
    const apiKey = await createApiKey(accessToken);

    saveAuth({ name: user.name, email: user.email, accessToken, apiKey });
    window.location.href = "/index.html";
  } catch (error) {
    showError(error instanceof Error ? error.message : "Something went wrong");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = submitButtonDefaultText;
  }
});
