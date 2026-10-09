import type { ReactNode } from "react"

interface Props{
    children: ReactNode
}

export default function Sidebar({
    children
}: Props) {

    return(
        <div className="w-full h-full overflow-y-auto p-10 bg-brand-yellow">
            {children}
        </div>
    )
}