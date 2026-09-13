const vidaHUD = document.querySelector("#vida");
const pontosHUD = document.querySelector("#pontos");
const moedasHUD = document.querySelector("#moedas");

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
}