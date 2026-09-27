// Caminhos de todas as texturas carregadas pelo WebGL
export const TEXTURAS = {
  placa: "assets/sprites/ui/placa-queimada.png",
  placaConsertada: "assets/sprites/ui/placa.png",

  alcance: "assets/sprites/efeitos/alcance.png",
  pic: "assets/sprites/ui/pic.png",
  picDestruido: "assets/sprites/ui/pic-destruido.png",

  resistor: "assets/sprites/inimigos/resistor.png",
  capacitor: "assets/sprites/inimigos/capacitor.png",
  indutor: "assets/sprites/inimigos/indutor.png",
  diodo: "assets/sprites/inimigos/diodo.png",
  transistor: "assets/sprites/inimigos/transistor.png",
  transistorAvalanche: "assets/sprites/inimigos/transistor-avalanche.png",

  pulso: "assets/sprites/efeitos/pulso.png",
  ferro: "assets/sprites/ui/ferro-de-solda.png",
  campoIndutor: "assets/sprites/efeitos/campo-indutor.png",
  descarga: "assets/sprites/efeitos/descarga.png"
};

export const ANIMACOES = {
    explosaoInimigo: {
        pasta: "assets/sprites/efeitos/explosao-inimigo",
        prefixo: "Explosion_blue_circle",
        quadros: 10,
        duracaoQuadro: 0.04
    },
    explosaoPic: {
        pasta: "assets/sprites/efeitos/explosao-pic",
        prefixo: "Explosion_two_colors",
        quadros: 10,
        duracaoQuadro: 0.01
    },
    fogo: {
        pasta: "assets/sprites/efeitos/fogo",
        prefixo: "Fire",
        quadros: 6,
        duracaoQuadro: 0.1
    },
    raio: {
        pasta: "assets/sprites/efeitos/raio",
        prefixo: "Lightning_spot",
        quadros: 4,
        duracaoQuadro: 0.07
    }
};

export const EFEITOS_AMBIENTE = [
    { animacao: "fogo", x: -38, y: 30, tamanho: 10, fase: 0},
    { animacao: "fogo", x: 37, y: -25, tamanho: 10, fase: 0},
    { animacao: "raio", x: -43, y: 0.5, tamanho: 8, fase: 0},
    { animacao: "raio", x: 33, y: 26, tamanho: 8, fase: 0}
];