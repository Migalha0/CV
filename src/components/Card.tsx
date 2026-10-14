import { useEffect, useState, type ReactNode } from "react";
import Title from "./Title";

interface Props {
    url?: string;
    title_string: string;
    description: string | ReactNode;
}

const OWNER = "Migalha0";
const BRANCH = "master";
const EXTENSIONS = [".jpg", ".png", ".jpeg", ".webp", ".gif"];

export default function Card({
    url,
    title_string,
    description,
}: Props) {
    const [hover, setHover] = useState(false);
    const [extensionIndex, setExtensionIndex] = useState(0);
    const [imagePreview, setImagePreview] = useState(false);

    const imageUrl =
        `https://raw.githubusercontent.com/${OWNER}/${title_string}/refs/heads/${BRANCH}/preview${EXTENSIONS[extensionIndex]}`;

    useEffect(() => {
        let cancelled = false;

        const image = new Image();

        image.onload = () => {
            if (!cancelled) {
                setImagePreview(true);
            }
        };

        image.onerror = () => {
            if (cancelled) return;

            if (extensionIndex < EXTENSIONS.length - 1) {
                setExtensionIndex((index) => index + 1);
            }
        };

        image.src = imageUrl;

        return () => {
            cancelled = true;
            image.onload = null;
            image.onerror = null;
        };
    }, [imageUrl, extensionIndex]);

    return (
        <div
            className="
                font-poppins flex flex-col gap-2
                w-75 h-fit
                bg-surface
                border-3 border-solid border-border
                shadow-[12px_12px_0px_0px_var(--theme-shadow)]
                p-3 pb-4
            "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Title url={url}>{title_string}</Title>

            <div className="text-text text-left text-sm mx-2">
                {description}
            </div>

            {imagePreview && (
                <div
                    className={`
                        w-6 flex items-center justify-center
                        select-none overflow-hidden
                        border-border border-solid
                        transition-[height,background-color]
                        duration-[400ms,175ms]
                        text-text
                        ${
                            hover
                                ? "h-0 border bg-border"
                                : "h-6 border-2"
                        }
                    `}
                >
                    V
                </div>
            )}

            {imagePreview && (
                <div
                    className={`
                        grid items-start
                        border border-border w-full
                        ${hover ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                        overflow-hidden
                        transition-[grid-template-rows,border-color,background-color]
                        duration-[450ms,0ms,0ms]
                    `}
                >
                    <div className="overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={`Preview of ${title_string}`}
                            loading="lazy"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}