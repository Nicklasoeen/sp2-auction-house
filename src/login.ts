import "./style.css";
import authImage from "./assets/hero.jpg";
import wordmarkWhite from "./assets/rekit-wordmark-white.svg";
import { createApiKey, loginUser } from "./api/auth";
import { saveAuth } from "./utils/auth-storage";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="flex min-h-screen bg-white text-charcoal">
    <div
      class="relative hidden bg-cover bg-center md:flex md:w-1/2 md:flex-col md:justify-between md:p-8 lg:p-12"
      style="background-image: url('${authImage}')"
    >
      <div class="absolute inset-0 bg-black/35"></div>

      <img src="${wordmarkWhite}" alt="REKIT" class="relative z-10 h-10 w-auto self-start" />

      <div class="relative z-10 space-y-4">
        <h1 class="text-5xl font-bold leading-tight text-white">Your campus's gear marketplace.</h1>
        <p class="text-lg text-stone">Buy, sell, swap, or bid on sports gear — student to student.</p>
      </div>
    </div>

    <div class="flex w-full items-center justify-center bg-white md:w-1/2 md:p-8">
      <div class="w-full max-w-[380px] space-y-6 px-6 py-12 md:px-0 md:py-0">
        <div class="flex gap-6 border-b border-stone">
          <div class="border-b-2 border-forest pb-4 text-sm font-medium text-forest">
            Log In
          </div>
          <a
            href="./register.html"
            class="border-b-2 border-transparent pb-4 text-sm text-charcoal/50 transition-colors hover:text-charcoal"
          >
            Sign Up
          </a>
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-charcoal">Welcome back</h2>
          <p class="text-sm text-charcoal/70">Log in with your student email to continue.</p>
        </div>

        <form id="login-form" class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-charcoal">Student email</label>
            <input
              type="email"
              id="email"
              placeholder="you@stud.noroff.no"
              required
              class="w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-charcoal">Password</label>
              <a href="#" class="text-xs font-medium text-forest hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
              class="w-full rounded-lg border border-stone bg-white px-4 py-3 text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <p id="form-error" class="hidden text-sm text-red-600"></p>

          <button
            type="submit"
            id="login-submit"
            class="w-full rounded-lg bg-forest py-3.5 font-medium text-white transition-colors hover:bg-forest/90 active:bg-forest/80"
          >
            Log In
          </button>
        </form>

        <p class="text-center text-sm text-charcoal">
          Don't have an account?
          <a href="./register.html" class="font-medium text-forest hover:underline">Sign up</a>
        </p>

        <p class="text-center text-xs text-charcoal/60">
          REKIT is exclusively for verified students.
        </p>
      </div>
    </div>
  </div>
`;

const form = document.querySelector<HTMLFormElement>("#login-form")!;
const emailInput = document.querySelector<HTMLInputElement>("#email")!;
const passwordInput = document.querySelector<HTMLInputElement>("#password")!;
const submitButton =
  document.querySelector<HTMLButtonElement>("#login-submit")!;
const errorMessage =
  document.querySelector<HTMLParagraphElement>("#form-error")!;
const submitButtonDefaultText = submitButton.textContent ?? "Log In";

function showError(message: string): void {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError(): void {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError("Please fill in both fields.");
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    const user = await loginUser({ email, password });
    const apiKey = await createApiKey(user.accessToken);

    saveAuth({
      name: user.name,
      email: user.email,
      accessToken: user.accessToken,
      apiKey,
    });
    window.location.href = "./index.html";
  } catch (error) {
    showError(error instanceof Error ? error.message : "Something went wrong");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = submitButtonDefaultText;
  }
});
