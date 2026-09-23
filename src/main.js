import { carregarShaderSprite } from "./renderizacao/shader.js";
import { criarQuadrado } from "./renderizacao/quadrado.js";
import { carregarTextura } from "./renderizacao/textura.js";
import { ortho } from "./renderizacao/matrizes.js";

import { criaInimigo, atualizaInimigo } from "./entidades/inimigos.js";
import { atualizaProjetil } from "./entidades/projeteis.js";

import { atualizaDisparo, verificaColisoes, atualizaMira } from "./sistemas/combate.js";
import { desenhaCena } from "./sistemas/render.js";
import { atualizaHUD, registraHUD } from "./sistemas/hud.js";
import { registraEntrada, atualizaEntrada } from "./sistemas/entrada.js";
import { montaFila, calculaIntervaloSpawn } from "./sistemas/ondas.js";
import { aplicaMelhorias, sorteiaCartoes } from "./sistemas/melhorias.js";

import { MUNDO, PIC, FERRO, ONDAS } from "./config/atributos.js";

import { atualizaEfeitos } from "./sistemas/efeitos.js";

import { tocaSom, alternaMudo, iniciaMusica } from "./sistemas/audio.js";

/* Teste da fila
console.log("Onda 1:", montaFila(1));
console.log("Onda 2:", montaFila(2));
console.log("Onda 3:", montaFila(3));
console.log("Onda 4:", montaFila(4));
console.log("Onda 5:", montaFila(5));
*/

function criaEstadoInicial() {
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

  aplicaMelhorias(estado);

  return estado;
}

function reiniciaJogo(jogo) {
  const novoEstado = criaEstadoInicial();

  Object.assign(jogo, novoEstado);

  jogo.iniciado = iniciar;
}

async function main() {
  const canvas = document.querySelector("#gameCanvas");

  const gl = canvas.getContext("webgl2");

  if (!gl) {
    console.error("WebGL2 não está disponível neste navegador.");
    return;
  }

  // Redimensionamento do canvas
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const largura = Math.round(entry.contentRect.width);

      const altura = Math.round(entry.contentRect.height);

      if (canvas.width !== largura || canvas.height !== altura) {
        canvas.width = largura;
        canvas.height = altura;
      }
    }
  });

  resizeObserver.observe(canvas);

  // Estado do jogo
  const jogo = criaEstadoInicial();

  registraEntrada(canvas, jogo);
  registraHUD(
  jogo,
  {
    reiniciar: () => {
      reiniciaJogo(jogo, true);
    },

    voltarMenu: () => {
      reiniciaJogo(jogo, false);
    }
  }
);

  /* Debug para mostrar a onda 
  console.log(jogo.fila);
  console.log(jogo.totalDaOnda);
  */

  // Entrada do jogador
  registraEntrada(canvas, jogo);

  // Shader
  const shaderSprite = await carregarShaderSprite(gl);

  // Geometria
  const quadradoVAO = criarQuadrado(gl, shaderSprite.atributos);

  // Texturas
const [
  texturaPlaca,
  texturaPlacaConsertada,
  texturaAlcance,
  texturaPic,
  texturaPicDestruido,
  texturaResistor,
  texturaCapacitor,
  texturaIndutor,
  texturaDiodo,
  texturaTransistor,
  texturaTransistorAvalanche,
  texturaPulso,
  texturaFerro,
  texturaCampoIndutor,
  texturaDescarga
] = await Promise.all([
  carregarTextura(
    gl,
    "assets/sprites/ui/placa-queimada.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/ui/placa.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/efeitos/alcance.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/ui/pic.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/ui/pic-destruido.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/inimigos/resistor.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/inimigos/capacitor.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/inimigos/indutor.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/inimigos/diodo.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/inimigos/transistor.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/inimigos/transistor-avalanche.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/efeitos/pulso.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/ui/ferro-de-solda.png"
  ),
    carregarTextura(
    gl,
    "assets/sprites/efeitos/campo-indutor.png"
  ),

  carregarTextura(
    gl,
    "assets/sprites/efeitos/descarga.png"
  )
]);

  // Projeção
  const projecao = ortho(
    MUNDO.esquerda,
    MUNDO.direita,
    MUNDO.baixo,
    MUNDO.cima,
    -1,
    1
  );

  // Blending
  gl.enable(gl.BLEND);

  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA
  );

  // Dados necessários para a renderização
  const render = {
    gl: gl,
    canvas: canvas,
    programa: shaderSprite.programa,
    uniforms: shaderSprite.uniforms,
    vao: quadradoVAO,
    projecao: projecao,
    larguraMundo: MUNDO.direita - MUNDO.esquerda,
    alturaMundo: MUNDO.cima - MUNDO.baixo,
    tamanhoFerro: FERRO.tamanho,
    texturas: {
      placa: texturaPlaca,
      placaConsertada: texturaPlacaConsertada,
      alcance: texturaAlcance,
      pic: texturaPic,
      picDestruido: texturaPicDestruido,
      resistor: texturaResistor,
      capacitor: texturaCapacitor,
      indutor: texturaIndutor,
      diodo: texturaDiodo,
      transistor: texturaTransistor,
      transistorAvalanche: texturaTransistorAvalanche,
      pulso: texturaPulso,
      ferro: texturaFerro,
      campoIndutor: texturaCampoIndutor,
      descarga: texturaDescarga
}
  };

// Atualização da cena
function atualizaCena(dt) {
  atualizaEntrada(jogo, dt);

  if (jogo.pic.tempoFlash > 0) {
    jogo.pic.tempoFlash -= dt;
  }

  // Controla o surgimento dos inimigos da onda
  if (!jogo.emIntervalo && jogo.fila.length > 0) {
    jogo.tempoSpawn += dt;

    const intervaloSpawn = calculaIntervaloSpawn(
      jogo.fila.length,
      jogo.totalDaOnda
    );

    if (jogo.tempoSpawn >= intervaloSpawn) {
      jogo.tempoSpawn = 0;

      const tipo = jogo.fila.shift();

      jogo.inimigos.push(
        ...criaInimigo(tipo)
      );
    }
  }

  for (const inimigo of jogo.inimigos) {
    atualizaInimigo(inimigo, jogo, dt);
  }

  atualizaMira(jogo, dt);
  atualizaDisparo(jogo, dt);

  for (const projetil of jogo.projeteis) {
    atualizaProjetil(projetil, dt);
  }

  atualizaEfeitos(jogo, dt);

  verificaColisoes(jogo);

  // Verifica se todos os inimigos da onda foram derrotados
  if (!jogo.emIntervalo && jogo.fila.length === 0 && jogo.inimigos.length === 0) {
    // Última onda concluída
    if (jogo.onda >= ONDAS.length) {
      tocaSom("vitoria");
      jogo.venceu = true;
    } else {
      jogo.emIntervalo = true;
      jogo.tempoSpawn = 0;
      jogo.cartoes = sorteiaCartoes(jogo);
    }
  }

  // Verifica o fim do jogo
  if (jogo.pic.vida <= 0 && !jogo.acabou) {
    tocaSom("derrota");
    jogo.pic.vida = 0;
    jogo.pic.tempoFlash = 0;
    jogo.acabou = true;
  }
}

function alternaTelaCheia() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
      .catch((erro) => {
        console.error("Erro ao entrar em tela cheia:", erro);
      });

    return;
  }

  document.exitFullscreen()
    .catch((erro) => {
      console.error(
        "Erro ao sair da tela cheia:", erro);
    });
}

  // Eventos de teclado
  window.addEventListener("keydown", (event) => {
    if (event.code === "KeyP" && !event.repeat) {
        if (!jogo.iniciado || jogo.acabou || jogo.venceu || jogo.emIntervalo) {
          return;
        }

      jogo.pausado = !jogo.pausado;

      console.log(jogo.pausado ? "Jogo pausado." : "Jogo retomado.");
    }

    if (event.code === "KeyR" && !event.repeat && (jogo.acabou || jogo.venceu)) {
      reiniciaJogo(jogo, true);

      console.log("Jogo reiniciado.");
    }

    if (event.code === "KeyM" && !event.repeat) {
      alternaMudo();
    }

    if (event.code === "KeyF" && !event.repeat) {
      alternaTelaCheia();
    }
  });

  // Loop principal
  let tempoAnterior = null;

  function loop(tempoAtual) {
    iniciaMusica();
    if (tempoAnterior !== null) {
      const dt = Math.min((tempoAtual - tempoAnterior) / 1000, 0.1);

      if (jogo.iniciado && !jogo.pausado && !jogo.acabou && !jogo.venceu) {
        atualizaCena(dt);
      }
    }

    tempoAnterior = tempoAtual;

    desenhaCena(render, jogo);
    atualizaHUD(jogo);

    /* Debug das melhorias
    console.log({
      melhorias: jogo.melhorias,

      danoPIC: jogo.pic.dano,
      cadenciaPIC: jogo.pic.cadencia,
      velocidadePulso: jogo.pic.velocidadePulso,
      reducaoDanoPIC: jogo.pic.reducaoDano,

      ferroDano: jogo.ferroDano,

      campoRaio: jogo.campoRaio,
      lentidao: jogo.lentidao,

      intervaloDiodo: jogo.intervaloDiodo,
      tempoDiodo: jogo.tempoDiodo,

      disparosDesdeDescarga: jogo.disparosDesdeDescarga
    });*/

    requestAnimationFrame(loop);
  }

  console.log("Cena carregada com sucesso.");

  requestAnimationFrame(loop);
}

main();