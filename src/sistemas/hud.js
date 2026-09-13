const vidaHUD = document.querySelector("#vida");
const pontosHUD = document.querySelector("#pontos");
const moedasHUD = document.querySelector("#moedas");

const gameoverHUD = document.querySelector("#gameover");
const pontosFinaisHUD = document.querySelector("#pontos-finais");

function atualizaGameOver(jogo) {
  if (!gameoverHUD) {
    return;
  }

  if (jogo.acabou) {
    gameoverHUD.classList.remove("oculto");

    if (pontosFinaisHUD) {
      pontosFinaisHUD.textContent = jogo.pontos;
    }
  } else {
    gameoverHUD.classList.add("oculto");
  }
}

// Atualiza as informações mostradas no HUD
export function atualizaHUD(jogo) {
  if (vidaHUD) {
    vidaHUD.textContent = jogo.pic.vida;
  }

  if (pontosHUD) {
    pontosHUD.textContent = jogo.pontos;
  }

  if (moedasHUD) {
    moedasHUD.textContent = jogo.moedas;
  }

  atualizaGameOver(jogo);
}