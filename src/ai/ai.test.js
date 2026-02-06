import { Ai } from "./ai.js";
import { Player } from "../player/player.js";
import { Gameboard } from "../gameboard/gameboard.js";

test("KI erstellen", () => {
  const ai = new Ai();
  expect(ai).toBeInstanceOf(Ai);
  expect(ai.gameboard).toBeInstanceOf(Gameboard);
});

test("Ki trifft", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 3,
    position: { x: 5, y: 5 },
    alignment: "x",
  });
  ai.takeAShot(player, { x: 5, y: 5 });
  expect(ai.foundShip.hits.length).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.attemptsToFindNext).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(2);
  ai.takeAShot(player);
  expect(player.gameboard.allShipsSunk()).toBe(true);
});

test("Ki trifft Test-2", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 4,
    position: { x: 5, y: 5 },
    alignment: "x",
  });
  ai.takeAShot(player, { x: 6, y: 5 });
  expect(ai.foundShip.hits.length).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.attemptsToFindNext).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(2);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(3);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(3);
  ai.takeAShot(player);
  expect(player.gameboard.allShipsSunk()).toBe(true);
});

test("Ki trifft Test-3", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 3,
    position: { x: 7, y: 0 },
    alignment: "x",
  });
  ai.takeAShot(player, { x: 8, y: 0 });
  expect(ai.foundShip.hits.length).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.attemptsToFindNext).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(2);
  ai.takeAShot(player);
  expect(player.gameboard.allShipsSunk()).toBe(true);
});

test("Ki trifft Test-4", () => {
  const ai = new Ai();
  const player = new Player();
  player.gameboard.placeShip({
    length: 4,
    position: { x: 0, y: 3 },
    alignment: "y",
  });
  ai.takeAShot(player, { x: 0, y: 0 });
  expect(ai.foundShip.hits.length).toBe(1);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(2);
  ai.takeAShot(player);
  expect(ai.foundShip.hits.length).toBe(3);
});
