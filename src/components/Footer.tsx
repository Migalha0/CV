import Icon from "./Icon";
import LinkButton from "./LinkButton"
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="flex flex-wrap items-center justify-between gap-2 mt-6 border-t-2 border-border pt-3 text-[13px] text-text-2 text-left">
            <span>
                {t.footer.builtWith}
            </span>
            <LinkButton href="https://github.com/Migalha0/CV">
                {t.footer.source} <Icon name="external" />
            </LinkButton>
        </footer>
    )
}
