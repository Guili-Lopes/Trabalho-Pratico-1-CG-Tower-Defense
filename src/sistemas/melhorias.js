import { PIC, FERRO, EFEITOS,MELHORIAS } from "../config/atributos.js";
import { embaralha } from "./ondas.js";

export function aplicaMelhorias(jogo) {
  const m = jogo.melhorias;

  // Dano do PIC
  jogo.pic.dano = PIC.dano * (1 + EFEITOS.capacitorDano * m.capacitor);

  // Cadência do PIC
  jogo.pic.cadencia = PIC.cadencia * (1 + EFEITOS.transistorBonus * m.transistor);
  jogo.intervaloTiro = 1 / jogo.pic.cadencia;

  // Velocidade dos pulsos
  jogo.pic.velocidadePulso = PIC.velocidadePulso * (1 + EFEITOS.transistorBonus * m.transistor);

  // Redução de dano recebida pelo PIC
  jogo.pic.reducaoDano = EFEITOS.resistorReducao * m.resistor;

  // Dano do ferro de solda
  jogo.ferroDano = FERRO.dano * (1 + EFEITOS.ferroDano * m.ferro);

  // Campo do indutor
  jogo.campoRaio = EFEITOS.indutorRaios[m.indutor];
  jogo.lentidao = EFEITOS.indutorLentidao * m.indutor;

  // Intervalo de bloqueio do diodo
  jogo.intervaloDiodo = EFEITOS.diodoIntervalos[m.diodo];
}

export function sorteiaCartoes(jogo) {
  const disponiveis = Object.keys(MELHORIAS).filter((chave) => {
    return (jogo.melhorias[chave] < MELHORIAS[chave].nivelMaximo);
  });

  embaralha(disponiveis);

  return disponiveis.slice(0, 3);
}

export function compraMelhoria(jogo, chave) {
  const config = MELHORIAS[chave];

  if (!config) {
    return;
  }

  if (jogo.melhorias[chave] >= config.nivelMaximo) {
    return;
  }

  if (jogo.moedas < config.preco) {
    return;
  }

  jogo.moedas -= config.preco;
  jogo.melhorias[chave] += 1;

  aplicaMelhorias(jogo);
}