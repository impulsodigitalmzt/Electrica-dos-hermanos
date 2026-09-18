import { forwardRef, useEffect, useState, type MouseEvent, type ReactNode } from "react";

export type AppRoute =
  | { name: "home" }
  | { name: "search"; q: string; categoria: string; iluminacion: boolean }
  | { name: "product"; sku: string };

function leerRuta(pathname = window.location.pathname, search = window.location.search): AppRoute {
  const params = new URLSearchParams(search);
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/iluminacion") {
    return { name: "search", q: params.get("q") ?? "", categoria: params.get("categoria") ?? "", iluminacion: true };
  }
  if (path === "/buscar") {
    return { name: "search", q: params.get("q") ?? "", categoria: params.get("categoria") ?? "", iluminacion: false };
  }
  const producto = path.match(/^\/producto\/([^/]+)$/);
  if (producto?.[1]) return { name: "product", sku: decodeURIComponent(producto[1]) };
  return { name: "home" };
}

export function navigate(to: string) {
  if (to.startsWith("#")) {
    const id = to.slice(1);
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", `/${to}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const url = new URL(to, window.location.origin);
  if (url.origin !== window.location.origin) {
    window.location.assign(to);
    return;
  }
  window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
  if (url.hash) {
    window.requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: "smooth" }));
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

export function useRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(() => leerRuta());
  useEffect(() => {
    const sync = () => setRoute(leerRuta());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  return route;
}

export const AppLink = forwardRef<
  HTMLAnchorElement,
  {
    to: string;
    className?: string;
    children: ReactNode;
    "aria-label"?: string;
  }
>(function AppLink({ to, className, children, "aria-label": ariaLabel }, ref) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(to);
  }
  return (
    <a href={to} ref={ref} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  );
});
