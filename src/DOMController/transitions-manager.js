const logo = document.getElementById("logo");
const splashScreenContainer = document.getElementById(
  "splash_screen_container",
);
const endGameContainer = document.getElementById("end_container");
const gameContainer = document.getElementById("game_container");
const backgroundImage = document.getElementById("background_image");
const overlay = document.getElementById("overlay");
const aiBoard = document.getElementById("game_board_ai");
const pointsDisplays = gameContainer.querySelectorAll(".points-display");
const alignmentButton = document.getElementById("alignment_button");

export class UiTransitions {
  static placeShips() {
    alignmentButton.style.display = "block";
    logo.style.height = "120px";
    splashScreenContainer.style.display = "none";
    pointsDisplays.forEach((pointsDisplay) => {
      pointsDisplay.style.display = "none";
    });
    aiBoard.style.display = "none";
    gameContainer.style.display = "grid";
    gameContainer.style.columnGap = "0px";
    backgroundImage.style.filter = "blur(15px)";
    backgroundImage.style.transform = "scale(1.2)";
    overlay.style.opacity = "0.5";
  }

  static startGame() {
    alignmentButton.style.display = "none";
    aiBoard.style.display = "grid";
    gameContainer.style.columnGap = "50px";
    pointsDisplays.forEach((pointsDisplay) => {
      pointsDisplay.style.display = "flex";
    });
  }

  static winnerScreen() {
    gameContainer.style.display = "none";
    logo.style.height = "200px";
    endGameContainer.style.display = "flex";
  }

  static newGame() {
    endGameContainer.style.display = "none";
    splashScreenContainer.style.display = "flex";
  }
}
