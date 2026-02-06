import { Ship } from "./ship.js";

test("Hit Funktion", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});

test("isSunk Funktion", () => {
  const ship = new Ship(3);
  const shipTwo = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
  shipTwo.hit();
  expect(shipTwo.isSunk()).toBe(false);
});
