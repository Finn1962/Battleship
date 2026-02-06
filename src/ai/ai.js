import { Gameboard } from "../gameboard/gameboard";

export class Ai {
  gameboard = new Gameboard();
  foundShip = false;
  firedShots = [];

  possibleNextHits = [
    { x: 0, y: +1 },
    { x: +1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];

  takeAShot(
    enemy,
    coord = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    },
  ) {
    if (!this.foundShip) {
      this.#randomAttack(enemy, coord);
    } else {
      if (this.foundShip.hits.length === 1) this.#findNextHit(enemy);
      else {
        this.#findRemainingHits(enemy);
      }
    }
  }

  #randomAttack(enemy, coord) {
    const nextX = coord.x;
    const nextY = coord.y;
    const result = enemy.gameboard.receiveAttack({ x: nextX, y: nextY });
    if (result.hit) {
      this.foundShip = {
        hits: [{ x: nextX, y: nextY }],
        attemptsToFindNext: 0,
        alignment: null,
        searchOppositeEnd: false,
      };
    }
    this.firedShots.push({ x: nextX, y: nextY });
  }

  #findNextHit(enemy) {
    if (this.foundShip.attemptsToFindNext >= 5)
      throw new Error("Max attempts reached");
    const current = this.foundShip.hits[0];
    const nextX =
      current.x + this.possibleNextHits[this.foundShip.attemptsToFindNext].x;
    const nextY =
      current.y + this.possibleNextHits[this.foundShip.attemptsToFindNext].y;
    const result = enemy.gameboard.receiveAttack({ x: nextX, y: nextY });
    if (result.shipIsSunk) {
      this.foundShip = false;
    } else if (result.hit) {
      this.foundShip.hits.push({
        x: nextX,
        y: nextY,
      });
    } else this.foundShip.attemptsToFindNext++;
    this.firedShots.push({ x: nextX, y: nextY });
  }

  #findRemainingHits(enemy) {
    const offsetX = this.foundShip.searchOppositeEnd ? -1 : 1;
    const offsetY = this.foundShip.searchOppositeEnd ? 1 : -1;
    const alignment =
      this.foundShip.hits[0].x === this.foundShip.hits[1].x ? "y" : "x";
    const current = this.foundShip.searchOppositeEnd
      ? this.foundShip.hits[0]
      : this.foundShip.hits[this.foundShip.hits.length - 1];
    const nextX = current.x + (alignment === "x" ? offsetX : 0);
    const nextY = current.y + (alignment === "y" ? offsetY : 0);
    const result = enemy.gameboard.receiveAttack({ x: nextX, y: nextY });
    if (result.shipIsSunk) {
      this.foundShip = false;
    } else if (result.hit) {
      this.foundShip.hits.push({ x: nextX, y: nextY });
    } else this.foundShip.searchOppositeEnd = true;
    this.firedShots.push({ x: nextX, y: nextY });
  }
}
