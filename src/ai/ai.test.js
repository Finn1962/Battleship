import { Ai } from "./ai.js";
import { Player } from "../player/player.js";
import { Gameboard } from "../gameboard/gameboard.js";

test("KI erstellen", () => {
  const ai = new Ai();
  expect(ai).toBeInstanceOf(Ai);
  expect(ai.gameboard).toBeInstanceOf(Gameboard);
});

test("Ki hat verloren", () => {
  const ai = new Ai();
  expect(ai.gameboard.allShipsSunk()).toBe(true);
  ai.gameboard.placeShip({
    length: 6,
    position: { x: 3, y: 5 },
    alignment: "x",
  });
  expect(ai.gameboard.allShipsSunk()).toBe(false);
});

test("Ki trifft Test-1", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 6,
    position: { x: 3, y: 5 },
    alignment: "x",
  });
  ai.takeAShotAt(player, { x: 6, y: 5 });
  for (let i = 0; i < 9; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-2", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 4,
    position: { x: 6, y: 2 },
    alignment: "x",
  });
  ai.takeAShotAt(player, { x: 7, y: 2 });
  for (let i = 0; i < 7; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-3", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 3,
    position: { x: 7, y: 0 },
    alignment: "x",
  });
  ai.takeAShotAt(player, { x: 9, y: 0 });
  for (let i = 0; i < 5; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-4", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 4,
    position: { x: 6, y: 9 },
    alignment: "x",
  });
  ai.takeAShotAt(player, { x: 8, y: 9 });
  for (let i = 0; i < 6; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-5", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 4,
    position: { x: 3, y: 3 },
    alignment: "y",
  });
  ai.takeAShotAt(player, { x: 3, y: 2 });
  for (let i = 0; i < 7; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-6", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 6,
    position: { x: 0, y: 5 },
    alignment: "y",
  });
  ai.takeAShotAt(player, { x: 0, y: 3 });
  for (let i = 0; i < 7; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-7", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 3,
    position: { x: 4, y: 5 },
    alignment: "y",
  });
  ai.takeAShotAt(player, { x: 4, y: 4 });
  for (let i = 0; i < 7; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});

test("Ki trifft Test-8", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 4,
    position: { x: 6, y: 1 },
    alignment: "x",
  });
  ai.takeAShotAt(player, { x: 9, y: 1 });
  for (let i = 0; i < 6; i++) ai.takeAShotAt(player);
  expect(player.gameboard.placedShips[0].isSunk()).toBe(true);
});
