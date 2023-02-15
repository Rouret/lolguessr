const main = document.getElementById("game");
const welcome = document.getElementById("welcome");
const recap = document.getElementById("recap");
const welcomeBtn = document.getElementById("welcome-btn");

//game is invisible at the start
main.style.display = "none";
recap.style.display = "none";
welcome.style.display = "flex";

welcomeBtn.addEventListener("click", () => {
  main.style.display = "flex";
  recap.style.display = "none";
  welcome.style.display = "none";
  inputElm.focus();
});
