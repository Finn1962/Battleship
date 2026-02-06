import { Gameboard } from "../gameboard/gameboard";

export class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }
}
