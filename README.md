# CURTO-CIRCUITO

Jogo de defesa de torre 2D desenvolvido com JavaScript, WebGL2 e GLSL para a disciplina de Computação Gráfica.

> **Status:** projeto em desenvolvimento. Os itens marcados como planejados devem ser atualizados conforme forem realmente implementados.

## O Jogo

### Lore

Uma placa eletrônica sofreu um curto-circuito. Depois da falha, seus componentes se voltaram contra o núcleo principal da placa, um PIC localizado no centro do circuito.

Resistores queimados, capacitores sobrecarregados, indutores saturados, diodos invertidos e um transistor em avalanche avançam em direção ao PIC para destruí-lo.

O jogador representa o técnico ou engenheiro responsável pela manutenção da placa. Enquanto o PIC se defende automaticamente disparando pulsos de PWM, o jogador utiliza um ferro de solda para clicar nos inimigos e causar dano adicional.

### Objetivo

O objetivo é proteger o PIC durante cinco ondas de inimigos, melhorar suas capacidades e derrotar o transistor em avalanche da última onda.

Depois de derrotar o chefe, o jogador poderá:

- encerrar a partida com vitória; ou
- continuar no modo infinito, enfrentando ondas progressivamente mais difíceis.

A partida termina em derrota quando a vida do PIC chega a zero.

### O PIC

O PIC é a torre central do jogo. Ele permanece no centro da placa e ataca automaticamente o inimigo mais próximo que estiver dentro do seu alcance.

Seus projéteis são representados por pulsos de PWM. O PIC possui:

- vida;
- alcance;
- dano;
- cadência de disparo;
- velocidade de projétil;
- melhorias adquiridas durante a partida.

### O jogador

O jogador é representado por um ferro de solda.

Ao clicar sobre um inimigo, o jogador realiza uma “solda” e causa dano direto. O dano inicial do ferro de solda poderá ser melhorado durante a partida.

### Melhorias

Cada melhoria poderá ser adquirida até três vezes. Os custos serão pagos com moedas recebidas ao derrotar inimigos. Valores de preço, dano, vida e outros atributos poderão ser ajustados durante o balanceamento.

| Melhoria | Efeito |
|---|---|
| **Resistor** | Reduz o dano recebido pelo PIC em 5% por nível, chegando a 15%. |
| **Capacitor** | Aumenta o dano do PIC em 5% por nível, chegando a 15%. A cada 10 disparos, o PIC libera uma descarga em área. O bônus também afeta essa descarga. |
| **Indutor** | Cria um campo ao redor do PIC. A cada nível, o campo aumenta de tamanho e reduz a velocidade dos inimigos em mais 3%, chegando a 9%. |
| **Diodo** | Bloqueia periodicamente um ataque recebido pelo PIC. Cada nível diminui o intervalo de recarga, chegando inicialmente a 8 segundos no nível máximo. |
| **Transistor** | Aumenta a cadência de disparo e a velocidade dos pulsos em 7% por nível, chegando a 21%. |
| **Ferro de solda** | Aumenta o dano causado pelos cliques em 5% por nível, chegando a 15%. |

### Inimigos

#### Resistor queimado

Inimigo básico, com vida, velocidade e dano equilibrados. Aparece desde a primeira onda.

#### Capacitor sobrecarregado

Inimigo mais resistente e lento. Possui mais vida e causa dano relevante ao alcançar o PIC. Não libera descarga ao ser derrotado.

#### Indutor saturado

Inimigo de vida elevada e velocidade baixa ou média. Possui um escudo que reduz parte do dano recebido, mas causa menos dano ao PIC do que outros inimigos de porte semelhante.

#### Diodo invertido

Inimigo rápido, com pouca vida, que costuma aparecer em grupos.

#### Transistor em avalanche

Chefe da quinta onda. É maior, mais resistente, mais agressivo e visualmente diferente dos inimigos comuns.

### Ondas

O jogo possui cinco ondas principais:

1. **Onda 1:** resistores queimados.
2. **Onda 2:** resistores queimados e capacitores sobrecarregados.
3. **Onda 3:** resistores, capacitores e indutores saturados.
4. **Onda 4:** resistores, capacitores, indutores e diodos invertidos.
5. **Onda 5:** todos os inimigos anteriores e o transistor em avalanche.

No modo infinito, a quantidade de inimigos aumenta, o intervalo entre surgimentos diminui e os atributos podem receber pequenos multiplicadores de dificuldade. Um novo chefe poderá aparecer periodicamente.

### Pontuação e moedas

Cada inimigo derrotado concede uma recompensa de acordo com o seu tipo.

O jogo utiliza dois valores separados:

- **pontuação:** representa o desempenho total e nunca diminui;
- **moedas:** são gastas para comprar melhorias entre as ondas.

### Controles

| Ação | Controle |
|---|---|
| Soldar um inimigo | Clique do mouse sobre o inimigo |
| Pausar ou continuar | P |
| Alternar tela cheia | Esc |
| Comprar melhoria | Clique no cartão da melhoria |

### Tecnologias

- HTML;
- CSS;
- JavaScript;
- WebGL2;
- GLSL;
- GitHub Pages.

### Checklist dos itens obrigatórios

- [ ] Torre que atira.
- [ ] Condição de derrota com mensagem de *game over*.
- [ ] Inimigos surgindo, andando, atacando a torre e sendo derrotados.
- [ ] Clique “dedada” nos inimigos, representado pelo ferro de solda.
- [ ] HUD com vida do PIC e pontuação.
- [ ] Loop de reinício do jogo.
- [ ] Uso de texturas.

## Criador(es)

- **Nome:** Guilherme Lourenço Lopes e David Lanza Melo Matos
- **GitHub:** [preencher]

## Screenshots


## Opcionais

Os itens abaixo foram escolhidos para o projeto. Aqueles marcados com `[x]` é aquilo que está funcionando na versão publicada.

- [ ] **Texturas animadas:** você pode criar animações de personagens ou cenário. Por exemplo, para inimigo andando, atacando... uma explosão, para os projéteis etc.

- [ ] **Efeitos de partículas:** para simular explosão, faíscas etc.

- [ ] **Telas:** faça um jogo completo, ou seja, implemente telas de *splash screen*, menu inicial, créditos, opções, *game over*, etc.

- [ ] **Tela cheia:** faça com que seja possível colocar em tela cheia e que a razão de aspecto do jogo seja sempre mantida, independente das dimensões da janela (*windowed* ou *full screen*), mas que o jogo ocupe a maior área possível da janela e ficando centralizado.

- [ ] **Inimigos diferentes:** faça inimigos visual e mecanicamente diferentes, como com velocidades distintas, frequência de ataque, dano etc.

- [ ] **Inimigos em ondas:** crie o conceito de ondas de inimigos (fases) para que o jogador possa conciliar momentos de maior tensão ou maior relaxamento (no intervalinho entre ondas). As ondas podem ser “fases curadas” e finitas, ou infinitas (com aumento de dificuldade).

- [ ] **Colisão entre inimigos:** tome o cuidado para evitar que “um inimigo entre no outro”, verificando se estão colidindo ao atualizar suas posições.

- [ ] **Progressão da torre:** permita ao jogador melhorar a(s) torre(s) eventualmente, por exemplo, aumentando sua cadência, ou seu alcance, ou seu dano etc. Uma estratégia interessante é a adotada por jogos “roguelike” ou “roguelite”, que é a ideia de oferecer umas 3x opções de *upgrade* aleatórios ao jogador cada vez que ele tiver a oportunidade de melhorar uma torre.

- [ ] **Moedas:** crie uma moeda que o jogador adquire, de alguma forma, e que pode ser usada para: (a) melhorias na(s) torre(s), ou (b) criar novas torres, ou (c) para melhorias do herói, ou para outro motivo interessante.

## Créditos

### Desenvolvimento

- Programação e design do jogo: Guilherme Lopes e David Lanza.

### Recursos de terceiros

Preencher esta seção antes da entrega com o nome do autor e o link original de cada recurso utilizado.

| Recurso | Autor | Link | Licença |
|---|---|---|---|
| Textura da placa | A definir | A definir | A definir |
| Sprites do PIC | A definir | A definir | A definir |
| Sprites dos inimigos | A definir | A definir | A definir |
| Efeitos de partículas | A definir | A definir | A definir |
| Música de fundo | A definir | A definir | A definir |
| Efeitos sonoros | A definir | A definir | A definir |
| Fonte tipográfica | A definir | A definir | A definir |