const logo = document.getElementById("logo");
const splashScreenContainer = document.getElementById(
  "splash_screen_container",
);
const gameContainer = document.getElementById("game_container");
const backgroundImage = document.getElementById("background_image");
const overlay = document.getElementById("overlay");

export function transitionStartGame() {
  logo.style.height = "150px";
  splashScreenContainer.style.display = "none";
  gameContainer.style.display = "grid";
  backgroundImage.style.filter = "blur(15px)";
  backgroundImage.style.transform = "scale(1.2)";
  overlay.style.opacity = "0.5";
}
