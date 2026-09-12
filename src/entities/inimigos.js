export function criaInimigo() {
  const lado = Math.floor(Math.random() * 4);

  let x;
  let y;

  switch (lado) {
    // Esquerda
    case 0:
      x = -55;
      y = Math.random() * 75 - 37.5;
      break;

    // Direita
    case 1:
      x = 55;
      y = Math.random() * 75 - 37.5;
      break;

    // Cima
    case 2:
      x = Math.random() * 100 - 50;
      y = 42.5;
      break;

    // Baixo
    case 3:
      x = Math.random() * 100 - 50;
      y = -42.5;
      break;
  }

  return {
    x: x,
    y: y,
    vida: 30,
    velocidade: 8,
    raio: 3,
    tamanho: 6,
    dano: 5,
    intervaloAtaque: 1.5,
    estado: "andando",
    tempoAtaque: 1.5
  };
}

export function atualizaInimigo(inimigo, alvo, dt) {
  // Se estiver atacando, não se move.
  if (inimigo.estado === "atacando") {
    inimigo.tempoAtaque += dt;

    if ( inimigo.tempoAtaque >= inimigo.intervaloAtaque) {
      inimigo.tempoAtaque = 0;
      alvo.vida -= inimigo.dano;
    }

    return;
  }

  // Direção do inimigo até o alvo.
  const dx = alvo.x - inimigo.x;
  const dy = alvo.y - inimigo.y;

  const comprimento = Math.sqrt(dx * dx + dy * dy);

  // Verifica se o inimigo encostou no alvo.
  if (comprimento <= alvo.raio + inimigo.raio) {
    inimigo.estado = "atacando";
    return;
  }

  const direcaoX = dx / comprimento;
  const direcaoY = dy / comprimento;

  inimigo.x += direcaoX * inimigo.velocidade * dt;

  inimigo.y += direcaoY * inimigo.velocidade * dt;
}