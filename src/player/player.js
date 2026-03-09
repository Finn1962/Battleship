import { hovered } from "../DOMController/hovered-field-tracker.js";

export class Player {
  name;
  usedCoords; //Hier wird bei Spielstart/Neustart ein neuer Set eingefügt von Index
  gameboard; //Hier wird bei Spielstart/Neustart ein neues Gameboard eingefügt von Index
  sunkShips; //Hier wird bei Spielstart/Neustart 0 eingefüt von Index
  role = "player";

  takeAShotAt(enemy, coord) {
    if (this.usedCoords.has(`${coord.x},${coord.y}`)) return false;
    const result = enemy.gameboard.receiveAttack(coord);
    if (result.shipIsSunk) this.sunkShips++;
    this.usedCoords.add(`${coord.x},${coord.y}`);
    return true;
  }

  aimedCoord() {
    return new Promise((resolve) => {
      document.addEventListener("click", handler);
      function handler() {
        if (hovered.coordAi.x === null || hovered.coordAi.y === null) return; //Bricht ab wenn keine Kordinate bei Ki-Spielfeld angehoverd wird
        document.removeEventListener("click", handler);
        resolve(hovered.coordAi);
      }
    });
  }
}
