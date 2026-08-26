export type Product = {
  image: string;
  category: string;
  title: string;
  price: string;
  tradeFor: string;
};

export function productCard({
  image,
  category,
  title,
  price,
  tradeFor,
}: Product): string {
  return `
    <article class="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(43,43,43,0.08)] transition-shadow hover:shadow-[0_12px_30px_rgba(43,43,43,0.12)]">
      <img
        src="${image}"
        alt="${title}"
        class="aspect-[4/3] w-full rounded-2xl object-cover"
      />
      <div class="flex flex-1 flex-col gap-3">
        <span class="w-fit rounded-full bg-stone px-3 py-1 text-xs font-medium uppercase tracking-wide text-forest">
          ${category}
        </span>
        <h3 class="text-xl leading-tight text-charcoal">${title}</h3>
        <div class="mt-auto flex items-end justify-between gap-3">
          <strong class="text-2xl text-forest">${price}</strong>
          <span class="text-right text-xs text-charcoal/70">${tradeFor}</span>
        </div>
      </div>
    </article>
  `;
}
