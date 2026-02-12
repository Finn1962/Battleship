import { Player } from "./player/player.js";
import { Ai } from "./ai/ai.js";

const ai = new Ai();
const player = new Player();
player.gameboard.placeShip({
  length: 4,
  position: { x: 3, y: 3 },
  alignment: "y",
});
ai.takeAShotAt(player, { x: 3, y: 2 });
ai.takeAShotAt(player);
ai.takeAShotAt(player);
ai.takeAShotAt(player);
ai.takeAShotAt(player);
ai.takeAShotAt(player);
ai.takeAShotAt(player);
ai.takeAShotAt(player);
