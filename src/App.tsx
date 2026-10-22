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
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);
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
      <SectionSidebar open={openSideBar} setOpen={setOpenSideBar} />

      <main className="flex flex-col w-full md:pl-8 p-4 bg-surface">
        <div className="flex gap-12 flex-1">
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
                  GITHUB ↗
                </LinkButton>
                <LinkButton variant="brand" href={personal_info.linkedin}>
                  LINKEDIN ↗
                </LinkButton>
                <LinkButton
                  variant="brand"
                  href={`tel:${personal_info.phone.replace(/[^+\d]/g, "")}`}
                  title={personal_info.phone}
                  label={`Call ${personal_info.phone}`}
                >
                  CALL
                </LinkButton>
                <LinkButton variant="brand" href={personal_info.cv} download>
                  DOWNLOAD CV ↓
                </LinkButton>
              </NameCard>

              <DarkButton theme={theme} setTheme={setTheme} />
            </div>

            <SectionAbout />

            <SectionProject />

            <SectionExperience />
          </div>

          <RightRail />
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default App;
