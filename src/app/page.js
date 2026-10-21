"use client";

import { useEffect, useRef } from "react";

/* Décalage en px entre le haut et le bas de la césure FYSALI|DEV */
const SEAM_SLANT = 9;
/* Décale la césure vers la gauche : centrée dans l'espace FYSALI|DEV, loin du "D" */
const SEAM_SHIFT = -8;

export default function Home() {
  const brandRef = useRef(null);
  const brandAccentRef = useRef(null);
  const bananaRef = useRef(null);
  const ctaRef = useRef(null);
  const cleanTimerRef = useRef(null);

  useEffect(() => {
    const brand = brandRef.current;
    const brandAccent = brandAccentRef.current;
    const banana = bananaRef.current;
    const cta = ctaRef.current;

    /* démarre le fondu d'entrée du logo après le montage :
       garanti visible, jamais expiré avant le premier rendu */
    brand.classList.add("brand-in");

    /* place le logo à mi-chemin entre le haut de l'écran et la banane.
       La règle est réévaluée à chaque variation : redimensionnement,
       défilement, rotation d'écran, chargement des polices. */
    let ticking = false;
    /* inset safe-area réel (encoche / Dynamic Island), mesuré via une
       sonde : env() n'est pas lisible directement en JS */
    function safeAreaTop() {
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:env(safe-area-inset-top);visibility:hidden;pointer-events:none";
      document.body.appendChild(probe);
      const top = probe.getBoundingClientRect().top;
      probe.remove();
      return top;
    }
    function placeBrand() {
      const bananaTop = banana.getBoundingClientRect().top;
      const brandH = brand.offsetHeight;
      /* plafond : jamais à moins de 12 px au-dessus de la banane */
      const maxTop = bananaTop - brandH - 12;
      /* mi-chemin… mais sans jamais dépasser ce plafond */
      const top = Math.min((bananaTop - brandH) / 2, maxTop);
      /* pas dans l'encoche, jamais sous la banane, jamais hors écran */
      const minTop = Math.max(0, Math.min(12 + safeAreaTop(), maxTop));
      brand.style.top = Math.max(top, minTop) + "px";
      /* césure oblique alignée sur la jonction réelle FYSALI|DEV */
      brand.style.setProperty(
        "--seam-top",
        brandAccent.offsetLeft + SEAM_SHIFT + SEAM_SLANT + "px"
      );
      brand.style.setProperty(
        "--seam-bottom",
        brandAccent.offsetLeft + SEAM_SHIFT + "px"
      );
    }
    function schedulePlaceBrand() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        placeBrand();
      });
    }

    /* le bouton « Visiter l'agence » frémit uniquement au clic sur la banane */
    function poke() {
      cta.classList.remove("attention");
      void cta.offsetWidth; /* force le navigateur à rejouer l'animation */
      cta.classList.add("attention");
      clearTimeout(cleanTimerRef.current);
      cleanTimerRef.current = setTimeout(() => {
        cta.classList.remove("attention");
      }, 900);
    }

    /* lâché de ballons : au chargement puis à chaque clic sur la banane.
       Deux frames séparent la suppression et le retour de la classe :
       les animations compositées (will-change) ne redémarrent pas de
       façon fiable sur un simple recalcul forcé dans la même tâche. */
    function release() {
      document.body.classList.remove("released");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add("released");
        });
      });
    }

    const firstRelease = setTimeout(release, 500);

    const onBananaClick = () => {
      poke();
      release();
    };
    /* accessible au clavier : Entrée ou Espace déclenchent aussi le lâcher */
    const onBananaKeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        poke();
        release();
      }
    };

    banana.addEventListener("click", onBananaClick);
    banana.addEventListener("keydown", onBananaKeydown);
    window.addEventListener("resize", schedulePlaceBrand);
    window.addEventListener("scroll", schedulePlaceBrand, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(placeBrand);
    }
    placeBrand();

    return () => {
      clearTimeout(firstRelease);
      clearTimeout(cleanTimerRef.current);
      banana.removeEventListener("click", onBananaClick);
      banana.removeEventListener("keydown", onBananaKeydown);
      window.removeEventListener("resize", schedulePlaceBrand);
      window.removeEventListener("scroll", schedulePlaceBrand);
      document.body.classList.remove("released");
    };
  }, []);

  return (
    <main className="frame">
      <span className="balloon b1" aria-hidden="true">
        🎈
      </span>
      <span className="balloon b2" aria-hidden="true">
        🎈
      </span>
      <span className="balloon b3" aria-hidden="true">
        🎈
      </span>
      <span className="balloon b4" aria-hidden="true">
        🎈
      </span>

      <div className="brand" ref={brandRef}>
        <span className="brand-left">FYSALI</span>
        <span className="brand-accent" ref={brandAccentRef}>
          DEV
        </span>
      </div>

      <div
        className="banana-hero"
        role="button"
        tabIndex={0}
        aria-label="Lâcher les ballons"
        title="Cliquez pour lâcher les ballons !"
        ref={bananaRef}
      >
        🍌
      </div>

      <h1>
        Forger demai<span className="ember">n</span>{" "}
        <span className="ember">ensemble</span>
      </h1>

      <p className="subtitle">
        Conception de sites vitrine et d&apos;applications métier accessibles sur
        mesure
      </p>

      <p className="tagline">
        Discutons de votre projet autour d&apos;un café ☕, quand vous voulez…
      </p>

      <div className="cta-row">
        <a
          className="cta cta-primary"
          href="https://www.fysalidev.org"
          target="_blank"
          rel="noopener"
          ref={ctaRef}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 10.5 12 4l9 6.5V20h-6v-5h-6v5H3v-9.5z" fill="currentColor" />
          </svg>
          Visiter l&apos;agence
        </a>
        <a
          className="cta cta-secondary"
          href="https://fysalidev.notion.site/3fc3598731428051b6e0c419ee17a88f"
          target="_blank"
          rel="noopener"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 5h18v12H8l-5 4V5z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
          Laisser un message
        </a>
      </div>

      <p className="slogan">Tout débute par une rencontre</p>

      <footer>React · Node.js · Next.js · Strapi · Docker</footer>

      <div className="social-bar">
        <a
          href="https://github.com/Fysalidev"
          target="_blank"
          rel="noopener"
          aria-label="Fysalidev sur GitHub (nouvel onglet)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/fysalidev"
          target="_blank"
          rel="noopener"
          aria-label="Fysalidev sur LinkedIn (nouvel onglet)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
        </a>
        <a
          href="https://www.malt.fr"
          target="_blank"
          rel="noopener"
          aria-label="Fysalidev sur Malt (nouvel onglet)"
        >
          <svg width="16" height="16" viewBox="-0.165 9.235 6.35 6.35" fill="currentColor" aria-hidden="true">
            <path d="M3.499 13.563l-.21.21.619.618c.304.304.79.598 1.244.144.339-.34.26-.695.073-.98-.06.004-1.726.008-1.726.008zm-.963-2.325.21-.21-.608-.607c-.304-.303-.765-.621-1.243-.143-.351.35-.273.692-.087.97zm2.86.416c-.037.043-1.511 1.524-1.511 1.524h1.154c.43 0 .981-.101.981-.777 0-.496-.296-.683-.624-.747zm-3.244-.031H.981c-.43 0-.981.135-.981.778 0 .479.307.676.641.745.04-.046 1.511-1.523 1.511-1.523zm1.484 3.04-.618-.618-.608.607a2.613 2.613 0 0 1-.137.128c.07.333.266.639.745.639s.676-.307.745-.641c-.043-.037-.085-.073-.127-.115zM2.41 10.15l.608.607.618-.618a2.25 2.25 0 0 1 .128-.118c-.065-.327-.251-.623-.747-.623s-.682.297-.746.625c.046.04.092.08.14.127zm2.742.117c-.455-.454-.94-.16-1.244.144l-2.87 2.87c-.303.303-.621.765-.143 1.243.478.478.94.16 1.243-.143l2.87-2.87c.304-.304.598-.79.144-1.244Z" />
          </svg>
        </a>
      </div>
    </main>
  );
}
