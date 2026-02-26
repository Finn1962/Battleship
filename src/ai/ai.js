import { Gameboard } from "../gameboard/gameboard";

export class Ai {
  gameboard = new Gameboard();
  role = "ai";
  #usedCoords = new Set();
  #targetMemory = {
    hitCoords: [],
    usedOffsets: [],
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
        this.#randomShot(enemy, coords);
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

  #randomShot(
    enemy,
    coord = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    },
  ) {
    const coordString = `${coord.x},${coord.y}`;
    if (this.#usedCoords.has(coordString)) return this.#randomShot(enemy);
    this.#usedCoords.add(coordString);
    const result = enemy.gameboard.receiveAttack(coord);
    if (result.shipIsSunk) {
      this.#resetState();
    } else if (result.hit) {
      this.#targetMemory.hitCoords.push(coord);
      this.#currentState = this.#STATES.onePositionKnown;
      return;
    } else this.#currentState = this.#STATES.noPositionKnown;
  }

  #findNextHit(enemy) {
    const randomIndex = Math.floor(
      Math.random() * this.#POSSIBLE_OFFSETS.length,
    );
    const offset = this.#POSSIBLE_OFFSETS[randomIndex];
    const offsetString = `${offset.x},${offset.y}`;
    if (
      this.#targetMemory.usedOffsets.length === this.#POSSIBLE_OFFSETS.length
    ) {
      this.#resetState();
      return this.#randomShot(enemy);
    }
    if (this.#targetMemory.usedOffsets.includes(offsetString))
      return this.#findNextHit(enemy);
    this.#targetMemory.usedOffsets.push(offsetString);
    const lastHit = this.#targetMemory.hitCoords[0];
    const nextXCoord = lastHit.x + offset.x;
    const nextYCoord = lastHit.y + offset.y;
    const coordString = `${nextXCoord},${nextYCoord}`;
    if (
      !this.#coordIsValid({ x: nextXCoord, y: nextYCoord }) ||
      this.#usedCoords.has(coordString)
    )
      return this.#findNextHit(enemy);
    this.#usedCoords.add(coordString);
    const result = enemy.gameboard.receiveAttack({
      x: nextXCoord,
      y: nextYCoord,
    });
    if (result.shipIsSunk) {
      this.#resetState();
    } else if (result.hit) {
      this.#currentState = this.#STATES.moreThanOnePositionKnown;
      this.#targetMemory.hitCoords.push({
        x: nextXCoord,
        y: nextYCoord,
      });
      if (this.#targetMemory.hitCoords.length === 2) {
        const [firstCoord, secondCoord] = this.#targetMemory.hitCoords;
        if (firstCoord.x === secondCoord.x) this.#targetMemory.alignment = "y";
        else this.#targetMemory.alignment = "x";
      }
    } else {
      this.#currentState = this.#STATES.onePositionKnown;
    }
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
    const coordString = `${nextXCoord},${nextYCoord}`;
    if (
      !this.#coordIsValid({ x: nextXCoord, y: nextYCoord }) ||
      this.#usedCoords.has(coordString)
    ) {
      this.#currentState = this.#STATES.endOfShipReached;
      return this.#findRemainingHitsAtOtherSide(enemy);
    }
    this.#usedCoords.add(coordString);
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
    const coordString = `${nextXCoord},${nextYCoord}`;
    if (this.#usedCoords.has(coordString)) {
      this.#resetState();
      return this.#randomShot(enemy);
    }
    this.#usedCoords.add(coordString);

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
      this.#currentState = this.#STATES.noPositionKnown;
    }
  }

  #resetState() {
    this.#currentState = this.#STATES.noPositionKnown;
    this.#targetMemory.hitCoords = [];
    this.#targetMemory.usedOffsets = [];
    this.#targetMemory.alignment = null;
  }

  #coordIsValid(coord) {
    const boardSize = { min: 0, max: 9 };
    return (
      coord.x >= boardSize.min &&
      coord.x <= boardSize.max &&
      coord.y >= boardSize.min &&
      coord.y <= boardSize.max
    );
  }
}
