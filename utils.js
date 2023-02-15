const ALL_CHAMP_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/data/en_US/champion.json";
const BASE_CHAMP_REQUEST =
  "http://ddragon.leagueoflegends.com/cdn/13.3.1/data/en_US/champion/";

const BASE_SPELL_IMAGE_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/img/spell/";

const localStorageNames = {
  champNames: "champNames",
  champSpells: "champSpells",
};

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getChampNamesFromApi() {
  const response = await fetch(ALL_CHAMP_REQUEST);
  const res = await response.json();
  return Object.keys(res.data);
}
async function getSpellsNameAndImageUrlFromApi(champNames) {
  let temp = [];
  for (let i = 0; i < champNames.length; i++) {
    const response = await fetch(BASE_CHAMP_REQUEST + champNames[i] + ".json");
    const res = await response.json();

    const spellImageUrl =
      BASE_SPELL_IMAGE_REQUEST + res.data[champNames[i]].spells[0].image.full;

    temp.push({ src: spellImageUrl, name: champNames[i] });
  }
  return temp;
}

async function setSpellsToLocalStorage(spells) {
  localStorage.setItem(localStorageNames.champSpells, JSON.stringify(spells));
}

function setChampNamesToLocalStorage(champNames) {
  localStorage.setItem(localStorageNames.champNames, champNames.join(","));
}

function getChampNamesFromLocalStorage() {
  return localStorage.getItem(localStorageNames.champNames).split(",");
}

function getChampSpellsFromLocalStorage() {
  return JSON.parse(localStorage.getItem(localStorageNames.champSpells));
}

function isChampNamesInLocalStorage() {
  return localStorage.getItem(localStorageNames.champNames) !== null;
}

function isChampSpellsInLocalStorage() {
  return localStorage.getItem(localStorageNames.champSpells) !== null;
}

function removeAllFromLocalStorage() {
  localStorage.removeItem(localStorageNames.champNames);
  localStorage.removeItem(localStorageNames.champSpells);
}

function debug() {
  console.log(getChampNamesFromLocalStorage());
  console.log(getChampSpellsFromLocalStorage());
}
