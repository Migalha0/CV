import Icon from "./Icon";
import LinkButton from "./LinkButton"

export default function Footer() {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-2 mt-16 border-t-2 border-border pt-3 text-sm text-text text-left">
            <span>
                Built from scratch with React, Tailwind CSS &amp; WebGL shaders.
            </span>
            <LinkButton href="https://github.com/Migalha0/CV">
                SOURCE <Icon name="external" />
            </LinkButton>
        </footer>
    )
}
