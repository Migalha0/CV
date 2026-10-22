import type { ReactNode } from "react"

interface Props{
    url?: string,
    line?: boolean,
    as?: "h1" | "h2" | "h3" | "div",
    children: ReactNode
}

export default function Title({
    url,
    line=true,
    as: Tag = "div",
    children
}: Props) {

    const hasUrl = url !== undefined

    const urlStyle =
        'text-ink bg-brand-yellow hover:bg-ink hover:text-brand-yellow hover:border-brand-grey underline p-1'
    const nonUrlStyle =
        'text-text'

    const finalStyle = `
                            font-bold text-left
                            ${line ? 'border-b-2 p-1 pb-0 dark:border-dotted' : ''}
                            ${hasUrl ? urlStyle : nonUrlStyle}
                        `
    return(
        url ? (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={finalStyle}
            >
                {children}
            </a>
        ) : (
            <Tag className={`${finalStyle}`}>
                {children}
            </Tag>
        )
    )
}
