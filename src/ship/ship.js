export class Ship {
  hits = 0;
  isShipSunk = false;

  constructor(length, position, alignment) {
    this.length = length;
    this.coord = position;
    this.alignment = alignment;
  }

  hit() {
    if (this.isShipSunk) return;
    else this.hits++;
    if (this.length === this.hits) this.isShipSunk = true;
  }

  isHit(hitCoord) {
    if (this.alignment === "x") {
      for (let i = 0; i < this.length; i++) {
        if (this.coord.x + i === hitCoord.x && this.coord.y === hitCoord.y) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        if (this.coord.y - i === hitCoord.y && this.coord.x === hitCoord.x) {
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
