import Icon from "./components/Icon.tsx";
import DotField from "./components/DotField.tsx";
import NameCard from "./components/NameCard";
import SectionAbout from "./components/SectionAbout.tsx";
import SectionProject from "./components/SectionProject.tsx";
import { useEffect, useState } from "react";
import SectionExperience from "./components/SectionExperience.tsx";
import SectionSidebar from "./components/SectionSidebar.tsx";
import type { Theme } from "./types/Theme.ts";
import DarkButton from "./components/DarkButton.tsx";
import LinkButton from "./components/LinkButton.tsx";
import Footer from "./components/Footer.tsx";
import RightRail from "./components/RightRail.tsx";
import CopyButton from "./components/CopyButton.tsx";
import { personal_info } from "./data/manual_data.ts";

function App() {
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
      className="flex font-poppins text-brand-grey min-h-screen
    touch-pan-y touch-pinch-zoom md:touch-auto
    selection:bg-brand-grey dark:selection:bg-brand-yellow selection:text-brand-yellow dark:selection:text-brand-grey"
    >
      {/* First focusable element, so keyboard users can jump past the sidebar */}
      <a
        href="#content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:top-4 focus:left-4 focus:z-50
          focus:px-3 focus:py-2
          focus:bg-ink focus:text-brand-yellow focus:font-bold
          focus:outline-2 focus:outline-offset-2 focus:outline-brand-yellow
        "
      >
        Skip to content
      </a>

      <SectionSidebar open={openSideBar} setOpen={setOpenSideBar} />

      <div className="flex flex-col w-full p-4 pl-14 md:pl-8 bg-surface">
        <main
          id="content"
          tabIndex={-1}
          className="flex gap-12 flex-1 scroll-mt-4 focus:outline-none"
        >
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="flex gap-4 md:gap-8">
              <NameCard
                name={personal_info.name}
                headline={personal_info.headline}
              >
                {/* Copy sits flush against EMAIL, for visitors without a mail client */}
                <span className="inline-flex">
                  <LinkButton
                    variant="brand"
                    href={`mailto:${personal_info.email}`}
                    title={personal_info.email}
                  >
                    EMAIL
                  </LinkButton>
                  <CopyButton
                    variant="brand"
                    text={personal_info.email}
                    className="-ml-0.5"
                  />
                </span>
                <LinkButton variant="brand" href={personal_info.github}>
                  GITHUB <Icon name="external" />
                </LinkButton>
                <LinkButton variant="brand" href={personal_info.linkedin}>
                  LINKEDIN <Icon name="external" />
                </LinkButton>
                <LinkButton
                  variant="brand"
                  href={`tel:${personal_info.phone.replace(/[^+\d]/g, "")}`}
                  title={personal_info.phone}
                  label={`Call ${personal_info.phone}`}
                >
                  CALL <Icon name="phone" />
                </LinkButton>
                <LinkButton variant="brand" href={personal_info.cv} download>
                  DOWNLOAD CV <Icon name="download" />
                </LinkButton>
              </NameCard>

              <DarkButton theme={theme} setTheme={setTheme} />
            </div>

            <DotField>
              <SectionAbout />

              <SectionExperience />

              <SectionProject />
            </DotField>
          </div>

          <RightRail />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
