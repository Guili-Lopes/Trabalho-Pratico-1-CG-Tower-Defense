import { carregarShaderSprite } from "./core/shader.js";
import { criarQuadrado } from "./core/quadrado.js";
import { carregarTextura } from "./core/textura.js";
import { criaInimigo, atualizaInimigo } from "./entities/inimigos.js";
import { ortho, translacao, escala, multiplica } from "./core/matrizes.js";

async function main() {
  const canvas = document.querySelector("#gameCanvas");
  const vidaHUD = document.querySelector("#vida");

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
      vida: 100,
      tamanho: 10,
      raio: 5
    },
    inimigos: [],
    pausado: false,
    tempoSpawn: 0,
    intervaloSpawn: 2
  };

  // Shader
  const shaderSprite = await carregarShaderSprite(gl);

  // Geometria
  const quadradoVAO = criarQuadrado(gl, shaderSprite.atributos);

  // Texturas
  const [texturaPlaca, texturaPic, texturaResistor] = await Promise.all([
    carregarTextura(
      gl,
      "assets/sprites/ui/placa-queimada.png"
    ),

    carregarTextura(
      gl,
      "assets/sprites/ui/pic.png"
    ),

    carregarTextura(
      gl,
      "assets/sprites/inimigos/resistor.png"
    )
  ]);

  // Projeção
  const projecao = ortho(
    -50,
    50,
    -37.5,
    37.5,
    -1,
    1
  );

  // Blending
  gl.enable(gl.BLEND);

  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA
  );

  // Função para desenhar sprite
  function desenharSprite(textura, x, y, largura, altura) {
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

  // Atualização da cena
  function atualizaCena(dt) {
    jogo.tempoSpawn += dt;

    if (jogo.tempoSpawn >= jogo.intervaloSpawn) {
      jogo.tempoSpawn = 0;
      jogo.inimigos.push(criaInimigo());
    }

    for (const inimigo of jogo.inimigos) {
      atualizaInimigo(inimigo, jogo.pic, dt);
    }
  }

  // Desenho da cena
  function desenhaCena() {
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

    // A projeção é a mesma para todos os objetos da cena.
    gl.uniformMatrix4fv(
      shaderSprite.uniforms.projecao,
      false,
      projecao
    );

    gl.bindVertexArray(quadradoVAO);

    // Placa ocupa 100 x 75.
    desenharSprite(
      texturaPlaca,
      0,
      0,
      100,
      75
    );

    // PIC por cima da placa 10 x 10.
    desenharSprite(
      texturaPic,
      jogo.pic.x,
      jogo.pic.y,
      jogo.pic.tamanho,
      jogo.pic.tamanho
    );

    // Inimigos
    for (const inimigo of jogo.inimigos) {
      desenharSprite(
        texturaResistor,
        inimigo.x,
        inimigo.y,
        inimigo.tamanho,
        inimigo.tamanho
      );
    }

    gl.bindVertexArray(null);

    // Atualiza a vida mostrada no HUD.
    if (vidaHUD) {
      vidaHUD.textContent = jogo.pic.vida;
    }
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

    desenhaCena();

    requestAnimationFrame(loop);
  }

  console.log("Cena carregada com sucesso.");

  requestAnimationFrame(loop);
}

main();