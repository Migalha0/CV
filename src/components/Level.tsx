interface Props{
    title: string,
    currentLevel: number,
    maxLevel:number
}

export default function Level({
    title,
    maxLevel,
    currentLevel
}:Props) {

    const square = `border-2 border-border h-[32px] w-[17px]`
    const filledStyle = `bg-dither [--dither-a:var(--theme-level-a)] [--dither-b:var(--theme-level-b)]`

    return(
        <div className="flex gap-1 items-center">
            <div className="flex gap-0.5" role="img" aria-label={`${title}: ${currentLevel} of ${maxLevel}`}>

                {Array.from({length: maxLevel}, (_,index) => {
                    const filled = index < currentLevel
                    return(
                        <div key={index} className={`${filled?filledStyle:''} ${square}`}/>
                    )
                })}

            </div>           
            <div className="font-semibold">{title}</div>
        </div>
    )
}