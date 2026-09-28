# DESIGN PORTFOLIO — "Index"

A monochrome, Swiss-editorial personal site. A 3D point-sphere of noise reorganises into a strict grid as you scroll.

**Stack:** Next.js 16 · GSAP (ScrollTrigger, SplitText) · Lenis · Three.js / React Three Fiber

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Editing content

All copy lives in [`content/site.ts`](content/site.ts): name, intro, academia, travel places, hobbies, contact.

Photos: drop files into `public/travel/` and `public/hobbies/`, then set `src` on the matching entry
(e.g. `src: "/travel/kyoto.jpg"`). Entries without `src` show a placeholder frame labelled with the expected path.
Images are rendered in greyscale automatically.

## Sections

| § | Section | Motion |
|---|---|---|
| 01 | Hero | Preloader counter → letter rise; noise sphere morphs to grid on scroll; letters widen near the cursor (variable `wdth`/`wght`) |
| 02 | Academia | Index table, rows invert on hover, drifting ghost years, honours list |
| 03 | Travel | Pinned horizontal gallery with parallax photos and progress bar (vertical on mobile) |
| 04 | Hobbies | Stacked sticky cards that recede as the next arrives |
| 05 | Contact | Fluid "Say hello", copy-to-clipboard email, live local clock |

Extras: custom blend-mode cursor, velocity-reactive marquees, press **G** to toggle the 12-column grid.
`prefers-reduced-motion` disables smooth scroll, the preloader and scroll animations.
