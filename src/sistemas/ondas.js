import { ONDAS, RITMO } from "../config/atributos.js";

import { tocaSom } from "./audio.js";

export function embaralha(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temporario = array[i];

    array[i] = array[j];
    array[j] = temporario;
  }

  return array;
}

export function montaFila(numeroOnda) {
  const grupos = ONDAS[numeroOnda - 1];

  if (!grupos) {
    return [];
  }

  const fila = [];

  for (const grupo of grupos) {
    const filaGrupo = [];

    for (const tipo in grupo) {
      const quantidade = grupo[tipo];

      for (let i = 0; i < quantidade; i++) {
        filaGrupo.push(tipo);
      }
    }

    embaralha(filaGrupo);

    fila.push(...filaGrupo);
  }

  return fila;
}

export function calculaIntervaloSpawn(quantidadeRestante, totalDaOnda) {
  if (totalDaOnda <= 0) {
    return RITMO.intervaloFinal;
  }

  const progresso = 1 - quantidadeRestante / totalDaOnda;
  const intervalo = RITMO.intervaloInicial + (RITMO.intervaloFinal - RITMO.intervaloInicial) * progresso
  return (intervalo);
}

export function iniciaProximaOnda(jogo) {
  const proximaOnda = jogo.onda + 1;
  const novaFila = montaFila(proximaOnda);

  // Não inicia uma onda que não existe
  if (novaFila.length === 0) {
    return;
  }
  
  tocaSom("onda");
  jogo.onda = proximaOnda;
  jogo.fila = novaFila;
  jogo.totalDaOnda = novaFila.length;
  jogo.tempoSpawn = 0;
  jogo.emIntervalo = false;
  jogo.cartoes = [];
}