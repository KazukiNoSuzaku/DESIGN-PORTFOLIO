import { site } from "@/content/site";

let printed = false;

/** ASCII signature for anyone who opens the console. */
export function signature() {
  if (printed) return;
  printed = true;
  const art = String.raw`
 ██╗  ██╗ ██████╗
 ██║ ██╔╝██╔════╝     ${site.name.first} ${site.name.last}
 █████╔╝ ██║  ███╗    ${site.role}
 ██╔═██╗ ██║   ██║
 ██║  ██╗╚██████╔╝    ADAPT / OVERCOME / ALIGN
 ╚═╝  ╚═╝ ╚═════╝     ${site.contact.email}
`;
  console.log(`%c${art}`, "font-family: monospace; line-height: 1.1;");
}
