const imgElm = document.getElementById("spell-image");
const inputElm = document.getElementById("spell-name");
const scoreElm = document.getElementById("score");
const timerElm = document.getElementById("time");
const welcomeBtn = document.getElementById("welcome-btn");

let champNames = [];
let spells = [];

const game = {
  timerGuest: 20,
  currentSpell: {},
  score: 0,
  total: 0,
  time: 0,
  timer: null,
  isEnd: false,
  isLoading: false,
};

function next() {
  const randomSpell = spells[random(0, spells.length - 1)];
  imgElm.src = randomSpell.src;
  game.currentSpell = randomSpell;
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
    spells = await getSpellsNameAndImageUrlFromApi(champNames);
    console.log(spells);
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
  reset();
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
  reset();
}

function reset() {
  game.timer = null;
  game.time = 0;
  game.score = 0;
  game.total = 0;
  game.isEnd = false;
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
      alert(game.score);
      end();
    }
  }, 1000);
}

inputElm.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    if (game.timer === null) {
      createInterval();
      next();
      return;
    }
    if (
      inputElm.value.toLocaleLowerCase() ===
        game.currentSpell.name.toLocaleLowerCase() &&
      !game.isEnd
    ) {
      game.score += 1;
      game.total += 1;
    }
    inputElm.value = "";
    next();
    inputElm.focus();
  }
});

timerElm.innerText = `Press enter to start`;
window.onload = () => {
  init();
};
