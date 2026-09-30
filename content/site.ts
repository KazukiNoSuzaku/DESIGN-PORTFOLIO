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

export type ReceiptData = {
  head: string;
  sub: string;
  meta: string;
  lines: [string, string][];
  total: [string, string];
  foot: string;
  code: string;
};

export type TicketData = {
  carrier: string;
  from: [string, string];
  to: [string, string];
  date: string;
  flight: string;
  gate: string;
  seat: string;
  cls: string;
  boarding: string;
};

export type Hobby = {
  title: string;
  kicker: string;
  description: string;
  src?: string;
  credit?: Credit;
  /** Second, full-colour photo revealed on hover. */
  hover?: { src: string; credit?: Credit };
  /** Optional till receipt pinned to the card. */
  receipt?: ReceiptData;
};

export const site = {
  name: { first: "Kaustav", last: "Ghosh" },
  initials: "KG",
  role: "Visual designer — brand, motion, 3D & code",
  intro:
    "I design identities that move and build the interfaces they live in. Grids, type and a lot of shaders.",
  tagline: "Adapt, Improvise and Align",
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

  disciplines: ["Adapt", "Improvise", "Align", "Brand", "Motion", "3D", "Creative code", "Typography"],

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
    /** Boarding pass in the section header. Placeholder details — edit freely. */
    ticket: {
      carrier: "Air India",
      from: ["BLR", "Bengaluru"],
      to: ["JFK", "New York"],
      date: "14 MAR 24",
      flight: "AI 175",
      gate: "B12",
      seat: "32A",
      cls: "Economy",
      boarding: "01:40",
    } as TicketData,
    // Placeholder photos from Unsplash (free to use, no attribution required) — replace with your own.
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
      {
        title: "Gym",
        kicker: "Iron / discipline",
        description: "Showing up when nobody's watching. Progressive overload, applied to everything else too.",
        src: "/hobbies/gym.jpg",
        credit: { name: "Jason Grant", url: "https://unsplash.com/photos/a-row-of-dumbs-in-a-gym-m4Jqyv5VwqY" },
        hover: { src: "/hobbies/gym-kg.jpg" }, // Kaustav at Gold's Gym, Electronic City
      },
      {
        title: "Tennis",
        kicker: "Baseline / weekends",
        description: "Footwork, patience and a very honest scoreboard. Losing a point is just data.",
        src: "/hobbies/tennis.jpg",
        credit: { name: "Renith R", url: "https://unsplash.com/photos/woman-playing-tennis-on-court-from-above-A9VpotrPr1k" },
        hover: { src: "/hobbies/tennis-color.jpg", credit: { name: "Andrew Heald", url: "https://unsplash.com/photos/a-man-swinging-a-tennis-racquet-on-a-tennis-court-q-lz1KZw640" } },
      },
      {
        title: "Bar hopping",
        kicker: "After dark / London",
        description: "One pint per pub, never the same street twice. Soho after dark, from the Blue Posts to wherever the night ends up.",
        src: "/hobbies/london-pub.jpg",
        credit: { name: "Kristina Bekher", url: "https://unsplash.com/photos/a-dimly-lit-pub-called-blue-posts-at-night-kVTFINgYtK8" },
        hover: { src: "/hobbies/london-pub-color.jpg", credit: { name: "Nefeli Karanikola", url: "https://unsplash.com/photos/a-night-view-of-soho-london-z0tLPP-UMZ8" } },
        receipt: {
          head: "THE BLUE POSTS",
          sub: "SOHO, LONDON W1",
          meta: "TAB 0417 · 23:48 · TABLE 6",
          lines: [
            ["1 × PINT, LONDON PRIDE", "£6.40"],
            ["1 × GUINNESS", "£6.90"],
            ["1 × NEGRONI", "£11.00"],
            ["1 × CHIPS (SHARED)", "£4.50"],
          ],
          total: ["TOTAL", "£28.80"],
          foot: "NEXT STOP: TBD\nNEVER THE SAME STREET TWICE",
          code: "BP-0417-W1",
        },
      },
      {
        title: "League of Legends",
        kicker: "Summoner's Rift / ranked",
        description: "Five people, one plan, forty minutes of adapting. Macro calls on the map, micro on the keys.",
        src: "/hobbies/league.jpg",
        credit: { name: "Nguyễn Hứng", url: "https://unsplash.com/photos/five-young-men-in-matching-black-jackets-stand-together-njmYtDR9AxU" },
        hover: { src: "/hobbies/league-color.jpg", credit: { name: "Jura", url: "https://unsplash.com/photos/black-flat-screen-computer-monitor-on-brown-wooden-desk-GWvfNtSyf-I" } },
      },
      {
        title: "Tattoos",
        kicker: "Ink / permanent record",
        description: "Skin as a sketchbook that never gets thrown out. Every piece marks a chapter, and there's always room for the next one.",
        src: "/hobbies/ink.jpg",
        credit: { name: "Allef Vinicius", url: "https://unsplash.com/photos/person-doing-tattoo-hxNiXP498UI" },
        hover: { src: "/hobbies/ink-color.jpg", credit: { name: "Chloe Boulos", url: "https://unsplash.com/photos/a-man-with-a-tattoo-on-his-arm-holding-a-gun--aLEVLQW43E" } },
      },
      {
        title: "LARPing",
        kicker: "Matcha / tote bag / main character",
        description: "Oat-milk matcha in one hand, canvas tote in the other, a paperback I'll never open. Performative? Absolutely. Committed to the bit? Also yes.",
        src: "/hobbies/tote.jpg",
        credit: { name: "Mediamodifier", url: "https://unsplash.com/photos/a-person-sitting-on-a-chair-wHalnH-gB7U" },
        hover: { src: "/hobbies/matcha.jpg", credit: { name: "Raymond Petrik", url: "https://unsplash.com/photos/a-person-holding-a-cup-of-green-liquid-ycgaquaaC-A" } },
      },
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
