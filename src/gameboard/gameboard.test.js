import { Gameboard } from "./gameboard.js";
import { Ship } from "../ship/ship.js";

test("Schiffe auf Spielfeld platzieren", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ length: 4, position: { x: 5, y: 5 }, alignment: "x" });
  expect(gameboard.placedShips).toHaveLength(1);
  expect(gameboard.placedShips[0]).toBeInstanceOf(Ship);
  expect(gameboard.placedShips[0].length).toBe(4);
  expect(gameboard.placedShips[0].position).toEqual({ x: 5, y: 5 });
  expect(gameboard.placedShips[0].alignment).toBe("x");
});

test("Spielfeldbegrenzung", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ length: 2, position: { x: 9, y: 9 }, alignment: "x" });
  gameboard.placeShip({ length: 2, position: { x: 8, y: 8 }, alignment: "x" });
  gameboard.placeShip({ length: 3, position: { x: 7, y: 8 }, alignment: "x" });
  gameboard.placeShip({ length: 2, position: { x: 7, y: 1 }, alignment: "y" });
  gameboard.placeShip({ length: 2, position: { x: 0, y: 0 }, alignment: "y" });
  gameboard.placeShip({ length: 5, position: { x: 5, y: 5 }, alignment: "y" });
  expect(gameboard.placedShips).toHaveLength(4);
});

test("Schiff wird getroffen", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ length: 4, position: { x: 6, y: 5 }, alignment: "x" });
  gameboard.placeShip({ length: 4, position: { x: 5, y: 5 }, alignment: "y" });
  expect(gameboard.receiveAttack({ x: 5, y: 5 })).toEqual({
    hit: true,
    shipIsSunk: false,
  });
  gameboard.receiveAttack({ x: 5, y: 5 });
  expect(gameboard.placedShips[0].isSunk()).toBe(false);
  gameboard.receiveAttack({ x: 6, y: 5 });
  gameboard.receiveAttack({ x: 5, y: 6 });
  gameboard.receiveAttack({ x: 5, y: 7 });
  gameboard.receiveAttack({ x: 5, y: 7 });
  expect(gameboard.placedShips[1].isSunk()).toBe(false);
});

test("Schiff wird versenkt", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ length: 4, position: { x: 5, y: 5 }, alignment: "x" });
  gameboard.receiveAttack({ x: 5, y: 5 });
  gameboard.receiveAttack({ x: 6, y: 5 });
  expect(gameboard.receiveAttack({ x: 7, y: 5 })).toEqual({
    hit: true,
    shipIsSunk: false,
  });
  expect(gameboard.receiveAttack({ x: 8, y: 5 })).toEqual({
    hit: true,
    shipIsSunk: true,
  });
  expect(gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Alle Schiffe versenkt", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ length: 3, position: { x: 0, y: 0 }, alignment: "x" });
  gameboard.placeShip({ length: 2, position: { x: 5, y: 5 }, alignment: "y" });
  gameboard.receiveAttack({ x: 0, y: 0 });
  gameboard.receiveAttack({ x: 1, y: 0 });
  gameboard.receiveAttack({ x: 2, y: 0 });
  expect(gameboard.allShipsSunk()).toBe(false);
  gameboard.receiveAttack({ x: 5, y: 5 });
  gameboard.receiveAttack({ x: 5, y: 4 });
  expect(gameboard.allShipsSunk()).toBe(true);
});
