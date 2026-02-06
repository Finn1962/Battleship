import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";

const ai = new Ai();
const player = new Player();
player.gameboard.placeShip({
  length: 4,
  position: { x: 1, y: 6 },
  alignment: "y",
});
ai.takeAShot(player, { x: 1, y: 4 });
console.log(ai.foundShip);
