import { Gameboard } from "../gameboard/gameboard";
import { hovered } from "../DOMController/hovered-field-tracker.js";

export class Player {
  name;
  #usedCoords = new Set();
  gameboard = new Gameboard();
  remainingShips;
  sunkShips;
  role = "player";

  takeAShotAt(enemy, coord) {
    if (this.#usedCoords.has(`${coord.x},${coord.y}`)) return false;
    enemy.gameboard.receiveAttack(coord);
    this.#usedCoords.add(`${coord.x},${coord.y}`);
    return true;
  }

  aimedCoord() {
    return new Promise((resolve) => {
      function handler() {
        if (hovered.coordAi.x === null || hovered.coordAi.y === null) return;
        document.removeEventListener("click", handler);
        resolve(hovered.coordAi);
      }
      document.addEventListener("click", handler);
    });
  }
}
