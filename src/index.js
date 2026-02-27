import "./DOMController/background-image-randomizer.js";
import { Names } from "./DOMController/name-seter.js";
import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";
import { Transitions } from "./DOMController/transitions-manager.js";
import { initFieldsInDom } from "./DOMController/playing-fields-generator.js";
import { Board } from "./DOMController/bord-controler.js";
import { initHoverTracker } from "./DOMController/hovered-field-tracker.js";
import { hovered } from "./DOMController/hovered-field-tracker.js";
import { updateScoreDisplay } from "./DOMController/score-display-controler.js";

import "./main.css";

const DOM_ELEMENTS = Object.freeze({
  startButton: document.getElementById("start_button"),
  alignmentButton: document.getElementById("alignment_button"),
  inputUserName: document.getElementById("input_user_name"),
  uiBoardPlayer: document.getElementById("game_board_player"),
});
let currentAlignment = "x";
const usableShipLengths = Object.freeze([5, 4, 3, 3, 2]);
let currentShipLength;
const ai = new Ai();
const player = new Player();
Board.internalPlayer = player; //Zum anzeigen von Kolisionen beim Platzieren von Schiffen benötigt

const startGame = new CustomEvent("startGame");
const endGame = new CustomEvent("endGame");

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const waitForClick = () =>
  new Promise((resolve) =>
    DOM_ELEMENTS.uiBoardPlayer.addEventListener("click", () => resolve()),
  );

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
      ai.gameboard.coordinateIsValid(shipData) &&
      ai.gameboard.coordIsCollsionFree(shipData)
    ) {
      ai.gameboard.placeShip(shipData);
      shipPlaced = true;
    }
  }
}

//Spielfeld nach User-Name eingabe initilisieren
DOM_ELEMENTS.startButton.addEventListener("click", () => {
  const userName = DOM_ELEMENTS.inputUserName.value;
  if (!userName) {
    DOM_ELEMENTS.inputUserName.classList.add("shake");
    setTimeout(() => DOM_ELEMENTS.inputUserName.classList.remove("shake"), 300);
    return;
  }
  player.name = userName;
  Transitions.placeShips();
  initFieldsInDom();
  initHoverTracker();
  Board.initMouseOverHandler();
});

//Bei Klick auf alignmentbutton ausrichtung ändern
DOM_ELEMENTS.alignmentButton.addEventListener("click", () => {
  if (currentAlignment === "x") currentAlignment = "y";
  else currentAlignment = "x";
  Board.colorHoveredFields(currentShipLength, currentAlignment);
});

//Schiffe für Spieler platzieren
DOM_ELEMENTS.startButton.addEventListener("click", async () => {
  for (const length of usableShipLengths) {
    currentShipLength = length;
    Board.colorHoveredFields(length, currentAlignment);
    let shipPlaced = false;
    while (!shipPlaced) {
      await waitForClick();
      const shipData = {
        length: length,
        position: hovered.coordPlayer,
        alignment: currentAlignment,
      };
      if (
        player.gameboard.coordinateIsValid(shipData) &&
        player.gameboard.coordIsCollsionFree(shipData) &&
        hovered.coordPlayer.x !== null &&
        hovered.coordPlayer.y !== null
      ) {
        player.gameboard.placeShip(shipData);
        shipPlaced = true;
      }
    }
    Board.updateBoard(player);
  }
  Board.stopColorFields();
  document.dispatchEvent(startGame);
});

//Übergang zum Spiel
document.addEventListener("startGame", () => {
  Transitions.startGame();
  updateScoreDisplay(player);
  updateScoreDisplay(ai);
  Names.displayNames(player, ai);
});

//Ablauf während des Spieles
document.addEventListener("startGame", async () => {
  while (true) {
    let shotIsValid = false;
    while (!shotIsValid) {
      shotIsValid = player.takeAShotAt(ai, await player.aimedCoord());
    }
    Board.updateBoard(ai);
    updateScoreDisplay(ai);
    if (ai.gameboard.allShipsSunk()) break;
    ai.takeAShotAt(player);
    await wait(250);
    Board.updateBoard(player);
    updateScoreDisplay(player);
    if (player.gameboard.allShipsSunk()) {
      break;
    }
  }
  document.dispatchEvent(endGame);
});

//Übergang zum Gewinnerscreen
document.addEventListener("endGame", () => {
  Transitions.winnerScreen();
  Names.displayWinnerName(player, ai);
});
