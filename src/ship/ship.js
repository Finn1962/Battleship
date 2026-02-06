export class Ship {
  constructor(length, position, alignment) {
    this.hits = 0;
    this.isShipSunk = false;
    this.length = length;
    this.position = position;
    this.alignment = alignment;
  }

  hit() {
    if (this.isShipSunk) return;
    else this.hits++;
    if (this.length === this.hits) this.isShipSunk = true;
  }

  isHit(coordinate) {
    if (this.alignment === "x") {
      for (let i = 0; i < this.length; i++) {
        if (
          this.position.x + i === coordinate.x &&
          this.position.y === coordinate.y
        ) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        if (
          this.position.y - i === coordinate.y &&
          this.position.x === coordinate.x
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isSunk() {
    return this.isShipSunk;
  }
}
