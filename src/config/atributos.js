export const MUNDO = {
    esquerda: -50,
    direita: 50,
    baixo: -37.5,
    cima: 37.5,
    // Além do horizonte onde vem os inimigs
    margemSpawn: 5
};

// PIC
export const PIC = {
    vida: 100,
    tamanho: 10,
    raio: 5,

    alcance: 22,
    dano: 10,
    cadencia: 1.5,           
    velocidadePulso: 60
};

// Pulso de PWM
export const PULSO = {
    tamanho: 2,
    raio: 1,
    tempoDeVida: 3          // segundos até desaparecer sozinho
};

// Ferro de solda
export const FERRO = {
    dano: 12,
    recarga: 0.4,
    tamanho: 8
};

// Inimigos
export const INIMIGOS = {
    resistor: {
        nome: "Resistor queimado",
        vida: 30,
        velocidade: 8,
        dano: 5,
        intervaloAtaque: 1.5,
        tamanho: 6,
        raio: 3,
        reducaoDano: 0,       // fração do dano bloqueada pelo escudo
        moedas: 5,
        pontos: 10
    },

    capacitor: {
        nome: "Capacitor sobrecarregado",
        vida: 70,
        velocidade: 5,
        dano: 10,
        intervaloAtaque: 2.0,
        tamanho: 7,
        raio: 3.5,
        reducaoDano: 0,
        moedas: 10,
        pontos: 25,
        // Descarga liberada quando morre
        descargaRaio: 8,
        descargaDano: 8
    },

    indutor: {
        nome: "Indutor saturado",
        vida: 110,
        velocidade: 6,
        dano: 4,
        intervaloAtaque: 1.5,
        tamanho: 7,
        raio: 3.5,
        reducaoDano: 0.3,     // 30% de redução, vale pra tudo
        moedas: 12,
        pontos: 30
    },

    diodo: {
        nome: "Diodo invertido",
        vida: 15,
        velocidade: 14,
        dano: 4,
        intervaloAtaque: 1.0,
        tamanho: 5,
        raio: 2.5,
        reducaoDano: 0,
        moedas: 4,
        pontos: 8,
        tamanhoGrupo: 3 // Quantidade de diodos em bando
    },

    transistor: {
        nome: "Transistor em avalanche",
        vida: 600,
        velocidade: 4,
        dano: 25,
        intervaloAtaque: 2.5,
        tamanho: 12,
        raio: 6,
        reducaoDano: 0,
        moedas: 100,
        pontos: 300,
        // Mecânica de avalanche
        limiteAvalanche: 150,     // dano acumulado para disparar
        duracaoAvalanche: 3,
        velocidadeAvalanche: 12,
        danoAvalanche: 60
    }
};