import { Ship } from "../ship/ship.js";

export class Gameboard {
  placedShips = [];
  reseivedHits = [];
  remainingShips = 0;

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
    this.reseivedHits.push(coordinate);
    for (const ship of this.placedShips) {
      if (ship.isHit(coordinate)) {
        ship.hit();
        return { hit: true, shipIsSunk: ship.isSunk() };
      }
    }
    return { hit: false, shipIsSunk: false };
  }

  allShipsSunk() {
    return this.placedShips.every((ship) => ship.isSunk());
  }

  #coordinateIsValid(shipData) {
    if (shipData.alignment === "x")
      return shipData.position.x + (shipData.length - 1) <= 9;
    if (shipData.alignment === "y")
      return shipData.position.y - (shipData.length - 1) >= 0;
  }
}
