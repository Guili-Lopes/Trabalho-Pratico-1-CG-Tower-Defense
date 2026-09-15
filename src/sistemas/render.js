import { translacao, escala, multiplica, rotacaoZ } from "../renderizacao/matrizes.js";

// Desenha um sprite na cena
export function desenharSprite(
  render,
  textura,
  x,
  y,
  largura,
  altura,
  flash = 0.0,
  angulo = 0.0
) {
  const gl = render.gl;

  const modelo = multiplica(
    multiplica(translacao(x, y), rotacaoZ(angulo)),
    escala(largura, altura)
  );

  // Matriz de modelo do objeto
  gl.uniformMatrix4fv(
    render.uniforms.modelo,
    false,
    modelo
  );

  // Opacidade normal
  gl.uniform1f(
    render.uniforms.alpha,
    1.0
  );

  // Define o efeito de flash
  gl.uniform1f(
    render.uniforms.flash,
    flash
  );

  // Usa a unidade de textura 0
  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(
    gl.TEXTURE_2D,
    textura
  );

  // O shader deve procurar sua textura na unidade de textura número 0
  gl.uniform1i(
    render.uniforms.textura,
    0
  );

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    6
  );
}

// Desenha todos os elementos da cena
export function desenhaCena(render, jogo) {
  const gl = render.gl;

  gl.viewport(
    0,
    0,
    render.canvas.width,
    render.canvas.height
  );

  gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
  );

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(render.programa);

  // A projeção é a mesma para todos os objetos da cena
  gl.uniformMatrix4fv(
    render.uniforms.projecao,
    false,
    render.projecao
  );

  gl.bindVertexArray(render.vao);

  // Placa ocupa o mundo inteiro
  desenharSprite(
    render,
    render.texturas.placa,
    0,
    0,
    render.larguraMundo,
    render.alturaMundo
  );

  // Anel de alcance do PIC
  desenharSprite(
    render,
    render.texturas.alcance,
    jogo.pic.x,
    jogo.pic.y,
    jogo.pic.alcance * 2,
    jogo.pic.alcance * 2
  );

  // PIC por cima da placa
  desenharSprite(
    render,
    jogo.acabou ? render.texturas.picDestruido : render.texturas.pic,
    jogo.pic.x,
    jogo.pic.y,
    jogo.pic.tamanho,
    jogo.pic.tamanho,
    jogo.pic.tempoFlash > 0 ? 1.0 : 0.0,
    jogo.pic.angulo
  );

  // Inimigos
  for (const inimigo of jogo.inimigos) {
    desenharSprite(
      render,
      render.texturas[inimigo.tipo],
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
      render,
      render.texturas.pulso,
      projetil.x,
      projetil.y,
      projetil.tamanho,
      projetil.tamanho
    );
  }

  // Ferro de solda
  desenharSprite(
    render,
    render.texturas.ferro,
    jogo.mouse.x + 3,   // Ajuste pra colocar a ponta do ferro na ponta do mouse e o clique ficar certinho
    jogo.mouse.y +2.7,  // Ajuste pra colocar a ponta do ferro na ponta do mouse e o clique ficar certinho
    render.tamanhoFerro,
    render.tamanhoFerro
  );

  gl.bindVertexArray(null);
}