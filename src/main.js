import { carregarShaderSprite } from "./renderizacao/shader.js";
import { criarQuadrado } from "./renderizacao/quadrado.js";
import { carregarTexturas } from "./renderizacao/textura.js";
import { ortho } from "./renderizacao/matrizes.js";

import { criaInimigo, atualizaInimigo } from "./entidades/inimigos.js";
import { atualizaProjetil } from "./entidades/projeteis.js";

import { atualizaDisparo, verificaColisoes, atualizaMira } from "./sistemas/combate.js";
import { desenhaCena } from "./sistemas/render.js";
import { atualizaHUD, registraHUD } from "./sistemas/hud.js";
import { registraEntrada, atualizaEntrada } from "./sistemas/entrada.js";
import { calculaIntervaloSpawn } from "./sistemas/ondas.js";
import { sorteiaCartoes } from "./sistemas/melhorias.js";
import { criaEstadoInicial, reiniciaJogo } from "./sistemas/estado.js";

import { MUNDO, PIC, FERRO, ONDAS } from "./config/atributos.js";
import { TEXTURAS } from "./config/texturas.js";

import { atualizaEfeitos } from "./sistemas/efeitos.js";

import { tocaSom, alternaMudo, iniciaMusica } from "./sistemas/audio.js";

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
  registraHUD(jogo, {
    reiniciar: () => {
      reiniciaJogo(jogo, true);
    },

    voltarMenu: () => {
      reiniciaJogo(jogo, false);
    }
  });

  document.addEventListener("pointerdown", iniciaMusica, { once: true });
  document.addEventListener("keydown", iniciaMusica, { once: true });

  // Shader
  const shaderSprite = await carregarShaderSprite(gl);

  // Geometria
  const quadradoVAO = criarQuadrado(gl, shaderSprite.atributos);

  // Texturas
  const texturas = await carregarTexturas(gl, TEXTURAS);

  // Projeção
  const projecao = ortho(MUNDO.esquerda, MUNDO.direita, MUNDO.baixo, MUNDO.cima, -1, 1);

  // Blending
  gl.enable(gl.BLEND);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
    texturas: texturas
  };

  // Atualização da cena
  function atualizaCena(dt) {
    atualizaEntrada(jogo, dt);

    if (jogo.pic.tempoFlash > 0) {
      jogo.pic.tempoFlash -= dt;
    }

    if (jogo.melhorias.diodo > 0 && jogo.tempoDiodo < jogo.intervaloDiodo) {
      jogo.tempoDiodo += dt;
    }

    // Controla o surgimento dos inimigos da onda
    if (!jogo.emIntervalo && jogo.fila.length > 0) {
      jogo.tempoSpawn += dt;

      const intervaloSpawn = calculaIntervaloSpawn(jogo.fila.length, jogo.totalDaOnda);

      if (jogo.tempoSpawn >= intervaloSpawn) {
        jogo.tempoSpawn = 0;

        const tipo = jogo.fila.shift();

        jogo.inimigos.push(...criaInimigo(tipo));
      }
    }

    for (const inimigo of jogo.inimigos) {
      atualizaInimigo(inimigo, jogo, dt);
    }

    atualizaMira(jogo);
    atualizaDisparo(jogo, dt);

    for (const projetil of jogo.projeteis) {
      atualizaProjetil(projetil, dt);
    }

    atualizaEfeitos(jogo, dt);

    verificaColisoes(jogo);

    // Verifica o fim do jogo
    if (jogo.pic.vida <= 0 && !jogo.acabou) {
      tocaSom("derrota");
      jogo.pic.vida = 0;
      jogo.pic.tempoFlash = 0;
      jogo.acabou = true;
    }

    // Verifica se todos os inimigos da onda foram derrotados
    if (!jogo.acabou && !jogo.emIntervalo && jogo.fila.length === 0 && jogo.inimigos.length === 0) {
      // Última onda concluída
      if (jogo.onda >= ONDAS.length) {
        tocaSom("vitoria");
        jogo.venceu = true;
      } else {
        jogo.pic.vida = Math.min(PIC.vida, jogo.pic.vida + 10);
        jogo.emIntervalo = true;
        jogo.tempoSpawn = 0;
        jogo.cartoes = sorteiaCartoes(jogo);
      }
    }
  }

  function alternaTelaCheia() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((erro) => {
        console.error("Erro ao entrar em tela cheia:", erro);
      });

      return;
    }

    document.exitFullscreen().catch((erro) => {
      console.error("Erro ao sair da tela cheia:", erro);
    });
  }

  // Eventos de teclado
  window.addEventListener("keydown", (event) => {
    if (event.code === "KeyP" && !event.repeat) {
      if (!jogo.iniciado || jogo.acabou || jogo.venceu || jogo.emIntervalo) {
        return;
      }

      jogo.pausado = !jogo.pausado;
    }

    if (event.code === "KeyR" && !event.repeat && (jogo.acabou || jogo.venceu)) {
      reiniciaJogo(jogo, true);
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
    if (tempoAnterior !== null) {
      const dt = Math.min((tempoAtual - tempoAnterior) / 1000, 0.1);

      if (jogo.iniciado && !jogo.pausado && !jogo.acabou && !jogo.venceu) {
        atualizaCena(dt);
      }
    }

    tempoAnterior = tempoAtual;

    desenhaCena(render, jogo);
    atualizaHUD(jogo);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

main();
