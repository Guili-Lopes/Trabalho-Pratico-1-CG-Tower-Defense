export async function carregarTextura(gl, caminho) {
  // Carrega a imagem de forma assíncrona.
  const imagem = await new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = () => {
      reject(
        new Error(`Erro ao carregar a textura: ${caminho}`)
      );
    };

    img.src = caminho;
  });

  // Corrige a diferença entre a origem das imagens
  // e a origem das coordenadas de textura do WebGL.
  gl.pixelStorei(
    gl.UNPACK_FLIP_Y_WEBGL,
    true
  );

  // Cria a textura.
  const textura = gl.createTexture();

  gl.bindTexture(
    gl.TEXTURE_2D,
    textura
  );

  // Envia a imagem para a GPU.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imagem
  );

  gl.generateMipmap(gl.TEXTURE_2D);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.NEAREST
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_NEAREST
  );

  // Evita alterar a textura acidentalmente depois.
  gl.bindTexture(
    gl.TEXTURE_2D,
    null
  );

  return textura;
}