import { Gameboard } from "../gameboard/gameboard";
import { hovered } from "../DOMController/hovered-field-tracker.js";

export class Player {
  name;
  #usedCoords = new Set();
  gameboard = new Gameboard();
  sunkShips = 0;
  role = "player";

  takeAShotAt(enemy, coord) {
    if (this.#usedCoords.has(`${coord.x},${coord.y}`)) return false;
    const result = enemy.gameboard.receiveAttack(coord);
    if (result.shipIsSunk) this.sunkShips++;
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
