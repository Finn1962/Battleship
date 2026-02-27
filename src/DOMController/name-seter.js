const aiName = document.getElementById("ai_name");
const playerName = document.getElementById("player_name");
const winnerName = document.getElementById("winner_name");
const message = document.getElementById("message");

export class Names {
  static displayNames(player, ai) {
    playerName.textContent = player.name.toUpperCase();
    aiName.textContent = ai.name.toUpperCase();
  }

  static displayWinnerName(player, ai) {
    const winner = player.gameboard.allShipsSunk() ? ai : player;
    const nameOfWinner = winner === player ? player.name : ai.name;

    winnerName.textContent = `${nameOfWinner.toUpperCase()} DID WIN`;
    if (winner === player) {
      message.textContent = "WIN!";
      message.style.color = "Lightblue";
    } else {
      message.textContent = "LOSE!";
      message.style.color = "Red";
    }
  }
}
