import { MUNDO, FERRO } from "../config/atributos.js";
import { aplicaDanoAoInimigo } from "./combate.js";

function converteParaMundo(canvas, evento) {
  const rect = canvas.getBoundingClientRect();

  const px = evento.clientX - rect.left;
  const py = evento.clientY - rect.top;

  const xNormalizado = (px / rect.width) * 2 - 1;
  const yNormalizado = 1 - (py / rect.height) * 2;

  const larguraMundo = MUNDO.direita - MUNDO.esquerda;
  const alturaMundo = MUNDO.cima - MUNDO.baixo;

  const x = xNormalizado * (larguraMundo / 2);
  const y = yNormalizado * (alturaMundo / 2);

  return {
    x: x,
    y: y
  };
}

export function registraEntrada(canvas, jogo) {
  canvas.style.cursor = "none";

  canvas.addEventListener("mousemove", (evento) => {
    const posicao = converteParaMundo(canvas, evento);

    jogo.mouse.x = posicao.x;
    jogo.mouse.y = posicao.y;
  });

  canvas.addEventListener("click", (evento) => {
    // Verifica se o ferro está recarregado
    if (jogo.tempoFerro < FERRO.recarga) {
      return;
    }

    const posicao = converteParaMundo(canvas, evento);

    // Procura o inimigo visualmente mais próximo da frente
    for (let i = jogo.inimigos.length - 1; i >= 0; i--) {
      const inimigo = jogo.inimigos[i];

      const dx = inimigo.x - posicao.x;
      const dy = inimigo.y - posicao.y;

      // Colisão ponto-círculo
      if (dx * dx + dy * dy <= inimigo.raio * inimigo.raio) {
        aplicaDanoAoInimigo(
          jogo,
          i,
          FERRO.dano
        );

        jogo.tempoFerro = 0;

        break;
      }
    }
  });
}

export function atualizaEntrada(jogo, dt) {
  if (jogo.tempoFerro < FERRO.recarga) {
    jogo.tempoFerro += dt;
  }
}