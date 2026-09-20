import { MELHORIAS } from "../config/atributos.js";
import { compraMelhoria } from "./melhorias.js";
import { iniciaProximaOnda } from "./ondas.js";

const vidaHUD = document.querySelector("#vida");
const pontosHUD = document.querySelector("#pontos");
const moedasHUD = document.querySelector("#moedas");

const gameoverHUD = document.querySelector("#gameover");
const pontosFinaisHUD = document.querySelector("#pontos-finais");

const lojaHUD = document.querySelector("#loja");
const numeroOndaHUD = document.querySelector("#numero-onda");
const moedasLojaHUD = document.querySelector("#moedas-loja");
const cartoesHUD = document.querySelector("#cartoes");
const botaoProximaOnda = document.querySelector("#btn-proxima-onda");

const iconesMelhorias = {
  resistor: "assets/sprites/melhorias/resistor.png",
  capacitor: "assets/sprites/melhorias/capacitor.png",
  indutor: "assets/sprites/melhorias/indutor.png",
  diodo: "assets/sprites/melhorias/diodo.png",
  transistor: "assets/sprites/melhorias/transistor.png",
  ferro: "assets/sprites/melhorias/ferro-de-solda.png"
};

let lojaAbertaAnteriormente = false;

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

function montaCartoes(jogo) {
  if (!cartoesHUD) {
    return;
  }

  cartoesHUD.innerHTML = "";

  for (const chave of jogo.cartoes) {
    const config = MELHORIAS[chave];
    const nivelAtual = jogo.melhorias[chave];

    const cartao = document.createElement("div");
    cartao.classList.add("cartao-melhoria");

    const icone = document.createElement("img");
    icone.src = iconesMelhorias[chave];
    icone.alt = config.nome;

    const nome = document.createElement("h3");
    nome.textContent = config.nome;

    const nivel = document.createElement("p");
    nivel.classList.add("nivel");
    nivel.textContent = `Nível ${nivelAtual} / ${config.nivelMaximo}`;

    const descricao = document.createElement("p");
    descricao.classList.add("descricao");
    descricao.textContent = config.descricao;

    const preco = document.createElement("p");
    preco.classList.add("preco");
    preco.textContent = `Preço: ${config.preco} moedas`;

    const botao = document.createElement("button");
    botao.textContent = "Comprar";

    if (jogo.moedas < config.preco) {
      botao.disabled = true;
    }

    botao.addEventListener("click", () => {
      compraMelhoria(jogo, chave);

      montaCartoes(jogo);

      if (moedasLojaHUD) {
        moedasLojaHUD.textContent = jogo.moedas;
      }
    });

    cartao.appendChild(icone);
    cartao.appendChild(nome);
    cartao.appendChild(nivel);
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

    // Monta os cartões somente quando a loja abre
    if (!lojaAbertaAnteriormente) {
      montaCartoes(jogo);

      lojaAbertaAnteriormente = true;
    }
  } else {
    lojaHUD.classList.add("oculto");

    lojaAbertaAnteriormente = false;
  }
}

// Atualiza as informações mostradas no HUD
export function atualizaHUD(jogo) {
  if (vidaHUD) {
    vidaHUD.textContent = jogo.pic.vida;
  }

  if (pontosHUD) {
    pontosHUD.textContent = jogo.pontos;
  }

  if (moedasHUD) {
    moedasHUD.textContent = jogo.moedas;
  }

  atualizaGameOver(jogo);
  atualizaLoja(jogo);
}

export function registraHUD(jogo) {
  if (!botaoProximaOnda) {
    return;
  }

  botaoProximaOnda.addEventListener("click", () => {
    if (!jogo.emIntervalo) {
      return;
    }

    iniciaProximaOnda(jogo);
  });
}