import { MUNDO, INIMIGOS } from "../config/atributos.js";

export function criaInimigo(tipo) {
  const config = INIMIGOS[tipo];

  const lado = Math.floor(Math.random() * 4);

  let x;
  let y;

  switch (lado) {
    // Esquerda
    case 0:
      x = MUNDO.esquerda - MUNDO.margemSpawn;
      y = Math.random() * (MUNDO.cima - MUNDO.baixo) + MUNDO.baixo;
      break;

    // Direita
    case 1:
      x = MUNDO.direita + MUNDO.margemSpawn;
      y = Math.random() * (MUNDO.cima - MUNDO.baixo) + MUNDO.baixo;
      break;

    // Cima
    case 2:
      x = Math.random() * (MUNDO.direita - MUNDO.esquerda) + MUNDO.esquerda;
      y = MUNDO.cima + MUNDO.margemSpawn;
      break;

    // Baixo
    case 3:
      x = Math.random() * (MUNDO.direita - MUNDO.esquerda) + MUNDO.esquerda;
      y = MUNDO.baixo - MUNDO.margemSpawn;
      break;
  }

  return {
    ...config,
    tipo: tipo,
    x: x,
    y: y,
    estado: "andando",
    tempoAtaque: config.intervaloAtaque,
    tempoFlash: 0,
    // Atributos só do transistor
    danoAcumulado: 0,
    emAvalanche: false,
    tempoAvalanche: 0,
    textura: tipo
  };
}

export function atualizaInimigo(inimigo, jogo, dt) {
  const alvo = jogo.pic;

  // Atualiza o tempo do flash de dano
  if (inimigo.tempoFlash > 0) {
    inimigo.tempoFlash -= dt;
  }

  // Atualiza o estado de avalanche
  if (inimigo.emAvalanche) {
    inimigo.tempoAvalanche -= dt;

    if (inimigo.tempoAvalanche <= 0) {
      inimigo.emAvalanche = false;
      inimigo.textura = inimigo.tipo;
    }
  }

  // Se estiver atacando, não se move
  if (inimigo.estado === "atacando") {
    inimigo.tempoAtaque += dt;

    if (inimigo.tempoAtaque >= inimigo.intervaloAtaque) {
      inimigo.tempoAtaque = 0;

      const dano = inimigo.emAvalanche ? inimigo.danoAvalanche : inimigo.dano;

      alvo.vida -= dano * (1 - alvo.reducaoDano);

      alvo.tempoFlash = 0.15;
    }

    return;
  }

  // Direção do inimigo até o alvo
  const dx = alvo.x - inimigo.x;
  const dy = alvo.y - inimigo.y;

  const comprimento = Math.sqrt(dx * dx + dy * dy);

  // Verifica se o inimigo encostou no alvo
  if (comprimento <= alvo.raio + inimigo.raio) {
    inimigo.estado = "atacando";
    return;
  }

  const direcaoX = dx / comprimento;
  const direcaoY = dy / comprimento;

  let velocidade = inimigo.emAvalanche ? inimigo.velocidadeAvalanche : inimigo.velocidade;

  // Aplica a lentidão do campo do indutor
  if (jogo.campoRaio > 0 && comprimento <= jogo.campoRaio) {
    velocidade *= (1 - jogo.lentidao);
  }

  inimigo.x += direcaoX * velocidade * dt;

  inimigo.y += direcaoY * velocidade * dt;
}