import { criaProjetil } from "../entidades/projeteis.js";

import { PULSO, EFEITOS } from "../config/atributos.js";

import { criaEfeitoDescarga } from "./efeitos.js";

// Aplica dano a um inimigo e verifica sua morte
export function aplicaDanoAoInimigo(jogo, indice, dano) {
  const inimigo = jogo.inimigos[indice];

  inimigo.vida -= dano * (1 - inimigo.reducaoDano);

  // Ativa o flash de dano
  inimigo.tempoFlash = 0.15;

  // Acúmulo da avalanche
  if (inimigo.limiteAvalanche && !inimigo.emAvalanche) {
    inimigo.danoAcumulado += dano;

    if (inimigo.danoAcumulado >= inimigo.limiteAvalanche) {
      inimigo.emAvalanche = true;
      inimigo.tempoAvalanche = inimigo.duracaoAvalanche;
      inimigo.danoAcumulado = 0;
      inimigo.textura = "transistorAvalanche";
    }
  }

  // Verifica se o inimigo morreu
  if (inimigo.vida <= 0) {
    // Verifica se o inimigo possui descarga ao morrer
    if (inimigo.descargaRaio) {

      jogo.efeitos.push(
        criaEfeitoDescarga(
          inimigo.x,
          inimigo.y,
          inimigo.descargaRaio
        ));

      const dx = jogo.pic.x - inimigo.x;
      const dy = jogo.pic.y - inimigo.y;

      const distanciaQuadrada = dx * dx + dy * dy;
      const raioQuadrado = inimigo.descargaRaio * inimigo.descargaRaio;

      // Aplica a descarga no PIC se estiver dentro do raio
      if (distanciaQuadrada <= raioQuadrado) {
        jogo.pic.vida -= inimigo.descargaDano;
        jogo.pic.tempoFlash = 0.15;
      }
    }

    jogo.inimigos.splice(indice, 1);

    jogo.pontos += inimigo.pontos;
    jogo.moedas += inimigo.moedas;
  }
}

function disparaDescargaDoPIC(jogo) {
  const raio = EFEITOS.capacitorDescargaRaio;

  const bonusDano = 1 + EFEITOS.capacitorDano * jogo.melhorias.capacitor;

  const dano = EFEITOS.capacitorDescargaDano * bonusDano;

  // Cria o efeito visual da descarga
  jogo.efeitos.push(
    criaEfeitoDescarga(
      jogo.pic.x,
      jogo.pic.y,
      raio
    )
  );

  // Aplica dano nos inimigos dentro da descarga
  for (let i = jogo.inimigos.length - 1; i >= 0; i--) {
    const inimigo = jogo.inimigos[i];

    const dx = inimigo.x - jogo.pic.x;
    const dy = inimigo.y - jogo.pic.y;

    const distanciaQuadrada = dx * dx + dy * dy;
    const raioQuadrado = raio * raio;

    if (distanciaQuadrada <= raioQuadrado) {
      aplicaDanoAoInimigo(jogo, i, dano);
    }
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
      jogo.pic.velocidadePulso,
      jogo.pic.dano
    )
  );

  // Conta os disparos para a descarga do capacitor
  if (jogo.melhorias.capacitor > 0) {
    jogo.disparosDesdeDescarga += 1;

    if (jogo.disparosDesdeDescarga >= EFEITOS.capacitorDisparos) {
      jogo.disparosDesdeDescarga = 0;

      disparaDescargaDoPIC(jogo);
    }
  }

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
        aplicaDanoAoInimigo(jogo, j, projetil.dano);

        // O projétil desaparece ao atingir o primeiro inimigo
        jogo.projeteis.splice(i, 1);

        break;
      }
    }
  }
}

export function atualizaMira(jogo) {
    const alvo = encontraAlvo(jogo);

    if (alvo) {
        const dx = alvo.x - jogo.pic.x;
        const dy = alvo.y - jogo.pic.y;
        jogo.pic.angulo = Math.atan2(dy, dx) - Math.PI / 2;
    }
}