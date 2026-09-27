import { ANIMACOES } from "../config/texturas.js";

export function criaEfeitoDescarga(x, y, raioFinal) {
  return {
    tipo: "descarga",
    x: x,
    y: y,
    tamanho: 2,
    tamanhoFinal: raioFinal * 2,
    duracao: 0.50,
    tempoVivo: 0
  };
}

export function criarEfeitoAnimado(animacao, x, y, tamanho){
  const config = ANIMACOES[animacao];
  return {
    tipo: "animacao",
    animacao: animacao,
    x: x,
    y: y,
    tamanho: tamanho,
    quadros: config.quadros,
    duracaoQuadro: config.duracaoQuadro,
    duracao: config.duracaoQuadro * config.quadros,
    tempoVivo: 0
  };
}

export function atualizaEfeitos(jogo, dt) {
  for (let i = jogo.efeitos.length - 1; i >= 0; i--) {
    const efeito = jogo.efeitos[i];

    efeito.tempoVivo += dt;

    if (efeito.tipo === "descarga") {
      const progresso = efeito.tempoVivo / efeito.duracao;

      efeito.tamanho =  2 + (efeito.tamanhoFinal - 2) * progresso;
    }

    if (efeito.tipo === "animacao") {
      efeito.quadro = Math.min(Math.floor(efeito.tempoVivo / efeito.duracaoQuadro), efeito.quadros - 1);
    }

    if (efeito.tempoVivo >= efeito.duracao) {
      jogo.efeitos.splice(i, 1);
    }
  }
}