import "./DOMController/background-image-randomizer.js";
import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";
import { Transitions } from "./DOMController/transitions.js";
import { initFieldsInDom } from "./DOMController/playing-fields-generator.js";
import { Dom } from "./DOMController/update-bord.js";
import { initHoverTracker } from "./DOMController/hovered-field-tracker.js";
import { hovered } from "./DOMController/hovered-field-tracker.js";

import "./main.css";

const DOM_ELEMENTS = Object.freeze({
  startButton: document.getElementById("start_button"),
  alignmentButton: document.getElementById("alignment_button"),
  inputUserName: document.getElementById("input_user_name"),
  uiBoardPlayer: document.getElementById("game_board_player"),
});
const STATES = Object.freeze({
  playerPlacesShips: Symbol("playerPlacesShips"),
});
let currentState;
let currentAlignment = "x";
const usableShipLengths = Object.freeze([5, 4, 3, 3, 2]);
const ai = new Ai();
const player = new Player();
Dom.internalPlayer = player; //Zum anzeigen von Kolisionen beim Platzieren

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
  Dom.initMouseOverHandler();
  currentState = STATES.playerPlacesShips;
});

//Bei Klick auf alignmentbutton ausrichtung ändern
DOM_ELEMENTS.alignmentButton.addEventListener("click", () => {
  if (currentAlignment === "x") currentAlignment = "y";
  else currentAlignment = "x";
});

//Bei Klick wird Schiff platziert
DOM_ELEMENTS.startButton.addEventListener("click", async () => {
  if (currentState !== STATES.playerPlacesShips) return;
  for (const length of usableShipLengths) {
    Dom.colorHoveredFields(length, currentAlignment, "white");
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
        player.gameboard.coordIsCollsionFree(shipData)
      ) {
        player.gameboard.placeShip(shipData);
        shipPlaced = true;
      }
    }
    Dom.updateBoard(player);
  }
});

/*
initBoradInDom();
updateBoard(player);
*/

/*
DOM_ELEMENTS.startButton.addEventListener("click", async () => {
  while (true) {
    let shotIsValid = false;
    while (!shotIsValid) {
      shotIsValid = player.takeAShotAt(ai, await player.aimedCoord());
    }
    Dom.updateBoard(ai);
    if (ai.gameboard.allShipsSunk()) break;
    ai.takeAShotAt(player);
    await wait(250);
    Dom.updateBoard(player);
    if (player.gameboard.allShipsSunk()) {
      break;
    }
  }
});
*/
