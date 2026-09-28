// All site copy lives here. Replace the placeholder values with your own.
// Photos: drop files into /public/travel and /public/hobbies, then set `src`
// (e.g. "/travel/kyoto.jpg"). Leave `src` empty to show the placeholder frame.

export type Education = {
  years: string;
  programme: string;
  institution: string;
  location: string;
  focus: string;
};

export type Honour = { year: string; title: string; org: string };

export type Credit = { name: string; url: string };

export type Place = {
  place: string;
  country: string;
  lat: number;
  lon: number;
  note?: string;
  src?: string;
  /** Photographer credit for photos that aren't yours. */
  credit?: Credit;
  /** Second, full-colour photo revealed on hover. */
  hover?: { src: string; credit?: Credit };
  orientation: "portrait" | "landscape";
};

export type Hobby = {
  title: string;
  kicker: string;
  description: string;
  src?: string;
};

export const site = {
  name: { first: "Kaustav", last: "Ghosh" },
  initials: "KG",
  role: "Visual designer — brand, motion, 3D & code",
  intro:
    "I design identities that move and build the interfaces they live in. Grids, type and a lot of shaders.",
  tagline: "Adapt, Overcome and Align",
  location: "BLR, India",
  coords: "12.9716° N, 77.5946° E", // Bengaluru
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  /** Home photo — the preloader lands here and zooms to full screen. */
  homePhoto: {
    src: "/travel/blr.jpg",
    alt: "Vidhana Soudha, Bengaluru",
    credit: { name: "Letian Zhang", url: "https://unsplash.com/photos/tuk-tuks-drive-past-a-grand-government-building-HJrZwkwa1ww" },
  },
  year: 2026,

  disciplines: ["Adapt", "Overcome", "Align", "Brand", "Motion", "3D", "Creative code", "Typography"],

  academia: {
    title: "Academia",
    intro:
      "Where the grid came from. Formal training in communication design, with a detour into interaction and code.",
    education: [
      {
        years: "2024 — 2026",
        programme: "M.Des, Interaction Design",
        institution: "Institution Name",
        location: "City",
        focus: "Thesis — kinetic identity systems",
      },
      {
        years: "2020 — 2024",
        programme: "B.Des, Communication Design",
        institution: "Institution Name",
        location: "City",
        focus: "Typography, editorial, motion",
      },
      {
        years: "2018 — 2020",
        programme: "Higher Secondary",
        institution: "School Name",
        location: "City",
        focus: "Science & fine arts",
      },
    ] as Education[],
    honours: [
      { year: "2025", title: "Best Graduate Thesis", org: "Department of Design" },
      { year: "2024", title: "Type Design Residency", org: "Studio / Foundry" },
      { year: "2023", title: "Student Exhibition — Selected Work", org: "Gallery Name" },
      { year: "2022", title: "Merit Scholarship", org: "Institution Name" },
    ] as Honour[],
  },

  travel: {
    title: "Elsewhere",
    intro: "Twelve cities, seven countries — and counting. Hover a frame to see it in colour.",
    // Photos: Unsplash License (free to use); photographers credited on each card.
    places: [
      {
        place: "New York",
        country: "USA",
        lat: 40.7128,
        lon: -74.006,
        orientation: "landscape",
        src: "/travel/newyork.jpg",
        credit: { name: "Redd Francisco", url: "https://unsplash.com/photos/manhattan-bridge-from-dumbo-in-new-york-wOj5odhDOZ0" },
        hover: { src: "/travel/newyork-color.jpg", credit: { name: "Zac Ong", url: "https://unsplash.com/photos/yellow-suv-pHuqJLJEJm0" } },
      },
      {
        place: "Seattle",
        country: "USA",
        lat: 47.6062,
        lon: -122.3321,
        orientation: "portrait",
        src: "/travel/seattle.jpg",
        credit: { name: "Ishaan Kansal", url: "https://unsplash.com/photos/white-and-black-concrete-building-VpoPdkU_FJE" },
        hover: { src: "/travel/seattle-color.jpg", credit: { name: "Hannah Montez", url: "https://unsplash.com/photos/powered-on-public-market-farmers-market-neon-signage-hVQezjbz13w" } },
      },
      {
        place: "Paris",
        country: "France",
        lat: 48.8566,
        lon: 2.3522,
        orientation: "landscape",
        src: "/travel/paris.jpg",
        credit: { name: "Chris Karidis", url: "https://unsplash.com/photos/eiffel-tower-paris-france-nnzkZNYWHaU" },
        hover: { src: "/travel/paris-color.jpg", credit: { name: "Samuele Giglio", url: "https://unsplash.com/photos/a-man-riding-a-bike-down-a-street-next-to-tall-buildings-Pl61NA4YEuY" } },
      },
      {
        place: "London",
        country: "United Kingdom",
        lat: 51.5074,
        lon: -0.1278,
        orientation: "portrait",
        src: "/travel/london.jpg",
        credit: { name: "Billy Williams", url: "https://unsplash.com/photos/closeup-photography-of-elizabeth-tower-london-7Yn3kxhuh_I" },
        hover: { src: "/travel/london-color.jpg", credit: { name: "mae black", url: "https://unsplash.com/photos/a-red-double-decker-bus-driving-down-a-street-hwO_qS-JGQo" } },
      },
      {
        place: "Nice",
        country: "France",
        lat: 43.7102,
        lon: 7.262,
        orientation: "landscape",
        src: "/travel/nice.jpg",
        credit: { name: "Steffen Rehfuß", url: "https://unsplash.com/photos/a-view-of-a-beach-and-a-city-next-to-a-body-of-water-cWX26Fqb2pc" },
        hover: { src: "/travel/nice-color.jpg", credit: { name: "Henry Möllers", url: "https://unsplash.com/photos/orange-building-with-arched-colonnade-and-checkerboard-plaza-Yw0jdJu3ejE" } },
      },
      {
        place: "Locarno",
        country: "Switzerland",
        lat: 46.1709,
        lon: 8.7995,
        orientation: "portrait",
        src: "/travel/locarno.jpg",
        credit: { name: "Robin Ulrich", url: "https://unsplash.com/photos/brown-concrete-building-near-green-trees-under-blue-sky-during-daytime-HrvL89fAU0Y" },
        hover: { src: "/travel/locarno-color.jpg", credit: { name: "Michael Görög", url: "https://unsplash.com/photos/a-large-building-surrounded-by-trees-V7wMJefpJBg" } },
      },
      {
        place: "Milan",
        country: "Italy",
        lat: 45.4642,
        lon: 9.19,
        orientation: "landscape",
        src: "/travel/milan.jpg",
        credit: { name: "Fabio Fistarol", url: "https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-mZJkSs4a2-Y" },
        hover: { src: "/travel/milan-color.jpg", credit: { name: "elimirana", url: "https://unsplash.com/photos/brown-concrete-building-during-daytime-jIux5u55KOI" } },
      },
      {
        place: "Rome",
        country: "Italy",
        lat: 41.9028,
        lon: 12.4964,
        orientation: "portrait",
        src: "/travel/rome.jpg",
        credit: { name: "Skyler Smith", url: "https://unsplash.com/photos/a-large-stone-building-DmNrDf5podQ" },
        hover: { src: "/travel/rome-color.jpg", credit: { name: "Francesco Bruno", url: "https://unsplash.com/photos/gray-concrete-statue-fountain-in-front-of-building-ZaBjw3Bsv2c" } },
      },
      {
        place: "Positano",
        country: "Italy",
        lat: 40.6281,
        lon: 14.485,
        orientation: "landscape",
        src: "/travel/positano.jpg",
        credit: { name: "Sebastian Leonhardt", url: "https://unsplash.com/photos/positano-village-on-amalfi-coast-PkWac9CLWVA" },
        hover: { src: "/travel/positano-color.jpg", credit: { name: "Daniel Diemer", url: "https://unsplash.com/photos/a-group-of-people-on-a-beach-with-umbrellas-hYtbeKDVgJg" } },
      },
      {
        place: "Split",
        country: "Croatia",
        lat: 43.5081,
        lon: 16.4402,
        orientation: "portrait",
        src: "/travel/split.jpg",
        credit: { name: "Nathanael Lim", url: "https://unsplash.com/photos/a-person-sitting-on-the-steps-of-a-building-OwgLXdiCRZY" },
        hover: { src: "/travel/split-color.jpg", credit: { name: "Eryk Piotr Munk", url: "https://unsplash.com/photos/a-boat-in-a-city-TBpCFjHBCpM" } },
      },
      {
        place: "Dubrovnik",
        country: "Croatia",
        lat: 42.6507,
        lon: 18.0944,
        orientation: "landscape",
        src: "/travel/dubrovnik.jpg",
        credit: { name: "Ivan Ivankovic", url: "https://unsplash.com/photos/white-and-red-concrete-houses-beside-sea-M0uDTaOUZmw" },
        hover: { src: "/travel/dubrovnik-color.jpg", credit: { name: "Geio Tischler", url: "https://unsplash.com/photos/aerial-view-of-city-near-body-of-water-during-daytime-tQT5KiZSKpE" } },
      },
      {
        place: "Bangkok",
        country: "Thailand",
        lat: 13.7563,
        lon: 100.5018,
        orientation: "portrait",
        src: "/travel/bangkok.jpg",
        credit: { name: "Norbert Braun", url: "https://unsplash.com/photos/a-very-tall-building-with-some-stairs-going-up-it-PeZmopP4kY4" },
        hover: { src: "/travel/bangkok-color.jpg", credit: { name: "Dario Brönnimann", url: "https://unsplash.com/photos/a-city-street-filled-with-lots-of-traffic-next-to-tall-buildings-oKFZ2n87rWI" } },
      },
    ] as Place[],
  },

  hobbies: {
    title: "Off the clock",
    items: [
      { title: "Photography", kicker: "35mm / black & white", description: "Street and architecture, mostly film. Looking for the grid hiding in ordinary places." },
      { title: "Lettering", kicker: "Ink / brush / pixels", description: "Drawing letters by hand before they become fonts. A sketchbook a month." },
      { title: "Music", kicker: "Vinyl / synths", description: "Collecting records and making loops that end up as soundtracks for motion work." },
      { title: "Cycling", kicker: "Early mornings", description: "Long rides before the city wakes up. Best thinking time there is." },
    ] as Hobby[],
  },

  contact: {
    email: "hello@yourdomain.com",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Behance", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
};

export const nav = [
  { id: "index", label: "Index" },
  { id: "academia", label: "Academia" },
  { id: "travel", label: "Travel" },
  { id: "hobbies", label: "Hobbies" },
  { id: "contact", label: "Contact" },
];

export const formatCoords = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
