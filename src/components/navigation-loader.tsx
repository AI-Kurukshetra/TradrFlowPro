"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationLoader() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const clear = setTimeout(() => setPending(false), 180);
    return () => clearTimeout(clear);
  }, [pathname]);

  useEffect(() => {
    if (!pending) return;
    const clear = setTimeout(() => setPending(false), 1400);
    return () => clearTimeout(clear);
  }, [pending]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const current = `${window.location.pathname}${window.location.search}`;
      if (href === current) return;

      setPending(true);
    };

    const onSubmit = () => {
      setPending(true);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return (
    <div
      className={pending ? "nav-loader nav-loader--active" : "nav-loader"}
      aria-hidden="true"
    />
  );
}
