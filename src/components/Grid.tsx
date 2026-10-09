import type { ReactNode } from "react"
import Title from "./Title"

interface Props{
    title: string,
    children: ReactNode
}

export default function Grid({
    title,
    children
}: Props) {

        const bgImage = `
        [background-image:radial-gradient(#00000026_1px,transparent_1px)]
        [background-size:7px_7px]
    `
    
    return(
        <div className="border-l-4 border-brand-grey flex flex-col gap-2 pl-2 pr-4 pb-4 max-w-300">
            <Title>{title}</Title>
            <div
                className={`
                    ${bgImage}
                    grid
                    grid-cols-[repeat(auto-fit,minmax(min(335px,100%),1fr))]
                    gap-4
                    `
                }
            >
                {children}
            </div>
        </div>
    )
}