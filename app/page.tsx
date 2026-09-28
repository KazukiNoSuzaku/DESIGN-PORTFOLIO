import { site } from "@/content/site";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Academia from "@/components/Academia";
import Travel from "@/components/Travel";
import Hobbies from "@/components/Hobbies";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={site.disciplines} tone="ink" />
      <Academia />
      <Travel />
      <Marquee items={site.travel.places.map((p) => p.place)} reverse tone="ink" />
      <Hobbies />
      <Contact />
    </main>
  );
}
