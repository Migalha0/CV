import { useLanguage } from "../i18n/LanguageContext"

interface Props {
    title: string
    currentLevel: number
    maxLevel: number
}

// Name, a filled bar on a track, and the score, like the template's bar charts
export default function Level({ title, maxLevel, currentLevel }: Props) {
    const { t } = useLanguage()

    return (
        <div className="flex items-center gap-3">
            <span className="flex-1 min-w-0 text-[15px]">{title}</span>
            <span
                role="img"
                aria-label={t.level(title, currentLevel, maxLevel)}
                className="w-24 h-2 bg-track shrink-0"
            >
                <span
                    className="block h-full bg-text"
                    style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
                />
            </span>
            <span aria-hidden="true" className="w-7 shrink-0 text-right font-mono text-[13px] text-text-2">
                {currentLevel}/{maxLevel}
            </span>
        </div>
    )
}
