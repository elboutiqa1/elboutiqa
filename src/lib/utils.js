export { cn } from "cn"

export function scrollToSection(e, href) {
  if (typeof window === "undefined") return;

  const isHome = href === "/" || href === "" || href === "#";
  const hash = href.includes("#") ? href.split("#")[1] : "";

  if (window.location.pathname === "/") {
    if (isHome) {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", "/");
      }
      return;
    }

    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        if (e) e.preventDefault();
        const navHeight = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, elementPosition + window.scrollY - navHeight);
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `/#${hash}`);
      }
    }
  }
}
