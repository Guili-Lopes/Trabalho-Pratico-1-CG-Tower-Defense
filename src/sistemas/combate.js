import { criaProjetil } from "../entidades/projeteis.js";
import { PULSO } from "../config/atributos.js";

// Aplica dano a um inimigo e verifica sua morte
export function aplicaDanoAoInimigo(jogo, indice, dano) {
  const inimigo = jogo.inimigos[indice];

  inimigo.vida -= dano * (1 - inimigo.reducaoDano);

  // Ativa o flash de dano
  inimigo.tempoFlash = 0.08;

  // Verifica se o inimigo morreu
  if (inimigo.vida <= 0) {
    jogo.inimigos.splice(indice, 1);

    jogo.pontos += inimigo.pontos;
    jogo.moedas += inimigo.moedas;
  }
}

// Procura o inimigo mais próximo dentro do alcance do PIC
export function encontraAlvo(jogo) {
  let alvoMaisProximo = null;
  let menorDistanciaQuadrada = Infinity;

  const alcanceQuadrado = jogo.pic.alcance * jogo.pic.alcance;

  for (const inimigo of jogo.inimigos) {
    const dx = inimigo.x - jogo.pic.x;
    const dy = inimigo.y - jogo.pic.y;

    const distanciaQuadrada = dx * dx + dy * dy;

    if (
      distanciaQuadrada <= alcanceQuadrado &&
      distanciaQuadrada < menorDistanciaQuadrada
    ) {
      menorDistanciaQuadrada = distanciaQuadrada;
      alvoMaisProximo = inimigo;
    }
  }

  return alvoMaisProximo;
}

// Atualiza o disparo automático do PIC
export function atualizaDisparo(jogo, dt) {
  jogo.tempoTiro += dt;

  if (jogo.tempoTiro < jogo.intervaloTiro) {
    return;
  }

  const alvo = encontraAlvo(jogo);

  if (!alvo) {
    return;
  }

  const dx = alvo.x - jogo.pic.x;
  const dy = alvo.y - jogo.pic.y;

  const comprimento = Math.sqrt(dx * dx + dy * dy);

  const direcaoX = dx / comprimento;
  const direcaoY = dy / comprimento;

  jogo.projeteis.push(
    criaProjetil(
      jogo.pic.x,
      jogo.pic.y,
      direcaoX,
      direcaoY,
      jogo.pic.dano
    )
  );

  jogo.tempoTiro = 0;
}

// Verifica colisões entre projéteis e inimigos
export function verificaColisoes(jogo) {
  for (let i = jogo.projeteis.length - 1; i >= 0; i--) {
    const projetil = jogo.projeteis[i];

    // Remove o projétil quando seu tempo de vida termina
    if (projetil.tempoVivo >= PULSO.tempoDeVida) {
      jogo.projeteis.splice(i, 1);
      continue;
    }

    for (let j = jogo.inimigos.length - 1; j >= 0; j--) {
      const inimigo = jogo.inimigos[j];

      const dx = inimigo.x - projetil.x;
      const dy = inimigo.y - projetil.y;

      const somaRaios = inimigo.raio + projetil.raio;

      // Colisão círculo-círculo
      if (dx * dx + dy * dy <= somaRaios * somaRaios) {
        aplicaDanoAoInimigo(
          jogo,
          j,
          projetil.dano
        );

        // O projétil desaparece ao atingir o primeiro inimigo
        jogo.projeteis.splice(i, 1);

        break;
      }
    }
  }
}