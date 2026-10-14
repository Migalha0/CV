import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export default function Box({ children }: Props) {
    const bgImage = `
        [background-image:radial-gradient(var(--theme-pattern)_1px,transparent_1px)]
        [background-size:7px_7px]
    `

    return (
        <div
            className={`
                ${bgImage}
                w-fit
                text-left
                px-1.5 py-1
                border-2 border-border
                font-bold text-text
                bg-black/15
            `}
        >
            {children}
        </div>
    )
}