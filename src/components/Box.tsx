import type { ReactNode } from "react"

interface Props{
    children: ReactNode
}

export default function Box({children}:Props){

    const bgImage = `
        [background-image:radial-gradient(#00000026_1px,transparent_1px)]
        [background-size:7px_7px]
    `
    return(
        <div className={`${bgImage} w-fit text-left px-1.5 py-1 border-2 border-brand-grey font-bold text-brand-grey bg-black/15 bg-opacity-50`}>
            {children}
        </div>
    )
}