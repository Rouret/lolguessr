const ALL_CHAMP_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/data/fr_FR/champion.json";
const BASE_CHAMP_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/data/fr_FR/champion/";

const BASE_SPELL_IMAGE_REQUEST =
  "https://ddragon.leagueoflegends.com/cdn/13.3.1/img/spell/";

const localStorageNames = {
  champNames: "champNames",
  champSpells: "champSpells",
  lolguessrVersion: "version",
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

async function getSpellsUrlFromUrl(champName) {
  return new Promise(async (resolve, reject) => {
    let spellsOfChampName = [];
    const response = await fetch(BASE_CHAMP_REQUEST + champName + ".json");
    const res = await response.json();

    for (const element of res.data[champName].spells) {
      const spellImageUrl = BASE_SPELL_IMAGE_REQUEST + element.image.full;

      spellsOfChampName.push({ src: spellImageUrl, name: champName });
    }

    resolve(spellsOfChampName);
  });
}

export async function getSpellsNameAndImageUrlFromApi(
  champNames,
  buttonLoading
) {
  let promises = [];

  for (let i = 0; i < champNames.length; i++) {
    promises.push(getSpellsUrlFromUrl(champNames[i]));
    buttonLoading.innerHTML = `Loading ... (${i}/${champNames.length})`;
  }

  const temp = await Promise.all(promises);
  let result = [];
  for (const element of temp) {
    result = result.concat(element);
  }

  return result;
}

export function setSpellsToLocalStorage(spells) {
  localStorage.setItem(localStorageNames.champSpells, JSON.stringify(spells));
}

export function setChampNamesToLocalStorage(champNames) {
  localStorage.setItem(localStorageNames.champNames, champNames.join(","));
}

export function setLolguessrVersionToLocalStorage(version) {
  localStorage.setItem(localStorageNames.lolguessrVersion, version);
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

export function isLolguessrVersionInLocalStorage(version) {
  const localStorageVersion = localStorage.getItem(
    localStorageNames.lolguessrVersion
  );
  if (localStorageVersion === null) {
    setLolguessrVersionToLocalStorage(version);
    return false;
  } else if (localStorageVersion !== version) {
    setLolguessrVersionToLocalStorage(version);
    return false;
  }
  return true;
}
