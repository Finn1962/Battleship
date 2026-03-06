import "./DOMController/background-image-randomizer.js";
import { UiNames } from "./DOMController/name-seter.js";
import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";
import { UiTransitions } from "./DOMController/transitions-manager.js";
import { initFieldsInDom } from "./DOMController/playing-fields-generator.js";
import { UiBoard } from "./DOMController/bord-controler.js";
import { initHoverTracker } from "./DOMController/hovered-field-tracker.js";
import { hovered } from "./DOMController/hovered-field-tracker.js";
import { updateScoreDisplay } from "./DOMController/score-display-controler.js";

import "./main.css";

const DOM_ELEMENTS = Object.freeze({
  startButton: document.getElementById("start_button"),
  alignmentButton: document.getElementById("alignment_button"),
  newGameButton: document.getElementById("new_game_button"),
  inputUserName: document.getElementById("input_user_name"),
  uiBoardPlayer: document.getElementById("game_board_player"),
});
const usableShipLengths = Object.freeze([5, 4, 3, 3, 2]);
const memorie = {
  isFirstRound: true,
  currentShipLength: null,
  currentAlignment: "x",
};
const ai = new Ai();
const player = new Player();
UiBoard.internalPlayer = player; //Zum anzeigen von Kolisionen beim Platzieren von Schiffen benötigt

const newGame = new CustomEvent("newGame");
const placeShips = new CustomEvent("placeShips");
const startGame = new CustomEvent("startGame");
const endGame = new CustomEvent("endGame");

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const waitForClick = () =>
  new Promise((resolve) =>
    DOM_ELEMENTS.uiBoardPlayer.addEventListener("click", () => resolve()),
  );

//Neues Spiel wird gestartet
document.addEventListener("DOMContentLoaded", () => {
  document.dispatchEvent(newGame);
});

//Memorie, platzierte Schiffe und Ui-Spielfeld zurücksetzen
document.addEventListener("newGame", () => {
  memorie.alignment = "x";
  memorie.currentShipLength = null;
  player.gameboard.placedShips = [];
  ai.gameboard.placedShips = [];
  player.gameboard.reseivedHits = [];
  ai.gameboard.reseivedHits = [];
  player.usedCoords = new Set();
  ai.usedCoords = new Set();
});

//Schiffe für Ai platzieren
document.addEventListener("newGame", () => {
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
});

//Spielfeld nach erfolgreicher User-Name eingabe initilisieren
DOM_ELEMENTS.startButton.addEventListener("click", () => {
  //Überprüft die Usernameingabe
  const name = DOM_ELEMENTS.inputUserName.value;
  if (!name) {
    DOM_ELEMENTS.inputUserName.classList.add("shake");
    setTimeout(() => DOM_ELEMENTS.inputUserName.classList.remove("shake"), 300);
    return;
  }
  player.name = name;
  UiTransitions.placeShips();
  document.dispatchEvent(placeShips);
  if (!memorie.isFirstRound) {
    UiBoard.reset(player);
    UiBoard.reset(ai);
    return;
  }
  memorie.isFirstRound = false;
  initFieldsInDom();
  initHoverTracker();
  UiBoard.initMouseOverHandler();
});

//Bei Klick auf alignmentbutton ausrichtung ändern
DOM_ELEMENTS.alignmentButton.addEventListener("click", () => {
  if (memorie.currentAlignment === "x") memorie.currentAlignment = "y";
  else memorie.currentAlignment = "x";
  UiBoard.colorHoveredFields(
    memorie.currentShipLength,
    memorie.currentAlignment,
  );
});

//Spieler platzierert Schiffe
document.addEventListener("placeShips", async () => {
  for (const length of usableShipLengths) {
    memorie.currentShipLength = length;
    UiBoard.colorHoveredFields(length, memorie.currentAlignment);
    let shipPlaced = false;
    while (!shipPlaced) {
      await waitForClick();
      const newShipData = {
        length: length,
        position: hovered.coordPlayer,
        alignment: memorie.currentAlignment,
      };
      if (
        player.gameboard.coordinateIsValid(newShipData) &&
        player.gameboard.coordIsCollsionFree(newShipData) &&
        hovered.coordPlayer.x !== null &&
        hovered.coordPlayer.y !== null
      ) {
        player.gameboard.placeShip(newShipData);
        shipPlaced = true;
      }
    }
    UiBoard.update(player);
  }
  UiBoard.stopColorFields();
  document.dispatchEvent(startGame);
});

//Übergang zum Spiel
document.addEventListener("startGame", () => {
  UiTransitions.startGame();
  updateScoreDisplay(player);
  updateScoreDisplay(ai);
  UiNames.showNames(player, ai);
});

//Ablauf während des Spieles
document.addEventListener("startGame", async () => {
  while (true) {
    let shotIsValid = false;
    while (!shotIsValid) {
      const aimedCoord = await player.aimedCoord();
      shotIsValid = player.takeAShotAt(ai, aimedCoord);
    }
    UiBoard.update(ai);
    updateScoreDisplay(ai);
    if (ai.gameboard.allShipsSunk()) break;
    ai.takeAShotAt(player);
    await wait(250);
    UiBoard.update(player);
    updateScoreDisplay(player);
    if (player.gameboard.allShipsSunk()) break;
  }
  document.dispatchEvent(endGame);
});

//Übergang zum Gewinnerscreen
document.addEventListener("endGame", () => {
  UiTransitions.winnerScreen();
  UiNames.showWinnerName(player, ai);
});

//Neues spiel starten
DOM_ELEMENTS.newGameButton.addEventListener("click", () => {
  document.dispatchEvent(newGame);
  UiTransitions.newGame();
});
