import DotField from "./components/DotField.tsx";
import SectionAbout from "./components/SectionAbout.tsx";
import SectionProject from "./components/SectionProject.tsx";
import { useEffect, useState } from "react";
import SectionExperience from "./components/SectionExperience.tsx";
import SectionSidebar from "./components/SectionSidebar.tsx";
import type { Theme } from "./types/Theme.ts";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import RightRail from "./components/RightRail.tsx";
import { useLanguage } from "./i18n/LanguageContext.ts";

function App() {
  const { t } = useLanguage();

  const [theme, setTheme] = useState<Theme>(() => {
    // Storage can be blocked (strict privacy modes), which throws on access
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem("theme");
    } catch {
      // Falls back to the system preference
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // The choice just won't persist across visits
    }
  }, [theme]);

  // Start closed on phones so the first screen is the name card, not the sidebar
  const [openSideBar, setOpenSideBar] = useState(
    () => !window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateOverflow = () => {
      document.body.style.overflow =
        openSideBar && mediaQuery.matches ? "hidden" : "";
    };

    updateOverflow();

    mediaQuery.addEventListener("change", updateOverflow);

    return () => {
      mediaQuery.removeEventListener("change", updateOverflow);
      document.body.style.overflow = "";
    };
  }, [openSideBar]);

  return (
    <div
      className="flex flex-col font-poppins text-text bg-background min-h-screen
    touch-pan-y touch-pinch-zoom md:touch-auto
    selection:bg-brand-yellow selection:text-ink"
    >
      {/* First focusable element, so keyboard users can jump past the header and sidebar */}
      <a
        href="#content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:top-4 focus:left-4 focus:z-50
          focus:px-3 focus:py-2
          focus:bg-brand-yellow focus:text-ink focus:font-bold focus:border-2 focus:border-ink
        "
      >
        {t.skipToContent}
      </a>

      <Header theme={theme} setTheme={setTheme} />

      <div className="flex flex-1">
        <SectionSidebar open={openSideBar} setOpen={setOpenSideBar} />

        <div className="flex-1 min-w-0">
          <DotField>
            <div className="flex flex-col p-4 pl-14 md:p-8">
              <main
                id="content"
                tabIndex={-1}
                className="flex gap-10 flex-1 scroll-mt-4 focus:outline-none"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <SectionAbout />
                  <SectionExperience />
                  <SectionProject />
                </div>

                <RightRail />
              </main>

              <Footer />
            </div>
          </DotField>
        </div>
      </div>
    </div>
  );
}

export default App;
