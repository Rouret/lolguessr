const ALL_CHAMP_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/data/en_US/champion.json";
const BASE_CHAMP_REQUEST =
  "http://ddragon.leagueoflegends.com/cdn/13.3.1/data/en_US/champion/";

const BASE_SPELL_IMAGE_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/img/spell/";

const imgElm = document.getElementById("spell-image");
const inputElm = document.getElementById("spell-name");
const scoreElm = document.getElementById("score");
const timerElm = document.getElementById("time");

let champNames = [];
let spells = [];

const game = {
  timerGuest: 10,
  currentSpell: {},
  score: 0,
  total: 0,
  time: 0,
  timer: null,
  isEnd: false,
};

async function getSpellNameAndImageUrl(champName) {
  const response = await fetch(BASE_CHAMP_REQUEST + champName + ".json");
  const res = await response.json();

  const spellImageUrl =
    BASE_SPELL_IMAGE_REQUEST + res.data[champName].spells[0].image.full;

  return { src: spellImageUrl, name: champName };
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getChampNames() {
  const response = await fetch(ALL_CHAMP_REQUEST);
  const res = await response.json();
  champNames = Object.keys(res.data);
  localStorage.setItem("champNames", champNames);
}

async function getSpells() {
  for (let i = 0; i < champNames.length; i++) {
    const spell = await getSpellNameAndImageUrl(champNames[i]);
    spells.push(spell);
  }
  localStorage.setItem("champSpells", JSON.stringify(spells));
}

function next() {
  const randomSpell = spells[random(0, spells.length - 1)];
  console.log(randomSpell.src);
  imgElm.src = randomSpell.src;

  game.currentSpell = randomSpell;
}

async function main() {
  if (!localStorage.getItem("champNames")) {
    await getChampNames();
  } else {
    champNames = localStorage.getItem("champNames").split(",");
  }

  if (!localStorage.getItem("champSpells")) {
    await getSpells();
  } else {
    spells = JSON.parse(localStorage.getItem("champSpells"));
  }

  next();
}

//detect enter key on inputElm
inputElm.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    if (game.timer === null) {
      console.log("timer started");
      game.timer = setInterval(() => {
        game.time += 1;
        console.log(game.time);
        timerElm.innerText = game.time;
        scoreElm.innerText = `${game.score}/${game.total}`;
        if (game.time === game.timerGuest) {
          clearInterval(game.timer);
          game.isEnd = true;
          timerElm.innerText = "/";
        }
      }, 1000);
      return;
    }
    event.preventDefault();
    if (
      inputElm.value.toLocaleLowerCase() ===
        game.currentSpell.name.toLocaleLowerCase() &&
      !game.isEnd
    ) {
      inputElm.value = "";
      game.score += 1;
      game.total += 1;
      next();
    }
  }
});

main();
