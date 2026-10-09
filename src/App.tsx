import NameCard from "./components/NameCard"
import SectionAbout from "./components/SectionAbout.tsx"
import SectionProject from "./components/SectionProject.tsx"
import { useEffect, useState } from "react"
import SectionExperience from "./components/SectionExperience.tsx"
import SectionSidebar from "./components/SectionSidebar.tsx"

function App() {

  const [openSideBar, setOpenSideBar] = useState(true)
  const [dragStart, setDragStart] = useState<number | null>(null)
  
useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")

    const updateOverflow = () => {
        document.body.style.overflow =
            openSideBar && mediaQuery.matches ? "hidden" : ""
    }

    updateOverflow()

    mediaQuery.addEventListener("change", updateOverflow)

    return () => {
        mediaQuery.removeEventListener("change", updateOverflow)
        document.body.style.overflow = ""
    }
}, [openSideBar])

  return (
    <div className="flex font-poppins text-brand-grey min-h-screen bg-white selection:bg-brand-grey selection:text-brand-yellow">
      
      <SectionSidebar
        open={openSideBar}
        onToggle={() => setOpenSideBar(!openSideBar)}
        onDragStart={(x) => setDragStart(x)}
        onDragEnd={(x) => {
          if (dragStart === null) return;

          const distance = x - dragStart;

          if (distance < -200) {
            setOpenSideBar(false);
          } else if (distance > 200) {
            setOpenSideBar(true);
          }

          setDragStart(null);
        }}
      />

      <div
        onPointerDown={(e) => {
            setDragStart(e.clientX)
        }}

        onPointerUp={(e) => {
            if (dragStart === null) return

            const distance = e.clientX - dragStart

            if (distance > 200) {
                setOpenSideBar(true)
            }

            setDragStart(null)
        }}

         className="flex flex-col gap-4 bg-white w-full md:pl-8 p-4"
        >

        <NameCard>
          Gabriel Magalhães Barros
        </NameCard>

        <SectionAbout/>

        <SectionProject/>

        <SectionExperience/>

      </div>

    </div>
  )
}

export default App