export function identidade() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

export function ortho(esquerda, direita, baixo, cima, perto, longe) {
    const matriz = new Float32Array(16);

    matriz[0] = 2 / (direita - esquerda);
    matriz[5] = 2 / (cima - baixo);
    matriz[10] = -2 / (longe - perto);
    matriz[15] = 1;

    matriz[12] = -(direita + esquerda) / (direita - esquerda);
    matriz[13] = -(cima + baixo) / (cima - baixo);
    matriz[14] = -(longe + perto) / (longe - perto);

    return matriz;
}

export function translacao(tx, ty) {
    const matriz = identidade();

    matriz[12] = tx;
    matriz[13] = ty;

    return matriz;
}

export function escala(sx, sy) {
    const matriz = identidade();

    matriz[0] = sx;
    matriz[5] = sy;

    return matriz;
}

export function multiplica(a, b) {
    const resultado = new Float32Array(16);

    for (let linha = 0; linha < 4; linha++) {
        for (let coluna = 0; coluna < 4; coluna++) {
            let soma = 0;

            for (let k = 0; k < 4; k++) {
                soma += a[k * 4 + linha] * b[coluna * 4 + k];
            }

            resultado[coluna * 4 + linha] = soma;
        }
    }

    return resultado;
}