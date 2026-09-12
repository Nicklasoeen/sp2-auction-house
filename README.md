# REKIT

REKIT is an auction platform for used sports equipment. It was built as Noroff Semester Project 2 and uses Noroff's Auction House API v2 for users, listings, bids, and profiles.

The app is a multi-page Vite project. Users can register with a `@stud.noroff.no` email address, browse and search for listings, filter by sport, and place bids. Logged-in users can also create listings, edit or delete their own listings, and update their profile information.

The original idea included buying, selling, and swapping gear. During the project it was narrowed down to auctions and bidding, since that is what the assignment actually requires. Buy Now and Swap are still shown in parts of the interface as Coming Soon, but they are not implemented as working listing types.

## Tech stack

- Vite
- TypeScript
- Tailwind css
- PostCSS and autoprefixer
- Prettier with tailwind css
- Noroff API v2

There are no runtime npm dependencies in the project at the moment. The tools above are listed as development dependencies in `package.json`.

## Running locally

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Nicklasoeen/sp2-auction-house.git
cd sp2-auction-house
npm install
```

Start the local development server with:

```bash
npm run dev
```

Other scripts are:

```bash
npm run build
npm run preview
```

`npm run build` runs the TypeScript compiler and then creates the Vite production build. The project has several HTML entry points, so they are listed separately in `vite.config.ts`.

## Project structure

The HTML files in the project root are the different pages in the app. Their page-specific TypeScript files are in `src/`, while shared API clients, components, and utilities are kept in their own folders:

```text
src/
├── api/          API clients for authentication, listings, and profiles
├── assets/       Images and REKIT brand assets
├── components/  Shared navigation, footer, and listing card components
├── utils/        Auth storage, logout, and time helpers
├── browse.ts
├── create-listing.ts
├── edit-profile.ts
├── login.ts
├── main.ts
├── product-detail.ts
├── profile.ts
└── register.ts
```

The main pages are the home page, login, registration, browse, product detail, create listing, profile, and edit profile pages.
