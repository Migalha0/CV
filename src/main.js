import { level } from "./components/level";

// LEVEL BAR
document.querySelectorAll(".prof-scale").forEach(el => {
    const levelValue = Number(el.dataset.level);
    el.innerHTML = level(levelValue)
})

// COPY BUTTON
document.querySelectorAll(".copy-btn").forEach(btn =>{
    btn.addEventListener("click", async ()=>{
        const targetID = btn.dataset.copy;
        const text = document.getElementById(targetID).innerHTML;

        try{
              await navigator.clipboard.writeText(text);

                btn.classList.add("copied");

                setTimeout(() => {
                    btn.classList.remove("copied");
                }, 300);

        } catch(error) {
            console.log("copy failed",error)
        }
    })
})