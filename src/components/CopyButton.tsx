import { useEffect, useState } from "react"
import { buttonClasses, type ButtonVariant } from "../scripts/button_classes"
import Icon from "./Icon"
import { useLanguage } from "../i18n/LanguageContext"

interface Props {
    text: string
    variant?: ButtonVariant
    className?: string
}

export default function CopyButton({ text, variant = "primary", className = "" }: Props) {
    const [copied, setCopied] = useState(false)
    const { t } = useLanguage()

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
            aria-label={t.copy.label(text)}
            title={t.copy.label(text)}
            className={`${buttonClasses(variant)} ${copied ? "bg-ink! text-brand-yellow!" : ""} ${className}`}
        >
            {copied ? <>{t.copy.copied} <Icon name="check" /></> : <>{t.copy.copy} <Icon name="copy" /></>}
        </button>
        {/* The button's own label stays "Copy …", so announce success separately */}
        <span role="status" className="sr-only">
            {copied ? t.copy.status : ""}
        </span>
        </>
    )
}
