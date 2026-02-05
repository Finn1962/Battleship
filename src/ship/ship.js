export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.isShipSunk = false;
  }

  hit() {
    if (this.isShipSunk) return;
    else this.hits++;
    if (this.length === this.hits) this.isShipSunk = true;
  }

  isSunk() {
    return this.isShipSunk;
  }
}
