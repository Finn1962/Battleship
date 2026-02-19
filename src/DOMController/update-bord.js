//interngameboard steht für die Interne Logig
//uiGameBoard steht für das Domgameboard

export function updateBoard(opponent) {
  const internalBoard = opponent.gameboard;
  const uiGameBoard =
    opponent.role === "player"
      ? document.getElementById("game_board_player")
      : document.getElementById("game_board_ai");

  for (const hit of internalBoard.reseivedHits) {
    const dot = document.createElement("div");
    if (hit.isShipHit) dot.classList.add("red-dot");
    dot.classList.add("white-dot");
    const uiField = uiGameBoard.querySelector(
      `[data-x="${hit.coord.x}"][data-y="${hit.coord.y}"]`,
    );
    uiField.replaceChildren();
    uiField.append(dot);
  }
  for (const ship of internalBoard.placedShips) {
    if (ship.alignment === "x") {
      for (let i = 0; i < ship.length; i++) {
        const uiField = uiGameBoard.querySelector(
          `[data-x="${ship.coord.x + i}"][data-y="${ship.coord.y}"]`,
        );
        if (ship.isSunk()) uiField.style.backgroundColor = "Silver";
        else if (opponent.role === "player")
          uiField.style.backgroundColor = "white";
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        const uiField = uiGameBoard.querySelector(
          `[data-x="${ship.coord.x}"][data-y="${ship.coord.y - i}"]`,
        );
        if (ship.isSunk()) uiField.style.backgroundColor = "Silver";
        else if (opponent.role === "player")
          uiField.style.backgroundColor = "white";
      }
    }
  }
}
