import { useEffect, useState } from "react"
import { buttonClasses, type ButtonVariant } from "../scripts/button_classes"

interface Props {
    text: string
    variant?: ButtonVariant
    className?: string
}

export default function CopyButton({ text, variant = "surface", className = "" }: Props) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return

        const timeout = setTimeout(() => setCopied(false), 1500)
        return () => clearTimeout(timeout)
    }, [copied])

    return (
        <>
        <button
            type="button"
            onClick={() => {
                navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})
            }}
            aria-label={`Copy ${text}`}
            title={`Copy ${text}`}
            className={`${buttonClasses(variant)} ${copied ? "bg-ink! text-brand-yellow!" : ""} ${className}`}
        >
            {copied ? "COPIED" : "COPY"}
        </button>
        {/* The button's own label stays "Copy …", so announce success separately */}
        <span role="status" className="sr-only">
            {copied ? "Email address copied" : ""}
        </span>
        </>
    )
}
