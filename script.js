const firstRowEl = document.querySelector("#first-row");
const secondRowEl = document.querySelector("#second-row");
const thirdRowEl = document.querySelector("#third-row");

const firstKeyboardRow= "QWERTYUIOP".split("")
const secondKeyboardRow= "ASDFGHJKL".split("")
const thirdKeyboardRow= "ZXCVBNM".split("")
thirdKeyboardRow.unshift("ENTER")
thirdKeyboardRow.push("⌫");

firstKeyboardRow.forEach(letter=>{
    const newBtn = document.createElement("button");
    newBtn.setAttribute("class","letter-button");
    newBtn.dataset.letter = letter;
    newBtn.textContent = letter;
    firstRowEl.append(newBtn);
})

secondKeyboardRow.forEach(letter=>{
    const newBtn = document.createElement("button");
    newBtn.setAttribute("class","letter-button");
    newBtn.dataset.letter = letter;
    newBtn.textContent = letter;
    secondRowEl.append(newBtn);
})
thirdKeyboardRow.forEach(letter=>{
    const newBtn = document.createElement("button");
    newBtn.setAttribute("class","letter-button");
    newBtn.dataset.letter = letter;
    newBtn.textContent = letter;
    thirdRowEl.append(newBtn);
})
