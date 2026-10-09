import type { ReactNode } from "react"

interface Props{
    children: ReactNode
}

export default function NameCard({
    children
}: Props){
    return(
        <div className="
            bg-brand-yellow
            min-h-[150px]
            w-full
            flex
            items-center
            justify-center
            [clip-path:polygon(0_100%,0_40px,40px_0,100%_0,100%_calc(100%_-_40px),calc(100%_-40px)_100%)]
            relative
            p-4

            before:z-0
            before:content-['']
            before:absolute
            before:inset-0
            before:[background-image:linear-gradient(#0000_50%,#ff0_100%),linear-gradient(90deg,#23252b_50%,#0000_50%)]
            before:[background-size:2px_2px]
            before:[mask-image:linear-gradient(#000_-50%,#0000_80%)]
        ">
            <div className="z-10 text-3xl font-semibold text-black">
                {children}
            </div>
        </div>
    )
}