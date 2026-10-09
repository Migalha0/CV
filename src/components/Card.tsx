import type { ReactNode } from "react";
import Title from "./Title";

interface Props{
    url?: string | undefined,
    title_string: string,
    description: string | ReactNode,
}

export default function Card({
    url,
    title_string,
    description,
}: Props) {



    return(
        <div 
            className="
                font-poppins
                flex
                flex-col    
                gap-2
                w-75 h-fit
                bg-white
                border-3 border-dashed border-brand-grey
                shadow-brand-grey shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                p-3 pb-4
            "
        >
            <Title url={url}>{title_string}</Title>
            <div className="text-brand-grey text-left text-sm break-all mx-2">
                {description}
            </div>
        </div>
    )
}