import { Ship } from "../ship/ship.js";

export class Gameboard {
  placedShips = [];
  reseivedHits = [];
  remainingShips = 0;

  placeShip(shipData) {
    const ship = new Ship(
      shipData.length,
      shipData.position,
      shipData.alignment,
    );
    this.remainingShips++;
    this.placedShips.push(ship);
  }

  receiveAttack(coordinate) {
    for (const ship of this.placedShips) {
      if (ship.isHit(coordinate)) {
        this.reseivedHits.push({ coord: coordinate, isShipHit: true });
        ship.hit();
        return { hit: true, shipIsSunk: ship.isSunk() };
      }
    }
    this.reseivedHits.push({ coord: coordinate, isShipHit: false });
    return { hit: false, shipIsSunk: false };
  }

  allShipsSunk() {
    return this.placedShips.every((ship) => ship.isSunk());
  }

  coordIsCollsionFree(shipData) {
    for (const ship of this.placedShips) {
      if (shipData.alignment === "x") {
        for (let i = 0; i < shipData.length; i++) {
          if (
            ship.isHit({ x: shipData.position.x + i, y: shipData.position.y })
          )
            return false;
        }
      } else {
        for (let i = 0; i < shipData.length; i++) {
          if (
            ship.isHit({ x: shipData.position.x, y: shipData.position.y - i })
          )
            return false;
        }
      }
    }
    return true;
  }

  coordinateIsValid(shipData) {
    if (shipData.alignment === "x")
      return shipData.position.x + (shipData.length - 1) <= 9;
    if (shipData.alignment === "y")
      return shipData.position.y - (shipData.length - 1) >= 0;
  }
}
