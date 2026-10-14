import type { ReactNode } from "react"

interface Props{
    url?: string,
    line?: boolean,
    children: ReactNode
}

export default function Title({
    url,
    line=true,
    children
}: Props) {

    const hasUrl = url !== undefined 

    const urlStyle = 
        'bg-brand-yellow hover:bg-black hover:text-brand-yellow hover:border-brand-grey underline p-1'
    const nonUrlStyle = 
        'text-brand-grey text-text'

    const finalStyle = `
                            text-brand-grey
                            font-bold text-left
                            ${line ? 'border-b-2 p-1 pb-0 dark:border-dotted' : ''}
                            ${hasUrl ? urlStyle : nonUrlStyle}
                        `
    return(
        url ? (
            <a 
                href={url}
                target="_blank"
                className={finalStyle}
            >
                {children}
            </a>
        ) : (
            <div className={`${finalStyle}`}>
                {children}
            </div>
        )
    )
}