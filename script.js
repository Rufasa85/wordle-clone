const firstRowEl = document.querySelector("#first-row");
const secondRowEl = document.querySelector("#second-row");
const thirdRowEl = document.querySelector("#third-row");

const firstKeyboardRow = "QWERTYUIOP".split("");
const secondKeyboardRow = "ASDFGHJKL".split("");
const thirdKeyboardRow = "ZXCVBNM".split("");

thirdKeyboardRow.unshift("ENTER");
thirdKeyboardRow.push("⌫");

let currentGuess = [];

let allGuesses;
let round;
let possibleWords;
let stats = JSON.parse(localStorage.getItem("stats"))||{
    played:0,
    round1Wins:0,
    round2Wins:0,
    round3Wins:0,
    round4Wins:0,
    round5Wins:0,
    round6Wins:0,
    losses:0
}
let inProgress = localStorage.getItem("in-progress")||false;
let currentWord;
const today = new Date();
const todayStr = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
const gameDate = localStorage.getItem("game-date");

firstKeyboardRow.forEach(letter => {
    const newBtn = document.createElement("button");
    newBtn.setAttribute("class", "letter-button");
    newBtn.dataset.letter = letter;
    newBtn.textContent = letter;
    firstRowEl.append(newBtn);
  });
  
  secondKeyboardRow.forEach(letter => {
    const newBtn = document.createElement("button");
    newBtn.setAttribute("class", "letter-button");
    newBtn.dataset.letter = letter;
    newBtn.textContent = letter;
    secondRowEl.append(newBtn);
  });
  thirdKeyboardRow.forEach(letter => {
    const newBtn = document.createElement("button");
    newBtn.setAttribute("class", "letter-button");
    newBtn.dataset.letter = letter;
    newBtn.textContent = letter;
    thirdRowEl.append(newBtn);
  });

todayStr===gameDate?resumeGame():startNewGame();

function resumeGame() {
    allGuesses = JSON.parse(localStorage.getItem("todays-guesses"))||[];
    allGuesses.forEach((guess,round)=>{
        updateKeyboard(guess);
        guess.forEach((let,currentLetter)=>{
        document.querySelector(`#guess-${round+1} .letter-space-${currentLetter+1}`).textContent = let.letter;
        if(let.inSpot){
            document.querySelector(`#guess-${round+1} .letter-space-${currentLetter+1}`).classList.add("in-spot");
        } else if (let.inWord){
            document.querySelector(`#guess-${round+1} .letter-space-${currentLetter+1}`).classList.add("in-word");
        } else {
            document.querySelector(`#guess-${round+1} .letter-space-${currentLetter+1}`).classList.add("wrong");
        }
        
    })
})
    round = allGuesses.length+1;
    possibleWords = JSON.parse(localStorage.getItem("remaining-words"))
    currentWord = JSON.parse(localStorage.getItem("current-word"))
    if(inProgress==="false"){
        console.log("hiya")
        alert(`today's game has ended!
            stats: ${JSON.stringify(stats,null,2)}
            win %: ${((stats.played-stats.losses)/stats.played *100).toFixed(2)}
        `)
    }
}

function startNewGame(){
    if(inProgress){
        stats.played++;
        stats.losses++;
        localStorage.setItem('stats',JSON.stringify(stats));
    }
    possibleWords = JSON.parse(localStorage.getItem("remaining-words"))||allWords;
    currentWord = possibleWords[Math.floor(Math.random()*possibleWords.length)];
    round=1;
    possibleWords.splice(possibleWords.indexOf(currentWord),1);
    currentWord = currentWord.toUpperCase().split("")
    allGuesses=[]
    localStorage.setItem("remaining-words",JSON.stringify(possibleWords));
    localStorage.setItem("current-word",JSON.stringify(currentWord));
    localStorage.setItem("game-date",todayStr);
    localStorage.setItem("in-progress",true)
}

document.querySelector("#left").textContent = possibleWords.length;

function addToGuess(letter) {
    currentGuess.push(letter);
    document.querySelector(`#guess-${round} .letter-space-${currentGuess.length}`).textContent = letter;
}
function deleteLetter(){
    document.querySelector(`#guess-${round} .letter-space-${currentGuess.length}`).textContent = "";
    currentGuess.pop();
}

async function checkGuess(){
    let solutionCopy = [...currentWord];
    console.log(currentGuess.join(""))
  
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess.join("")}`)
        if(!res.ok){
            alert("invalid word");
            return;
        }
    const objArr = currentGuess.map(letter=>({letter,inWord:false,inSpot:false}))
    //checking correct spots first
    for (let i = 0; i < solutionCopy.length; i++) {
        if(objArr[i].letter===solutionCopy[i]){
            objArr[i].inSpot=true;
            objArr[i].inWord = true;
            solutionCopy[i]= null;
        }  
    }
    //removing letters in correct spots
    solutionCopy = solutionCopy.filter(let=>let);
    
    objArr.forEach((let,i)=>{
     if(!let.inSpot &&solutionCopy.includes(let.letter)){
            console.log('in word')
            let.inWord=true;
            solutionCopy.splice(solutionCopy.indexOf(let.letter),1)
        }
    })
    let currentLetter = 0;
    const displayLetters = setInterval(()=>{
        if(currentLetter<5){
            if(objArr[currentLetter].inSpot){
                document.querySelector(`#guess-${round} .letter-space-${currentLetter+1}`).classList.add("in-spot");
            } else if (objArr[currentLetter].inWord){
                document.querySelector(`#guess-${round} .letter-space-${currentLetter+1}`).classList.add("in-word");
            } else {
                document.querySelector(`#guess-${round} .letter-space-${currentLetter+1}`).classList.add("wrong");
            }
            currentLetter++;
        } else {
            clearInterval(displayLetters);
            updateKeyboard(objArr);
            allGuesses.push(objArr);
            localStorage.setItem("todays-guesses",JSON.stringify(allGuesses));
            if(objArr.every(let=>let.inSpot)){
                console.log('win')
                stats.played++
                stats[`round${round}Wins`]++;
                console.log(stats);
                localStorage.setItem("stats",JSON.stringify(stats));
                inProgress=false;
                localStorage.setItem("in-progress",false);
            } else {
                round++;
                if(round<=6){
                    currentGuess=[];
                    inProgress=true;
                localStorage.setItem("in-progress",true);
                }
                else {
                    console.log("lose")
                    stats.played++;
                    stats.losses++;
                    console.log(stats);
                    localStorage.setItem("stats",JSON.stringify(stats));
                    inProgress=false;
                    localStorage.setItem("in-progress",false);
                }
            }
        }
    },300)
   
}

function updateKeyboard(thisGuess){
    thisGuess.forEach(let=>{
        if(let.inSpot){
            document.querySelector(`.letter-button[data-letter=${let.letter}]`).classList.add("in-spot");
        } else if(let.inWord){
            document.querySelector(`.letter-button[data-letter=${let.letter}]`).classList.add("in-word");
        } else {
            document.querySelector(`.letter-button[data-letter=${let.letter}]`).classList.add("wrong-keyboard");
        }
    })
}
document.querySelector("#keyboard").addEventListener("click", e => {
  if (e.target.matches(".letter-button")) {
    console.log(e.target.dataset.letter);
    if(e.target.dataset.letter==="⌫"){
        if(currentGuess.length){
            deleteLetter()
        }
    } else if(e.target.dataset.letter ==="ENTER"){
        if(currentGuess.length===5){
            checkGuess()
        }
    }
    else if(currentGuess.length<5) {
        addToGuess(e.target.dataset.letter);
    }
  }
});

document.addEventListener("keyup", e => {
  console.log(e.key.toUpperCase());
    if(e.key.toUpperCase()==="BACKSPACE"){
        if(currentGuess.length){
            deleteLetter()
        }
    } else if(e.key.toUpperCase() ==="ENTER"){
        if(currentGuess.length===5){
            checkGuess()
        }
    }
    else if(currentGuess.length<5) {
        addToGuess(e.key.toUpperCase());
    }
 
});
