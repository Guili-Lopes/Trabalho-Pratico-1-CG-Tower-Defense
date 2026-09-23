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
    dano: 13,
    cadencia: 1.6,           
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
        moedas: 6,
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
        moedas: 12,
        pontos: 25,
        // Descarga liberada quando morre
        descargaRaio: 8,
        descargaDano: 8
    },

    indutor: {
        nome: "Indutor saturado",
        vida: 80,
        velocidade: 5.5,
        dano: 4,
        intervaloAtaque: 1.5,
        tamanho: 7,
        raio: 3.5,
        reducaoDano: 0.2,     // 20% de redução, vale pra tudo
        moedas: 16,
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
        moedas: 6,
        pontos: 8,
        tamanhoGrupo: 3 // Quantidade de diodos em bando
    },

    transistor: {
        nome: "Transistor em avalanche",
        vida: 450,
        velocidade: 4,
        dano: 25,
        intervaloAtaque: 2.5,
        tamanho: 12,
        raio: 6,
        reducaoDano: 0,
        moedas: 1000,
        pontos: 300,
        // Mecânica de avalanche
        limiteAvalanche: 150,     // dano acumulado para disparar
        duracaoAvalanche: 3,
        velocidadeAvalanche: 12,
        danoAvalanche: 40
    }
};

// Ondas
export const ONDAS = [
  // Onda 1
  [
    {
      resistor: 4
    },

    {
      resistor: 4
    }
  ],

  // Onda 2
  [
    {
      resistor: 5,
      capacitor: 1
    },

    {
      resistor: 3,
      capacitor: 3
    }
  ],

  // Onda 3
  [
    {
      resistor: 4,
      capacitor: 1
    },

    {
      resistor: 3,
      capacitor: 2,
      indutor: 1
    },

    {
      resistor: 2,
      capacitor: 1,
      indutor: 1
    }
  ],

  // Onda 4
  [
    {
      resistor: 5,
      capacitor: 2
    },

    {
      resistor: 4,
      capacitor: 2,
      indutor: 1,
      diodo: 1
    },

    {
      resistor: 3,
      capacitor: 2,
      indutor: 3,
      diodo: 1
    }
  ],

  // Onda 5
  [
    {
      resistor: 5,
      capacitor: 2
    },

    {
      resistor: 4,
      capacitor: 2,
      indutor: 1,
      diodo: 1
    },

    {
      resistor: 3,
      capacitor: 2,
      indutor: 2,
      diodo: 1
    },

    {
      resistor: 2,
      capacitor: 1,
      indutor: 2,
      diodo: 1
    },
    
    {
      transistor: 1
    }
  ]
];

export const RITMO = {
  intervaloInicial: 2.0,
  intervaloFinal: 1.0
};

// Melhorias
export const MELHORIAS = {
  resistor: {
    nome: "Resistor",
    descricao: "Reduz o dano recebido pelo PIC em 8% por nível, chegando a 24%",
    preco: 40,
    nivelMaximo: 3
  },

  capacitor: {
    nome: "Capacitor",
    descricao: "Aumenta o dano do PIC em 13% por nível, chegando a 39%. A cada 10 disparos, libera uma descarga em área",
    preco: 45,
    nivelMaximo: 3
  },

  indutor: {
    nome: "Indutor",
    descricao: "Cria um campo ao redor do PIC que aumenta a cada nível e reduz a velocidade dos inimigos em 10% por nível, chegando a 30%",
    preco: 45,
    nivelMaximo: 3
  },

  diodo: {
    nome: "Diodo",
    descricao: "Bloqueia periodicamente um ataque recebido pelo PIC. A recarga diminui para 18 s, 12 s e 7 s",
    preco: 50,
    nivelMaximo: 3
  },

  transistor: {
    nome: "Transistor",
    descricao: "Aumenta a cadência de disparo e a velocidade dos pulsos em 12% por nível, chegando a 36%",
    preco: 45,
    nivelMaximo: 3
  },

  ferro: {
    nome: "Ferro de solda",
    descricao: "Aumenta o dano causado pelos cliques em 25% por nível, chegando a 75%",
    preco: 35,
    nivelMaximo: 3
  }
};

// Efeitos das melhorias
export const EFEITOS = {
  resistorReducao: 0.08,

  capacitorDano: 0.13,
  capacitorDescargaRaio: 14,
  capacitorDescargaDano: 15,
  capacitorDisparos: 10,

  indutorRaios: [
    0,
    24,
    30,
    36
  ],
  indutorLentidao: 0.1,

  diodoIntervalos: [
    0,
    18,
    12,
    7
  ],

  transistorBonus: 0.12,

  ferroDano: 0.25
};