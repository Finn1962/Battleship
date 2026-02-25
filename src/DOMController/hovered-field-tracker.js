export const hovered = {
  uiFieldPlayer: null,
  coordPlayer: { x: null, y: null },
  uiFieldAi: null,
  coordAi: { x: null, y: null },
};

export function initHoverTracker() {
  const playerBoard = document.getElementById("game_board_player");
  const aiBoard = document.getElementById("game_board_ai");

  playerBoard.addEventListener("mouseover", (event) => {
    const uiField = event.target.closest("[data-x][data-y]");
    if (!uiField) return;
    hovered.uiFieldPlayer = uiField;
    const xCoord = Number(uiField.getAttribute("data-x"));
    const yCoord = Number(uiField.getAttribute("data-y"));
    hovered.coordPlayer = { x: xCoord, y: yCoord };
  });

  /*playerBoard.addEventListener("mouseleave", () => {
    hovered.uiFieldPlayer = null;
    hovered.coordPlayer = { x: null, y: null };
  });*/

  aiBoard.addEventListener("mouseover", (event) => {
    const uiField = event.target.closest("[data-x][data-y]");
    if (!uiField) return;
    hovered.uiFieldAi = uiField;
    const xCoord = Number(uiField.getAttribute("data-x"));
    const yCoord = Number(uiField.getAttribute("data-y"));
    hovered.coordAi = { x: xCoord, y: yCoord };
  });

  /*aiBoard.addEventListener("mouseleave", () => {
    hovered.uiFieldAi = null;
    hovered.coordAi = { x: null, y: null };
  });*/
}
