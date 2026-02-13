import { Gameboard } from "../gameboard/gameboard";

export class Ai {
  gameboard = new Gameboard();
  #boardSize = { min: 0, max: 9 };
  usedCoords = new Set();
  #targetMemory = {
    hitCoords: [],
    usedOffsets: [],
    reachedEndOfShip: false,
    alignment: null,
  };
  #POSSIBLE_OFFSETS = Object.freeze([
    { x: 0, y: +1 },
    { x: +1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ]);
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
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    },
  ) {
    const coordString = `${coord.x},${coord.y}`;
    if (this.usedCoords.has(coordString)) return this.#randomShotAt(enemy);
    const result = enemy.gameboard.receiveAttack(coord);
    if (result.hit) {
      this.#targetMemory.hitCoords.push(coord);
      this.#currentState = this.#STATES.onePositionKnown;
    }
    this.usedCoords.add(coordString);
  }

  #findNextHit(enemy) {
    const randomIndex = Math.floor(
      Math.random() * this.#POSSIBLE_OFFSETS.length,
    );
    const offset = this.#POSSIBLE_OFFSETS[randomIndex];
    const offsetString = `${offset.x},${offset.y}`;
    if (this.#targetMemory.usedOffsets.includes(offsetString))
      return this.#findNextHit(enemy);
    this.#targetMemory.usedOffsets.push(offsetString);
    const lastHit = this.#targetMemory.hitCoords[0];
    const nextXCoord = lastHit.x + offset.x;
    const nextYCoord = lastHit.y + offset.y;
    if (!this.#coordIsValid({ x: nextXCoord, y: nextYCoord }))
      return this.#findNextHit(enemy);
    //Hier prüfen ob die Coordinaten an den Seiten schonmal getroffen wurden !!!!!!!
    const result = enemy.gameboard.receiveAttack({
      x: nextXCoord,
      y: nextYCoord,
    });
    if (result.shipIsSunk) {
      this.#resetState();
    }
    if (result.hit) {
      this.#currentState = this.#STATES.moreThanOnePositionKnown;
      this.#targetMemory.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
      const [firstCoord, secondCoord] = this.#targetMemory.hitCoords;
      if (firstCoord.x === secondCoord.x) this.#targetMemory.alignment = "y";
      else this.#targetMemory.alignment = "x";
    }
    const nextCoordString = `${nextXCoord},${nextYCoord}`;
    this.usedCoords.add(nextCoordString);
  }

  #findRemainingHits(enemy) {
    let furthestKnownHit = this.#targetMemory.hitCoords[0];
    let nextXCoord;
    let nextYCoord;
    if (this.#targetMemory.alignment === "x") {
      for (const hit of this.#targetMemory.hitCoords)
        if (furthestKnownHit.x < hit.x) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x + 1;
      nextYCoord = furthestKnownHit.y;
    } else {
      for (const hit of this.#targetMemory.hitCoords)
        if (furthestKnownHit.y > hit.y) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x;
      nextYCoord = furthestKnownHit.y - 1;
    }
    if (!this.#coordIsValid({ x: nextXCoord, y: nextYCoord })) {
      this.#currentState = this.#STATES.endOfShipReached;
      return;
    }
    const result = enemy.gameboard.receiveAttack({
      x: nextXCoord,
      y: nextYCoord,
    });
    if (result.shipIsSunk) {
      this.#resetState();
    } else if (result.hit) {
      this.#targetMemory.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
    } else {
      this.#currentState = this.#STATES.endOfShipReached;
    }
    const nextCoordString = `${nextXCoord},${nextYCoord}`;
    this.usedCoords.add(nextCoordString);
  }

  #findRemainingHitsAtOtherSide(enemy) {
    let furthestKnownHit = this.#targetMemory.hitCoords[0];
    let nextXCoord;
    let nextYCoord;
    if (this.#targetMemory.alignment === "x") {
      for (const hit of this.#targetMemory.hitCoords)
        if (furthestKnownHit.x > hit.x) furthestKnownHit = hit;
      nextXCoord = furthestKnownHit.x - 1;
      nextYCoord = furthestKnownHit.y;
    } else {
      for (const hit of this.#targetMemory.hitCoords)
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
      this.#targetMemory.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
    } else {
      this.#currentState = this.#STATES.endOfShipReached;
    }
    const nextCoordString = `${nextXCoord},${nextYCoord}`;
    this.usedCoords.add(nextCoordString);
  }

  #resetState() {
    this.#currentState = this.#STATES.noPositionKnown;
    this.#targetMemory.hitCoords = [];
    this.#targetMemory.usedOffsets = [];
    this.#targetMemory.alignment = null;
  }

  #coordIsValid(coord) {
    return (
      coord.x >= this.#boardSize.min &&
      coord.x <= this.#boardSize.max &&
      coord.y >= this.#boardSize.min &&
      coord.y <= this.#boardSize.max
    );
  }
}
