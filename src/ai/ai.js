import { Gameboard } from "../gameboard/gameboard";

export class Ai {
  gameboard = new Gameboard();
  usedCoords = [];
  #foundShip = {
    hitCoords: [],
    usedOffsets: [],
    reachedEndOfShip: false,
    alignment: null,
  };
  #STATES = Object.freeze({
    noPositionKnown: Symbol("noPositionKnown"),
    onePositionKnown: Symbol("onePositionKnown"),
    moreThanOnePositionKnown: Symbol("moreThanOnePositionKnown"),
    endOfShipReached: Symbol("endOfShipReached"),
  });
  #currentState = this.#STATES.noPositionKnown;

  takeAShotAt(enemy, coords) {
    switch (this.#currentState) {
      case this.#STATES.noPositionKnown:
        this.#randomShotAt(enemy, coords);
        break;
      case this.#STATES.onePositionKnown:
        this.#findNextHit(enemy);
        break;
      case this.#STATES.moreThanOnePositionKnown:
        this.#findRemainingHits(enemy);
        break;
      case this.#STATES.endOfShipReached:
        this.#findRemainingHitsAtOtherSide(enemy);
        break;
    }
  }

  #randomShotAt(
    enemy,
    coord = {
      x: Math.floor(Math.random() * 9),
      y: Math.floor(Math.random() * 9),
    },
  ) {
    const coordString = `${coord.x},${coord.y}`;
    if (this.usedCoords.includes(coordString)) return this.#randomShotAt(enemy);
    const result = enemy.gameboard.receiveAttack(coord);
    if (result.hit) {
      this.#foundShip.hitCoords.push(coord);
      this.#currentState = this.#STATES.onePositionKnown;
    }
    this.usedCoords.push(coordString);
  }

  #findNextHit(enemy) {
    const possibleOffsets = [
      { x: 0, y: +1 },
      { x: +1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ];
    const randomIndex = Math.floor(Math.random() * possibleOffsets.length);
    const offset = possibleOffsets[randomIndex];
    const offsetString = `${offset.x},${offset.y}`;
    if (this.#foundShip.usedOffsets.includes(offsetString))
      return this.#findNextHit(enemy);
    this.#foundShip.usedOffsets.push(offsetString);
    const lastHit = this.#foundShip.hitCoords[0];
    const nextXCoord = lastHit.x + offset.x;
    const nextYCoord = lastHit.y + offset.y;
    if (!this.#coordIsValid({ x: nextXCoord, y: nextYCoord }))
      return this.#findNextHit(enemy);
    const result = enemy.gameboard.receiveAttack({
      x: nextXCoord,
      y: nextYCoord,
    });
    if (result.shipIsSunk) {
      this.#resetState();
    }
    if (result.hit) {
      this.#currentState = this.#STATES.moreThanOnePositionKnown;
      this.#foundShip.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
      const [firstCoord, secondCoord] = this.#foundShip.hitCoords;
      if (firstCoord.x === secondCoord.x) this.#foundShip.alignment = "y";
      else this.#foundShip.alignment = "x";
    }
    const nextCoordString = `${nextXCoord},${nextYCoord}`;
    this.usedCoords.push(nextCoordString);
  }

  #findRemainingHits(enemy) {
    let furthestKnownHit = this.#foundShip.hitCoords[0];
    let nextXCoord;
    let nextYCoord;
    if (this.#foundShip.alignment === "x") {
      for (const hit of this.#foundShip.hitCoords)
        if (furthestKnownHit.x < hit.x) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x + 1;
      nextYCoord = furthestKnownHit.y;
    } else {
      for (const hit of this.#foundShip.hitCoords)
        if (furthestKnownHit.y > hit.y) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x;
      nextYCoord = furthestKnownHit.y - 1;
    }
    if (!this.#coordIsValid({ x: nextXCoord, y: nextYCoord })) {
      this.#currentState = this.#STATES.endOfShipReached;
      const nextCoordString = `${nextXCoord},${nextYCoord}`;
      this.usedCoords.push(nextCoordString);
      return;
    }
    const result = enemy.gameboard.receiveAttack({
      x: nextXCoord,
      y: nextYCoord,
    });
    if (result.shipIsSunk) {
      this.#resetState();
    } else if (result.hit) {
      this.#foundShip.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
    } else {
      this.#currentState = this.#STATES.endOfShipReached;
    }
    const nextCoordString = `${nextXCoord},${nextYCoord}`;
    this.usedCoords.push(nextCoordString);
  }

  #findRemainingHitsAtOtherSide(enemy) {
    let furthestKnownHit = this.#foundShip.hitCoords[0];
    let nextXCoord;
    let nextYCoord;
    if (this.#foundShip.alignment === "x") {
      for (const hit of this.#foundShip.hitCoords)
        if (furthestKnownHit.x > hit.x) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x - 1;
      nextYCoord = furthestKnownHit.y;
    } else {
      for (const hit of this.#foundShip.hitCoords)
        if (furthestKnownHit.y < hit.y) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x;
      nextYCoord = furthestKnownHit.y + 1;
    }
    const result = enemy.gameboard.receiveAttack({
      x: nextXCoord,
      y: nextYCoord,
    });
    if (result.shipIsSunk) {
      this.#resetState();
    } else if (result.hit) {
      this.#foundShip.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
    } else {
      this.#currentState = this.#STATES.endOfShipReached;
    }
    const nextCoordString = `${nextXCoord},${nextYCoord}`;
    this.usedCoords.push(nextCoordString);
  }

  #resetState() {
    this.#currentState = this.#STATES.noPositionKnown;
    this.#foundShip.hitCoords = [];
    this.#foundShip.usedOffsets = [];
    this.#foundShip.alignment = null;
  }

  #coordIsValid(coord) {
    return coord.x >= 0 && coord.x <= 9 && coord.y >= 0 && coord.y <= 9;
  }
}
