const uiGameBoardPlayer = document.getElementById("game_board_player");
const uiGameBoardAi = document.getElementById("game_board_ai");

export function updateBoard(internalField) {
  for (const ship of internalField.placedShips) {
    if (ship.alignment === "x") {
      for (let i = 0; i < ship.length; i++) {
        const uiField = uiGameBoardPlayer.querySelector(
          `[data-x="${ship.position.x + i}"][data-y="${ship.position.y}"]`,
        );
        if (ship.isSunk()) uiField.style.backgroundColor = "Silver";
        else uiField.style.backgroundColor = "white";
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        const uiField = uiGameBoardPlayer.querySelector(
          `[data-x="${ship.position.x}"][data-y="${ship.position.y - i}"]`,
        );
        if (ship.isSunk()) uiField.style.backgroundColor = "Silver";
        else uiField.style.backgroundColor = "white";
      }
    }
  }

  for (const hit of internalField.reseivedHits) {
    const dot = document.createElement("div");
    dot.classList.add("red-dot");
    const uiField = uiGameBoardPlayer.querySelector(
      `[data-x="${hit.x}"][data-y="${hit.y}"]`,
    );
    uiField.replaceChildren();
    uiField.append(dot);
  }
}
