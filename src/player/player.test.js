import { Player } from "./player";
import { Gameboard } from "../gameboard/gameboard.js";

test("Spieler erstellen", () => {
  const player = new Player();
  expect(player).toBeInstanceOf(Player);
  expect(player.gameboard).toBeInstanceOf(Gameboard);
});

test("Spieler hat verloren", () => {
  const player = new Player("Spieler 1");
  expect(player.gameboard.allShipsSunk()).toBe(true);
  player.gameboard.placeShip({
    length: 6,
    position: { x: 3, y: 5 },
    alignment: "x",
  });
  expect(player.gameboard.allShipsSunk()).toBe(false);
});
