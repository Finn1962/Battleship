const uiBoardPlayer = document.getElementById("game_board_player");
const uiBoardAi = document.getElementById("game_board_ai");

export function initBoradInDom() {
  initFields(uiBoardPlayer);
  initFields(uiBoardAi);
}

function initFields(spielfeld) {
  for (let y = 10; y > 0; y--) {
    for (let x = 0; x < 10; x++) {
      const playingField = document.createElement("div");
      playingField.classList.add("playing-fields");
      playingField.dataset.x = x;
      playingField.dataset.y = y - 1;
      spielfeld.append(playingField);
    }
  }
}
