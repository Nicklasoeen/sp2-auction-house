import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

// placeholder home page
app.innerHTML = `
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
    <h1 class="text-3xl font-semibold text-forest">REKIT</h1>
    <p class="max-w-md text-charcoal/80">
      Studentmarkedsplassen for brukt sportsutstyr &mdash; kjøp, selg, bytt og by.
    </p>
  </main>
`;
