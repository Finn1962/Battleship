import { Player } from "./player";
import { Gameboard } from "../gameboard/gameboard.js";

test("Spieler erstellen", () => {
  const player = new Player("Spieler 1");
  expect(player.name).toBe("Spieler 1");
  expect(player.gameboard).toBeInstanceOf(Gameboard);
});
