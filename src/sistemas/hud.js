import { PIC, ONDAS, MELHORIAS } from "../config/atributos.js";

import { compraMelhoria } from "./melhorias.js";

import { iniciaProximaOnda } from "./ondas.js";

const hud = document.querySelector("#hud");

const vidaHUD = document.querySelector("#vida");
const vidaPreenchimentoHUD = document.querySelector("#vida-preenchimento");
const ondaAtualHUD = document.querySelector("#onda-atual");

const pontosHUD = document.querySelector("#pontos");
const moedasHUD = document.querySelector("#moedas");

const menuHUD = document.querySelector("#menu");
const botaoIniciar = document.querySelector("#btn-iniciar");
const botaoComoJogar = document.querySelector("#btn-como-jogar");
const botaoCreditos = document.querySelector("#btn-creditos");

const comoJogarHUD = document.querySelector("#como-jogar");
const botaoVoltarComoJogar = document.querySelector("#btn-voltar-como-jogar");

const creditosHUD = document.querySelector("#creditos");
const botaoVoltarCreditos = document.querySelector("#btn-voltar-creditos");

const pausaHUD = document.querySelector("#pausa");
const botaoContinuar = document.querySelector("#btn-continuar");
const botaoReiniciar = document.querySelector("#btn-reiniciar");
const botaoMenu = document.querySelector("#btn-menu");

const gameoverHUD = document.querySelector("#gameover");
const pontosFinaisHUD = document.querySelector("#pontos-finais");

const lojaHUD = document.querySelector("#loja");
const numeroOndaHUD = document.querySelector("#numero-onda");
const moedasLojaHUD = document.querySelector("#moedas-loja");
const cartoesHUD = document.querySelector("#cartoes");
const botaoProximaOnda = document.querySelector("#btn-proxima-onda");

const vitoriaHUD = document.querySelector("#vitoria");
const pontosVitoriaHUD = document.querySelector("#pontos-vitoria");

const iconesMelhorias = {
  resistor: "assets/sprites/melhorias/resistor.png",
  capacitor: "assets/sprites/melhorias/capacitor.png",
  indutor: "assets/sprites/melhorias/indutor.png",
  diodo: "assets/sprites/melhorias/diodo.png",
  transistor: "assets/sprites/melhorias/transistor.png",
  ferro: "assets/sprites/melhorias/ferro-de-solda.png"
};

const designadoresMelhorias = {
  resistor: "R1",
  capacitor: "C1",
  indutor: "L1",
  diodo: "D1",
  transistor: "Q1",
  ferro: "F1"
};

let lojaAbertaAnteriormente = false;

function atualizaMenu(jogo) {
  if (!menuHUD) {
    return;
  }

  const mostrarMenu = !jogo.iniciado && !jogo.mostrandoComoJogar && !jogo.mostrandoCreditos;

  if (mostrarMenu) {
    menuHUD.classList.remove("oculto");
  } else {
    menuHUD.classList.add("oculto");
  }
}

function atualizaComoJogar(jogo) {
  if (!comoJogarHUD) {
    return;
  }

  if (jogo.mostrandoComoJogar) {
    comoJogarHUD.classList.remove("oculto");
  } else {
    comoJogarHUD.classList.add("oculto");
  }
}

function atualizaCreditos(jogo) {
  if (!creditosHUD) {
    return;
  }

  if (jogo.mostrandoCreditos) {
    creditosHUD.classList.remove("oculto");
  } else {
    creditosHUD.classList.add("oculto");
  }
}

function atualizaPausa(jogo) {
  if (!pausaHUD) {
    return;
  }

  const mostrarPausa = jogo.iniciado && jogo.pausado && !jogo.acabou && !jogo.venceu;

  if (mostrarPausa) {
    pausaHUD.classList.remove("oculto");
  } else {
    pausaHUD.classList.add("oculto");
  }
}

function atualizaVisibilidadeHUD(jogo) {
  if (!hud) {
    return;
  }

  const mostrarHUD = jogo.iniciado && !jogo.acabou && !jogo.venceu && !jogo.mostrandoComoJogar && !jogo.mostrandoCreditos;

  if (mostrarHUD) {
    hud.classList.remove("oculto");
  } else {
    hud.classList.add("oculto");
  }
}

function atualizaGameOver(jogo) {
  if (!gameoverHUD) {
    return;
  }

  if (jogo.acabou) {
    gameoverHUD.classList.remove("oculto");

    if (pontosFinaisHUD) {
      pontosFinaisHUD.textContent = jogo.pontos;
    }
  } else {
    gameoverHUD.classList.add("oculto");
  }
}

function atualizaVitoria(jogo) {
  if (!vitoriaHUD) {
    return;
  }

  if (jogo.venceu) {
    vitoriaHUD.classList.remove("oculto");

    if (pontosVitoriaHUD) {
      pontosVitoriaHUD.textContent = jogo.pontos;
    }
  } else {
    vitoriaHUD.classList.add("oculto");
  }
}

function criaIndicadorNivel(nivelAtual, nivelMaximo) {
  const niveis = document.createElement("div");
  niveis.classList.add("niveis");

  for (let i = 1; i <= nivelMaximo; i++) {
    const pad = document.createElement("span");
    pad.classList.add("pad");

    if (i <= nivelAtual) {
      pad.classList.add("cheio");
    }

    niveis.appendChild(pad);
  }

  return niveis;
}

function montaCartoes(jogo) {
  if (!cartoesHUD) {
    return;
  }

  cartoesHUD.innerHTML = "";

  for (const chave of jogo.cartoes) {
    const config = MELHORIAS[chave];
    const nivelAtual = jogo.melhorias[chave];

    const cartao = document.createElement("div");
    cartao.classList.add("painel", "cartao-melhoria");

    const designador = document.createElement("span");
    designador.classList.add("designador");
    designador.textContent = designadoresMelhorias[chave];

    const icone = document.createElement("img");
    icone.classList.add("icone-melhoria");
    icone.src = iconesMelhorias[chave];
    icone.alt = config.nome;

    const nome = document.createElement("span");
    nome.classList.add("nome");
    nome.textContent = config.nome;

    const niveis = criaIndicadorNivel(
      nivelAtual,
      config.nivelMaximo
    );

    const descricao = document.createElement("p");
    descricao.classList.add("descricao");
    descricao.textContent = config.descricao;

    const preco = document.createElement("span");
    preco.classList.add("preco");
    preco.textContent = `${config.preco} moedas`;

    const botao = document.createElement("button");
    botao.classList.add("botao");

    if (nivelAtual >= config.nivelMaximo) {
      botao.textContent = "Nível máximo";
      botao.disabled = true;
    } else if (jogo.moedas < config.preco) {
      const moedasFaltando = config.preco - jogo.moedas;
      botao.textContent = `Faltam ${moedasFaltando} moedas`;
      botao.disabled = true;
    } else {
      botao.textContent = "Comprar";
    }

    botao.addEventListener("click", () => {
      compraMelhoria(jogo, chave);

      montaCartoes(jogo);

      if (moedasLojaHUD) {
        moedasLojaHUD.textContent = jogo.moedas;
      }
    });

    cartao.appendChild(designador);
    cartao.appendChild(icone);
    cartao.appendChild(nome);
    cartao.appendChild(niveis);
    cartao.appendChild(descricao);
    cartao.appendChild(preco);
    cartao.appendChild(botao);

    cartoesHUD.appendChild(cartao);
  }
}

function atualizaLoja(jogo) {
  if (!lojaHUD) {
    return;
  }

  if (jogo.emIntervalo) {
    lojaHUD.classList.remove("oculto");

    if (numeroOndaHUD) {
      numeroOndaHUD.textContent = jogo.onda;
    }

    if (moedasLojaHUD) {
      moedasLojaHUD.textContent = jogo.moedas;
    }

    if (!lojaAbertaAnteriormente) {
      montaCartoes(jogo);
      lojaAbertaAnteriormente = true;
    }
  } else {
    lojaHUD.classList.add("oculto");
    lojaAbertaAnteriormente = false;
  }
}

function atualizaVida(jogo) {
  const vida = Math.max(0, jogo.pic.vida);

  const porcentagemVida = Math.max(0, Math.min(100, vida / PIC.vida * 100)
  );

  if (vidaHUD) {
    vidaHUD.textContent = Math.ceil(vida);
  }

  if (!vidaPreenchimentoHUD) {
    return;
  }

  vidaPreenchimentoHUD.style.width = `${porcentagemVida}%`;

  vidaPreenchimentoHUD.classList.toggle("media", porcentagemVida <= 50 && porcentagemVida > 25);

  vidaPreenchimentoHUD.classList.toggle("baixa", porcentagemVida <= 25);
}

export function atualizaHUD(jogo) {
  atualizaVida(jogo);

  if (ondaAtualHUD) {
    ondaAtualHUD.textContent = `Onda ${jogo.onda} de ${ONDAS.length}`;
  }

  if (pontosHUD) {
    pontosHUD.textContent = jogo.pontos;
  }

  if (moedasHUD) {
    moedasHUD.textContent = jogo.moedas;
  }

  atualizaVisibilidadeHUD(jogo);
  atualizaMenu(jogo);
  atualizaComoJogar(jogo);
  atualizaCreditos(jogo);
  atualizaPausa(jogo);
  atualizaGameOver(jogo);
  atualizaLoja(jogo);
  atualizaVitoria(jogo);
}

export function registraHUD(jogo, acoes) {
  if (botaoIniciar) {
    botaoIniciar.addEventListener("click", () => {
      jogo.iniciado = true;
      jogo.pausado = false;
      jogo.mostrandoComoJogar = false;
      jogo.mostrandoCreditos = false;
    });
  }

  if (botaoComoJogar) {
    botaoComoJogar.addEventListener("click", () => {
      jogo.mostrandoComoJogar = true;
      jogo.mostrandoCreditos = false;
    });
  }

  if (botaoCreditos) {
    botaoCreditos.addEventListener("click", () => {
      jogo.mostrandoCreditos = true;
      jogo.mostrandoComoJogar = false;
    });
  }

  if (botaoVoltarComoJogar) {
    botaoVoltarComoJogar.addEventListener("click", () => {
      jogo.mostrandoComoJogar = false;
    });
  }

  if (botaoVoltarCreditos) {
    botaoVoltarCreditos.addEventListener("click", () => {
      jogo.mostrandoCreditos = false;
    });
  }

  if (botaoContinuar) {
    botaoContinuar.addEventListener("click", () => {
      jogo.pausado = false;
    });
  }

  if (botaoReiniciar) {
    botaoReiniciar.addEventListener("click", () => {
      if (acoes.reiniciar) {
        acoes.reiniciar();
      }
    });
  }

  if (botaoMenu) {
    botaoMenu.addEventListener("click", () => {
      if (acoes.voltarMenu) {
        acoes.voltarMenu();
      }
    });
  }

  if (botaoProximaOnda) {
    botaoProximaOnda.addEventListener("click", () => {
      if (!jogo.emIntervalo) {
        return;
      }

      iniciaProximaOnda(jogo);
    });
  }
}