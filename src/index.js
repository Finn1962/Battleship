import { Gameboard } from "./gameboard/gameboard";

const gameboard = new Gameboard();

gameboard.placeShip({ length: 4, position: { x: 5, y: 5 }, alignment: "x" });
