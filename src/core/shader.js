async function carregarTexto(caminho) {
    const resposta = await fetch(caminho);
    return await resposta.text();
}
function compilarShader(gl, tipo, fonte) {
    const shader = gl.createShader(tipo);
    gl.shaderSource(shader, fonte);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
            "Erro ao compilar shader:",
            gl.getShaderInfoLog(shader)
        );
    }
    return shader;
}
function criarPrograma(gl, vertexShader, fragmentShader) {
    const programa = gl.createProgram();
    gl.attachShader(programa, vertexShader);
    gl.attachShader(programa, fragmentShader);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
        console.error(
            "Erro ao linkar programa:",
            gl.getProgramInfoLog(programa)
        );
    }
    return programa;
}
export async function carregarShaderSprite(gl) {
    const [fonteVertex, fonteFragment] = await Promise.all([
        carregarTexto("src/shaders/sprite.vert.glsl"),
        carregarTexto("src/shaders/sprite.frag.glsl")
    ]);
    const vertexShader = compilarShader(
        gl,
        gl.VERTEX_SHADER,
        fonteVertex
    );
    const fragmentShader = compilarShader(
        gl,
        gl.FRAGMENT_SHADER,
        fonteFragment
    );
    const programa = criarPrograma(
        gl,
        vertexShader,
        fragmentShader
    );
    const atributos = {
        posicao: gl.getAttribLocation(programa, "a_posicao"),
        texcoord: gl.getAttribLocation(programa, "a_texCoord")
    };
    const uniforms = {
        projecao: gl.getUniformLocation(programa, "u_projecao"),
        modelo: gl.getUniformLocation(programa, "u_modelo"),
        textura: gl.getUniformLocation(programa, "u_textura"),
        alpha: gl.getUniformLocation(programa, "u_alpha"),
        flash: gl.getUniformLocation(programa, "u_flash")
    };
    return {
        programa,
        atributos,
        uniforms
    };
}