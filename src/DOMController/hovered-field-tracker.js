export const hovered = {
  fieldPlayer: null,
  coordPlayer: { x: null, y: null },
  fieldAi: null,
  coordAi: { x: null, y: null },
};

export function initHoverTracker() {
  const playerBoard = document.getElementById("game_board_player");
  const aiBoard = document.getElementById("game_board_ai");

  playerBoard.addEventListener("mouseover", (event) => {
    hovered.fieldPlayer = event.target;
    const xCoord = Number(hovered.fieldPlayer.getAttribute("data-x"));
    const yCoord = Number(hovered.fieldPlayer.getAttribute("data-y"));
    hovered.coordPlayer = { x: xCoord, y: yCoord };
  });

  playerBoard.addEventListener("mouseleave", () => {
    hovered.fieldPlayer = null;
    hovered.coordPlayer = { x: null, y: null };
  });

  aiBoard.addEventListener("mouseover", (event) => {
    hovered.fieldAi = event.target;
    const xCoord = Number(hovered.fieldAi.getAttribute("data-x"));
    const yCoord = Number(hovered.fieldAi.getAttribute("data-y"));
    hovered.coordAi = { x: xCoord, y: yCoord };
  });

  aiBoard.addEventListener("mouseleave", () => {
    hovered.fieldAi = null;
    hovered.coordAi = { x: null, y: null };
  });
}
