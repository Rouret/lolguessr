//game is invisible at the start
if (isChampNamesInLocalStorage() && isChampSpellsInLocalStorage()) {
  main.style.display = "flex";
  recap.style.display = "none";
  welcome.style.display = "none";

  //   main.style.display = "none";
  //   recap.style.display = "flex";
  //   welcome.style.display = "none";
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
