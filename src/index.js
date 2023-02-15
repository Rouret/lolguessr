import {
  getChampNamesFromApi,
  getChampNamesFromLocalStorage, getChampSpellsFromLocalStorage, getSpellsNameAndImageUrlFromApi,
  isChampNamesInLocalStorage, isChampSpellsInLocalStorage,
  random,
  setChampNamesToLocalStorage, setSpellsToLocalStorage
} from "./utils";

const imgElm = document.getElementById("spell-image");
const inputElm = document.getElementById("spell-name");
const timerElm = document.getElementById("time");
const welcomeBtn = document.getElementById("welcome-btn");
const main = document.getElementById("game");
const welcome = document.getElementById("welcome");
const recap = document.getElementById("recap");
const result = document.getElementById("result");
const recapBtn = document.getElementById("recap-btn");


let champNames = [];
let spells = [];

const game = {
  timerGuest: 30,
  currentSpell: {},
  score: 0,
  total: 0,
  time: 0,
  timer: null,
  isEnd: false,
  isLoading: false,
  temp: 0,
  recap: {
    history: [],
  },
};

function next() {
  const randomSpell = spells[random(0, spells.length - 1)];
  imgElm.src = randomSpell.src;
  game.currentSpell = randomSpell;
  game.temp = new Date().getTime();
}

async function init() {
  if (!isChampNamesInLocalStorage()) {
    setIsLoading(true);
    champNames = await getChampNamesFromApi();
    setChampNamesToLocalStorage(champNames);
  } else {
    champNames = getChampNamesFromLocalStorage();
  }
  if (!isChampSpellsInLocalStorage()) {
    setIsLoading(true);
    spells = await getSpellsNameAndImageUrlFromApi(champNames,welcomeBtn);
    setSpellsToLocalStorage(spells);
  } else {
    spells = getChampSpellsFromLocalStorage();
  }

  //create a datalist
  const datalistElm = document.createElement("datalist");
  datalistElm.id = "champ-names";
  for (let i = 0; i < champNames.length; i++) {
    const optionElm = document.createElement("option");
    optionElm.value = champNames[i].toLocaleLowerCase();
    datalistElm.appendChild(optionElm);
  }
  inputElm.appendChild(datalistElm);
  inputElm.setAttribute("list", "champ-names");
  setIsLoading(false);
}

function setIsLoading(bool) {
  if (bool) {
    welcomeBtn.innerHTML = "Loading...";
  } else {
    welcomeBtn.innerHTML = "Ok";
  }
  game.isLoading = bool;
}

function end() {
  game.isEnd = true;
  timerElm.innerText = "End";
  clearInterval(game.timer);
  inputElm.disabled = true;
  game.recap.score = game.score;
  displayRecap();
  reset();
}

function displayRecap() {
  main.style.display = "none";
  recap.style.display = "flex";
  welcome.style.display = "none";
  result.innerHTML = "";

  //display score
  const scoreElm = document.createElement("div");
  scoreElm.classList.add("popup-text");
  scoreElm.classList.add("row");
  scoreElm.classList.add("im-2");
  scoreElm.innerText = `Score: ${game.score}`;
  result.appendChild(scoreElm);

  for (let i = 0; i < game.recap.history.length; i++) {
    const currentHistory = game.recap.history[i];
    const historyElm = document.createElement("div");
    historyElm.classList.add("popup-text");
    historyElm.classList.add("row");
    historyElm.classList.add("im");

    const spellImageElm = document.createElement("img");
    spellImageElm.classList.add("spell-image");
    spellImageElm.src = currentHistory.spellImage;
    historyElm.appendChild(spellImageElm);

    const inputElm = document.createElement("div");
    inputElm.classList.add("input");
    if (currentHistory.isCorrect) {
      inputElm.classList.add("right");
    } else {
      inputElm.classList.add("wrong");
    }
    if (currentHistory.input === "") {
      inputElm.innerText = "empty";
    } else {
      inputElm.innerText = currentHistory.input;
    }

    historyElm.appendChild(inputElm);

    if (!currentHistory.isCorrect) {
      const champNameElm = document.createElement("div");
      champNameElm.classList.add("right");
      champNameElm.innerText = currentHistory.champ;
      historyElm.appendChild(champNameElm);
    }

    const delayElm = document.createElement("div");
    delayElm.innerText = `${currentHistory.delay} ms `;
    historyElm.appendChild(delayElm);

    result.appendChild(historyElm);
  }
}

function reset() {
  game.timer = null;
  game.time = 0;
  game.score = 0;
  game.total = 0;
  game.isEnd = false;
  game.recap = {
    history: [],
  };
  inputElm.disabled = false;
  inputElm.value = "";
  timerElm.innerText = `Press enter to start`;
  imgElm.src =
    "https://static1.millenium.org/article_old/images/contenu/actus/LOL/Cheeky_Poro_Emote.png";
  inputElm.focus();
}

function createInterval() {
  timerElm.innerText = `${game.timerGuest}`;
  game.timer = setInterval(() => {
    game.time += 1;
    timerElm.innerText = `${game.timerGuest - game.time}`;
    if (game.time === game.timerGuest) {
      end();
    }
  }, 1000);
}

inputElm.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    if (game.timer === null) {
      createInterval();
      inputElm.value = "";
      next();
      return;
    }
    const isEqual = inputElm.value.toLocaleLowerCase() ===
    game.currentSpell.name.toLocaleLowerCase()
    if (
      isEqual &&
      !game.isEnd
    ) {
      game.score += 1;
      game.total += 1;
    }
    game.recap.history.push({
      champ: game.currentSpell.name,
      spellImage: game.currentSpell.src,
      input: inputElm.value,
      isCorrect: isEqual,
      delay: new Date().getTime() - game.temp,
    });
    inputElm.value = "";
    next();
    inputElm.focus();
  }
});

if (isChampNamesInLocalStorage() && isChampSpellsInLocalStorage()) {
  main.style.display = "flex";
  recap.style.display = "none";
  welcome.style.display = "none";
}

welcomeBtn.addEventListener("click", () => {
  if (game.isLoading) return;
  main.style.display = "flex";
  recap.style.display = "none";
  welcome.style.display = "none";
  inputElm.focus();
});

recapBtn.addEventListener("click", () => {
  if (game.isLoading) return;
  main.style.display = "flex";
  recap.style.display = "none";
  welcome.style.display = "none";
  inputElm.focus();
});


init();
timerElm.innerText = `Press enter to start`;
window.onload = () => {
  reset();
};
