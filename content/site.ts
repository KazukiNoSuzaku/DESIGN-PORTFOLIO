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

export type Place = {
  place: string;
  country: string;
  lat: number;
  lon: number;
  note?: string;
  src?: string;
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
  location: "City, Country",
  coords: "00.0000° N, 00.0000° E",
  timezone: "UTC", // IANA zone, e.g. "Asia/Kolkata"
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
    intro: "Eleven cities, seven countries — and counting.",
    places: [
      { place: "New York", country: "USA", lat: 40.7128, lon: -74.006, orientation: "landscape" },
      { place: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, orientation: "portrait" },
      { place: "Paris", country: "France", lat: 48.8566, lon: 2.3522, orientation: "landscape" },
      { place: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018, orientation: "portrait" },
      { place: "Milan", country: "Italy", lat: 45.4642, lon: 9.19, orientation: "landscape" },
      { place: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964, orientation: "portrait" },
      { place: "Positano", country: "Italy", lat: 40.6281, lon: 14.485, orientation: "landscape" },
      { place: "Split", country: "Croatia", lat: 43.5081, lon: 16.4402, orientation: "portrait" },
      { place: "Dubrovnik", country: "Croatia", lat: 42.6507, lon: 18.0944, orientation: "landscape" },
      { place: "Locarno", country: "Switzerland", lat: 46.1709, lon: 8.7995, orientation: "portrait" },
      { place: "Zurich", country: "Switzerland", lat: 47.3769, lon: 8.5417, orientation: "landscape" },
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
