export function criarQuadrado(gl, atributos) {
    // Quadrado de lado 1 centrado na origem.
    // Dois triângulos = 6 vértices.
    const posicoes = new Float32Array([
        // Triângulo 1
        -0.5, -0.5,
         0.5, -0.5,
         0.5,  0.5,
        // Triângulo 2
        -0.5, -0.5,
         0.5,  0.5,
        -0.5,  0.5
    ]);
    const texcoords = new Float32Array([
        // Triângulo 1
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        // Triângulo 2
        0.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);
    // Cria e ativa o VAO.
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    // Buffer das posições
    const bufferPosicao = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPosicao);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        posicoes,
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(atributos.posicao);
    gl.vertexAttribPointer(
        atributos.posicao,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );
    // Buffer das texcoords
    const bufferTexcoord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTexcoord);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        texcoords,
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(atributos.texcoord);
    gl.vertexAttribPointer(
        atributos.texcoord,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );
    // Evita alterar esse VAO acidentalmente depois.
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vao;
}