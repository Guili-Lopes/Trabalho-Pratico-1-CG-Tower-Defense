import { carregarShaderSprite } from "./core/shader.js";
import { criarQuadrado } from "./core/quadrado.js";
import { carregarTextura } from "./core/textura.js";

import {
  ortho,
  translacao,
  escala,
  multiplica
} from "./core/matrizes.js";

async function main() {
  const canvas = document.querySelector("#gameCanvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) {
    console.error("WebGL2 não está disponível neste navegador.");
    return;
  }

  // =========================
  // Shader
  // =========================

  const shaderSprite = await carregarShaderSprite(gl);

  // =========================
  // Geometria
  // =========================

  const quadradoVAO = criarQuadrado(
    gl,
    shaderSprite.atributos
  );

  // =========================
  // Texturas
  // =========================

  const [
    texturaPlaca,
    texturaPic
  ] = await Promise.all([
    carregarTextura(
      gl,
      "assets/sprites/ui/placa-queimada.png"
    ),

    carregarTextura(
      gl,
      "assets/sprites/ui/pic.png"
    )
  ]);

  // =========================
  // Projeção
  // =========================

  const projecao = ortho(
    -50,
    50,
    -37.5,
    37.5,
    -1,
    1
  );

  // =========================
  // Blending / transparência
  // =========================

  gl.enable(gl.BLEND);

  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA
  );

  // =========================
  // Função para desenhar sprite
  // =========================

  function desenharSprite(
    textura,
    x,
    y,
    largura,
    altura
  ) {
    const modelo = multiplica(
      translacao(x, y),
      escala(largura, altura)
    );

    // Matriz de modelo do objeto.
    gl.uniformMatrix4fv(
      shaderSprite.uniforms.modelo,
      false,
      modelo
    );

    // Opacidade normal.
    gl.uniform1f(
      shaderSprite.uniforms.alpha,
      1.0
    );

    // Sem efeito de flash.
    gl.uniform1f(
      shaderSprite.uniforms.flash,
      0.0
    );

    // Usa a unidade de textura 0.
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(
      gl.TEXTURE_2D,
      textura
    );

    // O shader deve procurar sua textura
    // na unidade de textura número 0.
    gl.uniform1i(
      shaderSprite.uniforms.textura,
      0
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      6
    );
  }

  // =========================
  // Desenho da cena
  // =========================

  gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
  );

  gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
  );

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shaderSprite.programa);

  // A projeção é a mesma para todos
  // os objetos da cena.
  gl.uniformMatrix4fv(
    shaderSprite.uniforms.projecao,
    false,
    projecao
  );

  gl.bindVertexArray(quadradoVAO);

  // Placa ocupa o mundo inteiro: 100 x 75.
  desenharSprite(
    texturaPlaca,
    0,
    0,
    100,
    75
  );

  // PIC por cima da placa: 10 x 10.
  desenharSprite(
    texturaPic,
    0,
    0,
    10,
    10
  );

  gl.bindVertexArray(null);

  console.log("Cena carregada com sucesso.");
}

main();