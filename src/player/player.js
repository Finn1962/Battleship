import { Gameboard } from "../gameboard/gameboard";

export class Player {
  usedCoords = new Set();
  gameboard = new Gameboard();

  constructor(name) {
    this.name = name;
  }

  takeAShotAt(enemy, coordinates) {
    enemy.gameboard.receiveAttack(coordinates);
  }
}
