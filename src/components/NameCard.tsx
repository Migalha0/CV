import type { ReactNode } from "react"
import FireDither from "./FireDither"

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
            "
        >
            {/* Grey pixel flames licking down from the top edge */}
            <FireDither
                direction="down"
                reach={1}
                heat={0.7}
                cell={1}
                className="text-brand-grey [mask-image:linear-gradient(#000,#0000_60%)]"
            />
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
