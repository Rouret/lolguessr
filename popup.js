const main = document.getElementById("game");
const welcome = document.getElementById("welcome");
const recap = document.getElementById("recap");

//game is invisible at the start
main.style.display = "none";
recap.style.display = "none";
welcome.style.display = "flex";

welcomeBtn.addEventListener("click", () => {
  if (game.isLoading) return;
  main.style.display = "flex";
  recap.style.display = "none";
  welcome.style.display = "none";
  inputElm.focus();
});
