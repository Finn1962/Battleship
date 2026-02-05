import { Ship } from "./ship.js";

test("Hit Funktion", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});

test("isSunk Funktion Test-1", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("isSunk Funktion Test-2", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
