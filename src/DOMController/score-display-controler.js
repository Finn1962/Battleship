const playerRemainingShips = document.getElementById("remaining_ships_player");
const playerSunkShips = document.getElementById("sunk_ships_player");
const aiRemainingShips = document.getElementById("remaining_ships_ai");
const aiSunkShips = document.getElementById("sunk_ships_ai");

export function updateScoreDisplay(oponent) {
  const remainingShips =
    oponent.role === "player" ? playerRemainingShips : aiRemainingShips;
  const sunkShips = oponent.role === "player" ? playerSunkShips : aiSunkShips;

  remainingShips.textContent = `REMAINING SHIPS : ${oponent.gameboard.remainingShips}`;
  sunkShips.textContent = `SUNK SHIPS : ${oponent.sunkShips}`;

  if (oponent.gameboard.remainingShips <= 1) {
    remainingShips.style.color = "red";
  }
}
