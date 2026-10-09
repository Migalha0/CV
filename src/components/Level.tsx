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

    const square = `border-2 border-black h-[32px] w-[17px]`
    const filledStyle = `
        [background-image:linear-gradient(#ff0_50%,transparent_50%),linear-gradient(90deg,#23252b_50%,transparent_50%)]
        [background-size:2px_2px]
    `

    return(
        <div className="flex gap-1 items-center">
            <div className="flex gap-0.5">

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