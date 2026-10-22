import type { ReactNode } from "react"

interface Props {
    name: string
    headline: string
    children?: ReactNode
}

export default function NameCard({ name, headline, children }: Props) {
    return (
        <div
            className="
                relative
                flex flex-col gap-3 min-h-[150px] w-full
                items-center justify-center
                bg-brand-yellow
                p-4 py-6

                [clip-path:polygon(0_100%,0_40px,40px_0,100%_0,100%_calc(100%_-_40px),calc(100%_-_40px)_100%)]

                before:content-['']
                before:absolute
                before:inset-0
                before:z-0
                before:pointer-events-none

                before:bg-dither
                before:[--dither-a:var(--brand-yellow)]
                before:[--dither-b:var(--brand-grey)]

                before:[mask-image:linear-gradient(#000_-50%,#0000_80%)]
            "
        >
            <h1 className="relative z-10 text-3xl font-semibold text-ink">
                {name}
            </h1>
            <p className="relative z-10 font-semibold text-ink">
                {headline}
            </p>
            {children && (
                <div className="relative z-10 flex flex-wrap justify-center gap-2 pt-1">
                    {children}
                </div>
            )}
        </div>
    )
}
