const ALL_CHAMP_REQUEST =
    "https://ddragon.leagueoflegends.com/cdn/13.3.1/data/fr_FR/champion.json";
const BASE_CHAMP_REQUEST =
    "https://ddragon.leagueoflegends.com/cdn/13.3.1/data/fr_FR/champion/";

const BASE_SPELL_IMAGE_REQUEST =
    "https://ddragon.leagueoflegends.com/cdn/13.3.1/img/spell/";

const localStorageNames = {
  champNames: "champNames",
  champSpells: "champSpells",
};
export function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function getChampNamesFromApi() {
  const response = await fetch(ALL_CHAMP_REQUEST);
  const res = await response.json();
  return Object.keys(res.data);
}
export async function getSpellsNameAndImageUrlFromApi(champNames,buttonLoading) {
  let temp = [];
  for (let i = 0; i < champNames.length; i++) {
    const response = await fetch(BASE_CHAMP_REQUEST + champNames[i] + ".json");
    const res = await response.json();

    const spellImageUrl =
      BASE_SPELL_IMAGE_REQUEST + res.data[champNames[i]].spells[0].image.full;

    buttonLoading.innerHTML = `Loading ... (${i}/${champNames.length})`;

    temp.push({ src: spellImageUrl, name: champNames[i] });
  }
  return temp;
}

export function setSpellsToLocalStorage(spells) {
  localStorage.setItem(localStorageNames.champSpells, JSON.stringify(spells));
}

export function setChampNamesToLocalStorage(champNames) {
  localStorage.setItem(localStorageNames.champNames, champNames.join(","));
}

export function getChampNamesFromLocalStorage() {
  return localStorage.getItem(localStorageNames.champNames).split(",");
}

export function getChampSpellsFromLocalStorage() {
  return JSON.parse(localStorage.getItem(localStorageNames.champSpells));
}

export function isChampNamesInLocalStorage() {
  return localStorage.getItem(localStorageNames.champNames) !== null;
}

export function isChampSpellsInLocalStorage() {
  return localStorage.getItem(localStorageNames.champSpells) !== null;
}
