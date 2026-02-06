import { Ship } from "../ship/ship.js";

export class Gameboard {
  placedShips = [];
  hitCoordinates = [];

  placeShip(shipData) {
    if (!this.#coordinateIsValid(shipData)) return;
    const ship = new Ship(
      shipData.length,
      shipData.position,
      shipData.alignment,
    );
    this.remainingShips++;
    this.placedShips.push(ship);
  }

  receiveAttack(coordinate) {
    if (this.hitCoordinates.includes(this.#toString(coordinate)))
      return "already hit";
    for (const ship of this.placedShips) {
      if (ship.isHit(coordinate)) {
        ship.hit();
        this.hitCoordinates.push(this.#toString(coordinate));
        return { hit: true, shipIsSunk: ship.isSunk() };
      }
    }
    return { hit: false, shipIsSunk: false };
  }

  allShipsSunk() {
    return this.placedShips.every((ship) => ship.isSunk());
  }

  #toString(coordinate) {
    return `${coordinate.x},${coordinate.y}`;
  }

  #coordinateIsValid(shipData) {
    if (shipData.alignment === "x")
      return shipData.position.x + (shipData.length - 1) <= 9;
    if (shipData.alignment === "y")
      return shipData.position.y - (shipData.length - 1) >= 0;
  }
}
