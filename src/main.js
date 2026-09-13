import { carregarShaderSprite } from "./renderizacao/shader.js";
import { criarQuadrado } from "./renderizacao/quadrado.js";
import { carregarTextura } from "./renderizacao/textura.js";
import { ortho } from "./renderizacao/matrizes.js";

import { criaInimigo, atualizaInimigo } from "./entidades/inimigos.js";
import { atualizaProjetil } from "./entidades/projeteis.js";

import { atualizaDisparo, verificaColisoes } from "./sistemas/combate.js";
import { desenhaCena } from "./sistemas/render.js";
import { atualizaHUD } from "./sistemas/hud.js";

import { MUNDO, PIC } from "./config/atributos.js";

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
  const jogo = {
    pic: {
      x: 0,
      y: 0,
      ...PIC,
      tempoFlash: 0
    },
    inimigos: [],
    projeteis: [],
    pontos: 0,
    moedas: 0,
    pausado: false,
    tempoSpawn: 0,
    intervaloSpawn: 2,
    tempoTiro: 0,
    intervaloTiro: 1 / PIC.cadencia
  };

  // Shader
  const shaderSprite = await carregarShaderSprite(gl);

  // Geometria
  const quadradoVAO = criarQuadrado(gl, shaderSprite.atributos);

  // Texturas
  const [
    texturaPlaca,
    texturaAlcance,
    texturaPic,
    texturaResistor,
    texturaPulso
  ] = await Promise.all([
    carregarTextura(
      gl,
      "assets/sprites/ui/placa-queimada.png"
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
      "assets/sprites/inimigos/resistor.png"
    ),

    carregarTextura(
      gl,
      "assets/sprites/efeitos/pulso.png"
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
    texturas: {
      placa: texturaPlaca,
      alcance: texturaAlcance,
      pic: texturaPic,
      resistor: texturaResistor,
      pulso: texturaPulso
    }
  };

  // Atualização da cena
  function atualizaCena(dt) {
    jogo.tempoSpawn += dt;

    if (jogo.pic.tempoFlash > 0) {
      jogo.pic.tempoFlash -= dt;
    }

    if (jogo.tempoSpawn >= jogo.intervaloSpawn) {
      jogo.tempoSpawn = 0;
      jogo.inimigos.push(criaInimigo("resistor"));
    }

    for (const inimigo of jogo.inimigos) {
      atualizaInimigo(inimigo, jogo.pic, dt);
    }

    atualizaDisparo(jogo, dt);

    for (const projetil of jogo.projeteis) {
      atualizaProjetil(projetil, dt);
    }

    verificaColisoes(jogo);
  }

  // Pausa
  window.addEventListener("keydown", (event) => {
    if (
      event.code === "KeyP" &&
      !event.repeat
    ) {
      jogo.pausado = !jogo.pausado;

      console.log(
        jogo.pausado
          ? "Jogo pausado."
          : "Jogo retomado."
      );
    }
  });

  // Loop principal
  let tempoAnterior = null;

  function loop(tempoAtual) {
    if (tempoAnterior !== null) {
      const dt = Math.min(
        (tempoAtual - tempoAnterior) / 1000,
        0.1
      );

      if (!jogo.pausado) {
        atualizaCena(dt);
      }
    }

    tempoAnterior = tempoAtual;

    desenhaCena(render, jogo);
    atualizaHUD(jogo);

    requestAnimationFrame(loop);
  }

  console.log("Cena carregada com sucesso.");

  requestAnimationFrame(loop);
}

main();