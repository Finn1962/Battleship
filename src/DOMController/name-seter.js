const aiName = document.getElementById("ai_name");
const playerName = document.getElementById("player_name");
const winnerName = document.getElementById("winner_name");
const message = document.getElementById("message");

export class UiNames {
  //Zeigt namen während des Spielt
  static showNames(player, ai) {
    playerName.textContent = player.name.toUpperCase();
    aiName.textContent = ai.name.toUpperCase();
  }

  //Zeigt name von Gewinner
  static showWinnerName(player, ai) {
    const winner = player.gameboard.allShipsSunk() ? ai : player;
    const nameOfWinner = winner === player ? player.name : ai.name;

    winnerName.textContent = `${nameOfWinner.toUpperCase()} WINS`;
    if (winner === player) {
      message.textContent = "WIN!";
      message.style.color = "#00d0ffff";
    } else {
      message.textContent = "LOSE!";
      message.style.color = "Red";
    }
  }
}
