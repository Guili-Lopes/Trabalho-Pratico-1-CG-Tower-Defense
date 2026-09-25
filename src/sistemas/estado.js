import { PIC, FERRO } from "../config/atributos.js";

import { montaFila } from "./ondas.js";
import { aplicaMelhorias } from "./melhorias.js";

// Monta o estado completo de uma partida nova.
// É usada tanto na inicialização quanto no reinício, garantindo
// que os dois partam exatamente dos mesmos valores.
export function criaEstadoInicial() {
  const fila = montaFila(1);

  const estado = {
    pic: {
      x: 0,
      y: 0,
      ...PIC,
      tempoFlash: 0
    },
    mouse: {
      x: 0,
      y: 0
    },
    inimigos: [],
    efeitos: [],
    projeteis: [],
    pontos: 0,
    moedas: 0,

    iniciado: false,
    pausado: false,
    acabou: false,
    venceu: false,
    mostrandoComoJogar: false,
    mostrandoCreditos: false,

    onda: 1,
    fila: fila,
    totalDaOnda: fila.length,
    emIntervalo: false,
    tempoSpawn: 0,

    tempoTiro: 0,
    intervaloTiro: 1 / PIC.cadencia,
    tempoFerro: FERRO.recarga,

    melhorias: {
      resistor: 0,
      capacitor: 0,
      indutor: 0,
      diodo: 0,
      transistor: 0,
      ferro: 0
    },

    cartoes: [],
    disparosDesdeDescarga: 0,
    tempoDiodo: 0
  };

  // Os valores derivados (dano, cadência, campo...) vêm sempre dos níveis
  aplicaMelhorias(estado);

  return estado;
}

// Reinicia a partida sem trocar a referência do objeto jogo.
// Os ouvintes de evento guardaram essa referência ao serem registrados;
// por isso o conteúdo é copiado para dentro dele com Object.assign.
export function reiniciaJogo(jogo, iniciar = false) {
  Object.assign(jogo, criaEstadoInicial());

  jogo.iniciado = iniciar;
}
