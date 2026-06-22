export function level(profficiency) {
    
    const squares = Array.from({length: 5}, (_,i) =>`
        <div class="square ${i<profficiency ? "filled" : ""}"></div>
    `).join("");

    return `
        <div class="level">
            ${squares}
        </div>
    `
}