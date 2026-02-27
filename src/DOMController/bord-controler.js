import { hovered } from "./hovered-field-tracker.js";

export class Board {
  static #mouseOverData = {
    coloringActive: false,
    shipLength: null,
    alignment: null,
  };
  internalPlayer = null; //Wird später in Index zugewiesen sobald erstellt

  static colorHoveredFields(shipLength, alignment) {
    this.#mouseOverData.coloringActive = true;
    this.#mouseOverData.shipLength = shipLength;
    this.#mouseOverData.alignment = alignment;
  }

  static stopColorFields() {
    this.#mouseOverData.coloringActive = false;
  }

  static initMouseOverHandler() {
    const uiBoardPlayer = document.getElementById("game_board_player");
    uiBoardPlayer.addEventListener("mouseover", () =>
      this.#mouseOverHandler(uiBoardPlayer, "white"),
    );
    uiBoardPlayer.addEventListener("mouseout", () =>
      this.#mouseOverHandler(uiBoardPlayer, "transparent"),
    );
  }

  static #mouseOverHandler = (uiBoardPlayer, color) => {
    if (!this.#mouseOverData.coloringActive) return;
    const { x: xCoord, y: yCoord } = hovered.coordPlayer;
    if (!this.#hoveredCoordIsValid({ x: xCoord, y: yCoord })) return;
    const shipLength = this.#mouseOverData.shipLength;
    const alignment = this.#mouseOverData.alignment;

    if (alignment === "x") {
      for (let i = 0; i < shipLength; i++) {
        const uiField = uiBoardPlayer.querySelector(
          `[data-x="${xCoord + i}"][data-y="${yCoord}"]`,
        );
        if (uiField) uiField.style.backgroundColor = color;
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        const uiField = uiBoardPlayer.querySelector(
          `[data-x="${hovered.coordPlayer.x}"][data-y="${hovered.coordPlayer.y - i}"]`,
        );
        if (uiField) uiField.style.backgroundColor = color;
      }
    }
  };

  static #hoveredCoordIsValid() {
    let isWithInGameboard = true;
    let noShipCollisions = true;
    const shipCoordsToValidate = [];
    const { alignment, shipLength } = this.#mouseOverData;

    for (let i = 0; i < shipLength; i++) {
      let xOffset = alignment === "x" ? i : 0;
      let yOffset = alignment === "y" ? -i : 0;
      shipCoordsToValidate.push({
        x: hovered.coordPlayer.x + xOffset,
        y: hovered.coordPlayer.y + yOffset,
      });
    }

    const lastIndex = shipCoordsToValidate.length - 1;
    const firstCoord = shipCoordsToValidate[0];
    const lastCoord = shipCoordsToValidate[lastIndex];
    const boardSize = { min: 0, max: 9 };
    if (
      firstCoord.x < boardSize.min ||
      lastCoord.y < boardSize.min ||
      lastCoord.x > boardSize.max ||
      firstCoord.y > boardSize.max
    )
      isWithInGameboard = false;

    const internalBoard = this.internalPlayer.gameboard;
    for (const ship of internalBoard.placedShips) {
      for (const coord of shipCoordsToValidate) {
        if (ship.isHit({ x: coord.x, y: coord.y })) {
          noShipCollisions = false;
        }
      }
    }
    return isWithInGameboard && noShipCollisions;
  }

  static updateBoard(opponent) {
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
}
