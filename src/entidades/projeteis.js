import { PULSO } from "../config/atributos.js";

export function criaProjetil(
  x,
  y,
  direcaoX,
  direcaoY,
  velocidade,
  dano
) {
  return {
    x: x,
    y: y,
    direcaoX: direcaoX,
    direcaoY: direcaoY,
    velocidade: velocidade,
    dano: dano,
    raio: PULSO.raio,
    tamanho: PULSO.tamanho,
    tempoVivo: 0
  };
}

export function atualizaProjetil(projetil, dt) {
  projetil.x += projetil.direcaoX * projetil.velocidade * dt;

  projetil.y += projetil.direcaoY * projetil.velocidade * dt;

  projetil.tempoVivo += dt;
}