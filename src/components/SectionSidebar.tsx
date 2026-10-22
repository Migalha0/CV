import { coding_languages, hobbies, human_languages, nationalities, technical_skills } from "../data/manual_data"
import Chip from "./Chip"
import Level from "./Level"
import Title from "./Title"
import { useRef } from "react"
import useSwipeDrawer from "../hooks/useSwipeDrawer"

interface Props{
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function SideBar({
    open,
    setOpen,
}: Props){
    const drawerRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)

    useSwipeDrawer({ open, setOpen, drawerRef, backdropRef })

    return(
        <>
        {/* Dithered screen behind the open drawer on phones; tap to close */}
        <div
            ref={backdropRef}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className={`
                md:hidden fixed inset-0 z-10
                bg-dither [--dither-a:rgb(20_21_24/0.6)] [--dither-b:rgb(20_21_24/0.6)]
                transition-[opacity,visibility] duration-200
                ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}
        />

        <div 
        ref={drawerRef}
        className={`
            z-20
            flex
            fixed
            w-fit
            hide-scrollbar

            h-screen
            md:h-auto
            
            transition-transform
            duration-200
            ease-out
            ${open ? 'translate-x-0' : 'translate-x-[calc(-100%+40px)]'}
            md:translate-x-0
            md:relative
        `}>
        
        <div className={`md:w-80 xl:w-96 w-[90vw] h-full`}>
          <div className="w-full h-full overflow-y-auto p-6 xl:p-8 bg-brand-yellow dark:bg-brand-grey border-r-2 border-border dark:border-brand-yellow text-text">
          <div className="">
            <Title as="h2">CODING LANGUAGES</Title>
            <div className="flex flex-col gap-2 pl-4 pt-5">
              {coding_languages.map(language => (
                <Level
                key={language.name}
                title={language.name}
                currentLevel={language.proficiency}
                maxLevel={5}
                />
              ))}
            </div>
          </div>
          <div className="">
            <Title as="h2">LANGUAGES</Title>
            <div className="flex flex-col gap-2 pl-4 pt-5">
              {human_languages.map(language => (
                <Level
                  key={language.name}
                  title={language.name}
                  currentLevel={language.proficiency}
                  maxLevel={5}
                  />
              ))}
            </div>
          </div>

        <div>
            <Title as="h2">TECHNICAL SKILLS</Title>

            <div className="flex flex-col gap-4 pl-4 pt-5">
                {technical_skills.map(category => (
                    <div key={category.category}>
                        <h3 className="font-semibold text-text text-left mb-2">
                            {category.category}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {category.skills.map(skill => (
                                <Chip key={skill}>
                                    {skill}
                                </Chip>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

          <div className="">
            <Title as="h2">NATIONALITIES</Title>
            <div className="flex flex-col gap-2 pl-4 pt-5">
              {nationalities.map(nationality => (
                <Chip key={nationality.name}>{nationality.name}</Chip>
              ))}
            </div>
          </div>
          <div className="">
            <Title as="h2">INTERESTS</Title>
            <div className="flex flex-col gap-2 pl-4 pt-5">
              {hobbies.map(hobby => (
                <Chip key={hobby.name}>{hobby.name}</Chip>
              ))}
            </div>
          </div>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
          aria-expanded={open}
          className={`md:hidden w-10 h-10 bg-brand-yellow hover:cursor-pointer text-3xl border-2 border-ink flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>
        </button>

      </div>
      </>
    )
}