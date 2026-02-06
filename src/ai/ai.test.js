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
    position: { x: 0, y: 0 },
    alignment: "x",
  });
  ai.makeMove(player, { x: 0, y: 0 });
  expect(ai.shipFound).toBe(true);
});
