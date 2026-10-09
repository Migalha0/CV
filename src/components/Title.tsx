import type { ReactNode } from "react"

interface Props{
    url?: string | undefined,
    line?: boolean,
    children: ReactNode
}

export default function Title({
    url,
    line=true,
    children
}: Props) {

    const hasUrl = url == undefined ? false : true
    const urlStyle ='bg-brand-yellow hover:bg-black hover:text-brand-yellow hover:border-brand-grey underline p-1'
    const nonUrlStyle = 'text-brand-grey'

    const finalStyle = `
                            text-brand-grey
                            font-bold text-left
                            ${line?'border-b-2 p-1 pb-0':''}
                            ${hasUrl ? urlStyle : nonUrlStyle}
                        `
    return(
        url ? (
            <a href={url} className={finalStyle}>
                {children}
            </a>
        ):(
            <div className={`${finalStyle}`}>
                {children}
            </div>
        )
    )
}