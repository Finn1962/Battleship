const playerBoard = document.getElementById("game_board_player");
const aiBoard = document.getElementById("game_board_ai");
export let hoveredFieldPlayer;
export let hoveredFieldAi;

playerBoard.addEventListener("mouseover", function (event) {
  hoveredFieldPlayer = document.elementFromPoint(event.clientX, event.clientY);
});

aiBoard.addEventListener("mouseover", function (event) {
  hoveredFieldAi = document.elementFromPoint(event.clientX, event.clientY);
});
