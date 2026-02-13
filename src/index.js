import "./DOMController/background-image-generator.js";
import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";
import { transitionStartGame } from "./DOMController/transitions.js";
import { initBoradInDom } from "./DOMController/playing-field-generator.js";
import { updateBoard } from "./DOMController/update-bord.js";

import "./main.css";

const startButton = document.getElementById("start_button");
const inputUserName = document.getElementById("input_user_name");

const ai = new Ai();
const player = new Player();
player.gameboard.placeShip({
  length: 3,
  position: { x: 4, y: 5 },
  alignment: "y",
});
player.gameboard.placeShip({
  length: 3,
  position: { x: 7, y: 1 },
  alignment: "x",
});

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
  updateBoard(player.gameboard);
  setInterval(() => {
    ai.takeAShotAt(player);
    updateBoard(player.gameboard);
  }, 1000);
});
