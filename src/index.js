import "./DOMController/background-image-generator.js";
import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";
import { transitionStartGame } from "./DOMController/transitions.js";
import { initBoradInDom } from "./DOMController/playing-field-generator.js";
import { updateBoard } from "./DOMController/update-bord.js";
import { initHoverTracker } from "./DOMController/hovered-field-tracker.js";

import "./main.css";

const startButton = document.getElementById("start_button");
const inputUserName = document.getElementById("input_user_name");
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const usableShipLengths = [5, 4, 3, 3, 2];
const ai = new Ai();
const player = new Player();
player.gameboard.placeShip({
  length: 4,
  position: {
    x: 5,
    y: 5,
  },
  alignment: "x",
});

//Schiffe für Ai platzieren
for (const length of usableShipLengths) {
  let shipPlaced = false;
  while (!shipPlaced) {
    const shipData = {
      length,
      position: {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
      },
      alignment: Math.random() < 0.5 ? "x" : "y",
    };
    if (
      player.gameboard.coordinateIsValid(shipData) &&
      player.gameboard.coordIsCollsionFree(shipData)
    ) {
      ai.gameboard.placeShip(shipData);
      shipPlaced = true;
    }
  }
}

//Spielfeld nach User-Name eingabe initilisieren
startButton.addEventListener("click", () => {
  const userName = inputUserName.value;
  if (!userName) {
    inputUserName.classList.add("shake");
    setTimeout(() => inputUserName.classList.remove("shake"), 300);
    return;
  }
  player.name = userName;
  transitionStartGame();
  initBoradInDom();
  initHoverTracker();
  updateBoard(player);
});

startButton.addEventListener("click", async () => {
  while (true) {
    let shotIsValid = false;
    while (!shotIsValid) {
      shotIsValid = player.takeAShotAt(ai, await player.aimedCoord());
    }
    updateBoard(ai);
    if (ai.gameboard.allShipsSunk()) break;
    ai.takeAShotAt(player);
    await wait(250);
    updateBoard(player);
    if (player.gameboard.allShipsSunk()) {
      break;
    }
  }
});
