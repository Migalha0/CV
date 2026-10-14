import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export default function NameCard({ children }: Props) {
    return (
        <div
            className="
                relative
                flex min-h-[150px] w-full
                items-center justify-center
                bg-brand-yellow
                p-4

                [clip-path:polygon(0_100%,0_40px,40px_0,100%_0,100%_calc(100%_-_40px),calc(100%_-_40px)_100%)]

                before:content-['']
                before:absolute
                before:inset-0
                before:z-0
                before:pointer-events-none

                before:[background-image:linear-gradient(var(--brand-yellow)_50%,transparent_50%),linear-gradient(90deg,var(--brand-grey)_50%,transparent_50%)]
                before:[background-size:2px_2px]

                before:[mask-image:linear-gradient(#000_-50%,#0000_80%)]
            "
        >
            <div className="relative z-10 text-3xl font-semibold text-black">
                {children}
            </div>
        </div>
    )
}