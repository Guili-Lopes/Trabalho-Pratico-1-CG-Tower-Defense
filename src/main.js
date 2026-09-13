import { carregarShaderSprite } from "./renderizacao/shader.js";
import { criarQuadrado } from "./renderizacao/quadrado.js";
import { carregarTextura } from "./renderizacao/textura.js";
import { criaInimigo, atualizaInimigo } from "./entidades/inimigos.js";
import { criaProjetil, atualizaProjetil } from "./entidades/projeteis.js";
import { ortho, translacao, escala, multiplica } from "./renderizacao/matrizes.js";
import { MUNDO, PIC, PULSO } from "./config/atributos.js";

async function main() {
  const canvas = document.querySelector("#gameCanvas");
  const vidaHUD = document.querySelector("#vida");
  const pontosHUD = document.querySelector("#pontos");
  const moedasHUD = document.querySelector("#moedas");

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

  // Função para desenhar sprite
  // Função para desenhar sprite
function desenharSprite(textura, x, y, largura, altura, flash = 0.0) {
  const modelo = multiplica(
    translacao(x, y),
    escala(largura, altura)
  );

  // Matriz de modelo do objeto
  gl.uniformMatrix4fv(
    shaderSprite.uniforms.modelo,
    false,
    modelo
  );

  // Opacidade normal
  gl.uniform1f(
    shaderSprite.uniforms.alpha,
    1.0
  );

  // Define o efeito de flash
  gl.uniform1f(
    shaderSprite.uniforms.flash,
    flash
  );

  // Usa a unidade de textura 0
  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(
    gl.TEXTURE_2D,
    textura
  );

  // O shader deve procurar sua textura
  // na unidade de textura número 0
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

  // Procura o inimigo mais próximo dentro do alcance do PIC
  function encontraAlvo() {
    let alvoMaisProximo = null;
    let menorDistanciaQuadrada = Infinity;

    const alcanceQuadrado = jogo.pic.alcance * jogo.pic.alcance;

    for (const inimigo of jogo.inimigos) {
      const dx = inimigo.x - jogo.pic.x;
      const dy = inimigo.y - jogo.pic.y;

      const distanciaQuadrada = dx * dx + dy * dy;

      if (
        distanciaQuadrada <= alcanceQuadrado &&
        distanciaQuadrada < menorDistanciaQuadrada
      ) {
        menorDistanciaQuadrada = distanciaQuadrada;
        alvoMaisProximo = inimigo;
      }
    }

    return alvoMaisProximo;
  }

  // Atualiza o disparo automático do PIC
  function atualizaDisparo(dt) {
    jogo.tempoTiro += dt;

    if (jogo.tempoTiro < jogo.intervaloTiro) {
      return;
    }

    const alvo = encontraAlvo();

    if (!alvo) {
      return;
    }

    const dx = alvo.x - jogo.pic.x;
    const dy = alvo.y - jogo.pic.y;

    const comprimento = Math.sqrt(dx * dx + dy * dy);

    const direcaoX = dx / comprimento;
    const direcaoY = dy / comprimento;

    jogo.projeteis.push(
      criaProjetil(
        jogo.pic.x,
        jogo.pic.y,
        direcaoX,
        direcaoY,
        jogo.pic.dano
      )
    );

    jogo.tempoTiro = 0;
  }

  // Verifica colisões entre projéteis e inimigos
  function verificaColisoes() {
    for (let i = jogo.projeteis.length - 1; i >= 0; i--) {
      const projetil = jogo.projeteis[i];

      // Remove o projétil quando seu tempo de vida termina
      if (projetil.tempoVivo >= PULSO.tempoDeVida) {
        jogo.projeteis.splice(i, 1);
        continue;
      }

      for (let j = jogo.inimigos.length - 1; j >= 0; j--) {
        const inimigo = jogo.inimigos[j];

        const dx = inimigo.x - projetil.x;
        const dy = inimigo.y - projetil.y;

        const somaRaios = inimigo.raio + projetil.raio;

        // Colisão círculo-círculo
        if (dx * dx + dy * dy <= somaRaios * somaRaios) {
          // Aplica o dano considerando a redução do inimigo
          inimigo.vida -= projetil.dano * (1 - inimigo.reducaoDano);

          // Ativa o flash de dano
          inimigo.tempoFlash = 0.08;

          // O projétil desaparece ao atingir o primeiro inimigo
          jogo.projeteis.splice(i, 1);

          // Verifica se o inimigo morreu
          if (inimigo.vida <= 0) {
            jogo.inimigos.splice(j, 1);

            jogo.pontos += inimigo.pontos;
            jogo.moedas += inimigo.moedas;
          }

          break;
        }
      }
    }
  }

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

    atualizaDisparo(dt);

    for (const projetil of jogo.projeteis) {
      atualizaProjetil(projetil, dt);
    }

    verificaColisoes();
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

    // A projeção é a mesma para todos os objetos da cena
    gl.uniformMatrix4fv(
      shaderSprite.uniforms.projecao,
      false,
      projecao
    );

    gl.bindVertexArray(quadradoVAO);

    // Placa ocupa o mundo inteiro
    desenharSprite(
      texturaPlaca,
      0,
      0,
      MUNDO.direita - MUNDO.esquerda,
      MUNDO.cima - MUNDO.baixo
    );

    // Anel de alcance do PIC
    desenharSprite(
      texturaAlcance,
      jogo.pic.x,
      jogo.pic.y,
      jogo.pic.alcance * 2,
      jogo.pic.alcance * 2
    );

    // PIC por cima da placa
    desenharSprite(
      texturaPic,
      jogo.pic.x,
      jogo.pic.y,
      jogo.pic.tamanho,
      jogo.pic.tamanho,
      jogo.pic.tempoFlash > 0 ? 1.0 : 0.0
    );

    // Inimigos
    for (const inimigo of jogo.inimigos) {
      desenharSprite(
        texturaResistor,
        inimigo.x,
        inimigo.y,
        inimigo.tamanho,
        inimigo.tamanho,
        inimigo.tempoFlash > 0 ? 1.0 : 0.0
      );
    }

    // Projéteis
    for (const projetil of jogo.projeteis) {
      desenharSprite(
        texturaPulso,
        projetil.x,
        projetil.y,
        projetil.tamanho,
        projetil.tamanho
      );
    }

    gl.bindVertexArray(null);

    // Atualiza a vida mostrada no HUD
    if (vidaHUD) {
      vidaHUD.textContent = jogo.pic.vida;
    }

    // Atualiza os pontos mostrados no HUD
    if (pontosHUD) {
      pontosHUD.textContent = jogo.pontos;
    }

    // Atualiza as moedas mostradas no HUD
    if (moedasHUD) {
      moedasHUD.textContent = jogo.moedas;
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