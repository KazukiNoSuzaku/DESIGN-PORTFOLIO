"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export default function Clock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: site.timezone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}
