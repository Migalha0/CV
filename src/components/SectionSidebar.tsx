import { coding_languages, hobbies, human_languages, nationalities } from "../data/manual_data"
import Box from "./Box"
import Level from "./Level"
import Sidebar from "./Sidebar"
import Title from "./Title"

interface Props{
    open: boolean;
    onToggle: () => void;
    onDragStart: (x: number) => void;
    onDragEnd: (x: number) => void;
}

export default function SideBar({
    open,
    onToggle,
    onDragStart,
    onDragEnd,
}: Props){
    return(
        <div 

        onPointerDown={(e) => {
        onDragStart(e.clientX);
        }}

        onPointerUp={(e) => {
        onDragEnd(e.clientX);
        }}

        className={`
            z-20
            flex
            fixed
            w-fit
            hide-scrollbar

            h-screen
            md:h-auto
            
            transition
            delay-50
            duration-100
            ease-in-out
            ${open ? 'translate-x-0' : 'translate-x-[calc(-100%+40px)]'}
            md:translate-x-0
            md:relative
        `}>
        
        <div className={`md:w-fit w-[90vw] h-full`}>
          <Sidebar>
          <div className="flex flex-col gap-4 text-left ">
            <Title>PERSONAL INFO</Title>
            <div className="flex flex-col gap-4 pl-4">
              <div className="">
                <Title line={false}>NAME</Title>
                Gabriel Magalhães Barros
              </div>
              <div className="">
                <Title line={false}>PHONE NUMBER</Title>
                +55 (81) 99895-6083
              </div>
              <div className="">
                <Title line={false}>E-MAIL</Title>
                gabrielmigalhabarros@gmail.com
              </div>
                            
              <Title url="https://github.com/Migalha0" line={false}>
                  <div className="flex items-center gap-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                    </svg>
                    GitHub
                  </div>
                </Title>            
                              
                <Title url="https://www.linkedin.com/in/gabriel-magalh%C3%A3es-barros/?locale=en-US" line={false}>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                    </svg>
                    LinkedIn
                  </div>
                </Title>              
              
            </div>          
          </div>
          
          <div className="">
            <Title>CODING LANGUAGES</Title>
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
            <Title>LANGUAGES</Title>
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
          <div className="">
            <Title>NATIONALITIES</Title>
            <div className="flex flex-col gap-2 pl-4 pt-5">
              {nationalities.map(nationality => (
                <Box key={nationality.name}>{nationality.name}</Box>
              ))}
            </div>
          </div>
          <div className="">
            <Title>INTERESTS</Title>
            <div className="flex flex-col gap-2 pl-4 pt-5">
              {hobbies.map(hobby => (
                <Box key={hobby.name}>{hobby.name}</Box>
              ))}
            </div>
          </div>
          </Sidebar>
        </div>
        
        <button 
          onClick={onToggle}
          className={`md:hidden ${open?'':'right-10'} w-10 h-10 bg-brand-yellow hover:cursor-pointer text-3xl border-2 border-black flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>
        </button>

      </div>
    )
}