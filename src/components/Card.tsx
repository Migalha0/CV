import { useState, type ReactNode } from "react";
import Title from "./Title";

interface Props {
    url?: string;
    title_string: string;
    description: string | ReactNode;
}

const OWNER = "Migalha0";
const BRANCH = "master";
const EXTENSIONS = [ ".jpg", ".png", ".jpeg",".webp",".gif",];

export default function Card({
    url,
    title_string,
    description,
}: Props) {
    const [hover, setHover] = useState(false);
    const [extensionIndex, setExtensionIndex] = useState(0);
    const [hidden, setHidden] = useState(false);

    const imageUrl =
        `https://raw.githubusercontent.com/${OWNER}/${title_string}/refs/heads/${BRANCH}/preview${EXTENSIONS[extensionIndex]}`;

    return (
        <div
            className="font-poppins flex flex-col gap-2 w-75 h-fit bg-white border-3 border-solid border-brand-grey shadow-brand-grey shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-3 pb-4"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Title url={url}>{title_string}</Title>

            <div className="text-brand-grey text-left text-sm break-all mx-2">
                {description}
            </div>

            {!hidden && (
                <div
                    className={`
                        grid justify-center items-start
                        ${hover ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                        transition-all duration-300 overflow-hidden
                    `}
                >
                    <div className="overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={`Preview of ${title_string}`}
                            loading="lazy"
                            onError={() => {
                                if (extensionIndex < EXTENSIONS.length - 1) {
                                    setExtensionIndex((index) => index + 1);
                                } else {
                                    setHidden(true);
                                }
                            }}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}