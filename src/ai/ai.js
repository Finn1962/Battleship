import { Gameboard } from "../gameboard/gameboard";

export class Ai {
  gameboard = new Gameboard();
  shipFound = false;
  coordsLastHit = null;

  makeMove(
    enemy,
    coord = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    },
  ) {
    console.log(coord);
    const enemyGameboard = enemy.gameboard;
    if (!this.shipFound) {
      const x = coord.x;
      const y = coord.y;
      const result = enemyGameboard.receiveAttack({ x, y });
      console.log(result);
      if (result.hit) {
        this.shipFound = true;
        this.coordsLastHit = { x, y };
      }
    } else {
    }
  }
}
