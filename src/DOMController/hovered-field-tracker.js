export const hovered = {
  coordPlayer: { x: null, y: null },
  coordAi: { x: null, y: null },
};

export function initHoverTracker() {
  const playerBoard = document.getElementById("game_board_player");
  const aiBoard = document.getElementById("game_board_ai");

  playerBoard.addEventListener("mouseover", (event) => {
    const uiField = event.target.closest("[data-x][data-y]");
    if (!uiField) return;
    const xCoord = Number(uiField.getAttribute("data-x"));
    const yCoord = Number(uiField.getAttribute("data-y"));
    hovered.coordPlayer = { x: xCoord, y: yCoord };
  });

  playerBoard.addEventListener("mouseleave", () => {
    hovered.uiFieldPlayer = null;
    hovered.coordPlayer = { x: null, y: null };
  });

  aiBoard.addEventListener("mouseover", (event) => {
    const uiField = event.target.closest("[data-x][data-y]");
    if (!uiField) return;
    const xCoord = Number(uiField.getAttribute("data-x"));
    const yCoord = Number(uiField.getAttribute("data-y"));
    hovered.coordAi = { x: xCoord, y: yCoord };
  });

  aiBoard.addEventListener("mouseleave", () => {
    hovered.coordAi = { x: null, y: null };
  });
}
