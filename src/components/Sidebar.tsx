import type { ReactNode } from "react"

interface Props{
    children: ReactNode
}

export default function Sidebar({
    children
}: Props) {

    return(
        <div className="w-full h-full overflow-y-auto p-10 bg-brand-yellow dark:bg-brand-grey border-r-2 border-border dark:border-brand-yellow text-text">
            {children}
        </div>
    )
}