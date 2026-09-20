# CURTO-CIRCUITO

Jogo de defesa de torre 2D desenvolvido com JavaScript, WebGL2 e GLSL para a disciplina de Computação Gráfica.

- **Jogo:** https://guili-lopes.github.io/Trabalho-Pratico-1-CG-Tower-Defense/

## O Jogo

Uma placa eletrônica sofreu um curto-circuito. Depois da falha, seus componentes se voltaram contra o núcleo principal da placa, um PIC localizado no centro do circuito.

Resistores queimados, capacitores sobrecarregados, indutores saturados, diodos invertidos e um transistor em avalanche avançam em direção ao PIC para destruí-lo.

O jogador representa o técnico responsável pela manutenção da placa. Enquanto o PIC se defende automaticamente disparando pulsos de PWM, o jogador utiliza um ferro de solda para clicar nos inimigos e causar dano adicional.

### Objetivo

Proteger o PIC durante cinco ondas de inimigos, comprar melhorias entre as ondas e derrotar o transistor em avalanche da última onda.

Depois de derrotar o chefe, o jogador poderá:

- encerrar a partida com vitória; ou
- continuar no modo infinito, enfrentando ondas progressivamente mais difíceis.

A partida termina em derrota quando a vida do PIC chega a zero. Nesse momento, o PIC explode e é substituído pela sua versão destruída, e o jogo exibe a tela de *game over* sobre uma imagem da placa queimada.

### O mundo do jogo

A câmera é fixa e o jogo acontece em uma única placa de circuito, com razão de aspecto 4:3. O sistema de coordenadas do mundo tem origem no centro da placa, onde fica o PIC, com 100 unidades de largura por 75 de altura.

Os inimigos surgem em pontos aleatórios fora das bordas da tela e caminham em linha reta até o PIC.

### O PIC

O PIC é a torre central do jogo. Ele permanece no centro da placa e ataca automaticamente o inimigo mais próximo que estiver dentro do seu alcance, que é exibido na tela como um círculo. Seus projéteis são pulsos de PWM: a direção do disparo é travada no momento do tiro e o pulso desaparece ao acertar o primeiro inimigo.

| Atributo | Valor inicial |
|---|---|
| Vida | 100 |
| Alcance | 22 unidades |
| Dano por pulso | 10 |
| Cadência de disparo | 1,5 disparos por segundo |
| Velocidade do pulso | 60 unidades por segundo |

### O jogador

O jogador é representado por um ferro de solda, que substitui o cursor do mouse.

Ao clicar sobre um inimigo, o jogador realiza uma "solda" e causa dano direto. O clique atinge apenas o inimigo que estiver à frente e possui um tempo de recarga, para que o jogo não se resuma a clicar o mais rápido possível.

| Atributo | Valor inicial |
|---|---|
| Dano do clique | 12 |
| Tempo de recarga | 0,4 segundo |

### Inimigos

| Inimigo | Vida | Velocidade | Dano | Intervalo de ataque | Moedas | Pontos |
|---|---|---|---|---|---|---|
| Resistor queimado | 30 | 8 | 5 | 1,5 s | 5 | 10 |
| Capacitor sobrecarregado | 70 | 5 | 10 | 2,0 s | 10 | 25 |
| Indutor saturado | 110 | 6 | 4 | 1,5 s | 12 | 30 |
| Diodo invertido | 15 | 14 | 4 | 1,0 s | 4 | 8 |
| Transistor em avalanche | 600 | 4 | 25 | 2,5 s | 100 | 300 |

Ao alcançar o PIC, o inimigo para de andar e passa a atacar em intervalos regulares até ser destruído. Todo inimigo derrotado exibe uma animação de explosão.

**Resistor queimado.** Inimigo básico, com vida, velocidade e dano equilibrados. Aparece desde a primeira onda.

**Capacitor sobrecarregado.** Mais resistente e lento, causa dano relevante ao alcançar o PIC. Ao ser derrotado, libera uma descarga em área que atinge o PIC caso ele esteja dentro do raio, o que torna arriscado destruí-lo muito perto do centro.

**Indutor saturado.** Vida elevada e velocidade média. Possui um escudo que reduz em 30% todo o dano recebido, tanto dos pulsos do PIC quanto dos cliques do ferro de solda, mas causa menos dano ao PIC do que outros inimigos de porte semelhante.

**Diodo invertido.** Rápido e com pouca vida. Surge sempre em grupos, com todos os integrantes do grupo entrando pelo mesmo ponto da borda.

**Transistor em avalanche.** Chefe da quinta onda. É maior, mais resistente e visualmente diferente dos inimigos comuns. Sua mecânica própria é a avalanche: ele acumula o dano que recebe e, ao passar de um limite, entra por alguns segundos em um estado em que se move muito mais rápido e o próximo golpe contra o PIC é devastador. Enquanto está nesse estado, seu sprite muda para a versão sobrecarregada. Depois disso o acúmulo é zerado e ele volta ao comportamento normal.

### Melhorias

No intervalo entre ondas, o jogo sorteia três cartões de melhoria entre aquelas que ainda não chegaram ao nível máximo. O jogador compra quantas conseguir pagar entre as três oferecidas e depois escolhe quando iniciar a onda seguinte. As moedas que sobrarem permanecem para os próximos intervalos.

Cada melhoria pode ser adquirida até três vezes e os bônus percentuais são aditivos.

| Melhoria | Preço | Efeito |
|---|---|---|
| **Resistor** | 50 | Reduz o dano recebido pelo PIC em 5% por nível, chegando a 15%. |
| **Capacitor** | 60 | Aumenta o dano do PIC em 5% por nível, chegando a 15%. A partir da primeira compra, a cada 10 disparos o PIC libera uma descarga em área, também afetada pelo bônus de dano. |
| **Indutor** | 55 | Cria um campo ao redor do PIC. A cada nível, o campo aumenta de tamanho e reduz a velocidade dos inimigos em mais 3%, chegando a 9%. |
| **Diodo** | 70 | Bloqueia periodicamente um ataque recebido pelo PIC. O intervalo de recarga diminui a cada nível: 20 s, 14 s e 8 s. |
| **Transistor** | 65 | Aumenta a cadência de disparo e a velocidade dos pulsos em 7% por nível, chegando a 21%. |
| **Ferro de solda** | 40 | Aumenta o dano causado pelos cliques em 5% por nível, chegando a 15%. |

Os cartões da loja mostram os componentes em estado íntegro, em contraste com as versões queimadas e sobrecarregadas que aparecem como inimigos.

### Ondas

O jogo possui cinco ondas principais, com composição cumulativa:

| Onda | Composição |
|---|---|
| 1 | 8 resistores queimados |
| 2 | 8 resistores, 4 capacitores sobrecarregados |
| 3 | 10 resistores, 5 capacitores, 3 indutores saturados |
| 4 | 12 resistores, 6 capacitores, 4 indutores, 2 grupos de diodos invertidos |
| 5 | 14 resistores, 7 capacitores, 5 indutores, 3 grupos de diodos, 1 transistor em avalanche |

O intervalo entre os surgimentos diminui ao longo de cada onda, o que aumenta a tensão conforme ela avança. A onda termina quando o último inimigo é derrotado, e a onda seguinte só começa quando o jogador decide iniciá-la.

No modo infinito, a quantidade de inimigos e seus atributos recebem multiplicadores progressivos de dificuldade, e um novo chefe aparece a cada cinco ondas.

### Pontuação e moedas

O jogo utiliza dois valores separados:

- **pontuação:** representa o desempenho total e nunca diminui. É formada pelos pontos de cada inimigo derrotado, somados a um bônus por onda concluída;
- **moedas:** recebidas ao derrotar inimigos e gastas nas melhorias durante os intervalos entre ondas.

### Telas

O jogo é composto pelas telas de menu inicial, jogo, loja de melhorias, *game over*, vitória, créditos e opções, esta última contendo o tutorial.

### Controles

| Ação | Controle |
|---|---|
| Soldar um inimigo | Clique do mouse sobre o inimigo |
| Comprar melhoria | Clique no cartão da melhoria |
| Pausar ou continuar | P |
| Alternar tela cheia | F |
| Reiniciar a partida | R |
| Ativar ou desativar o som | M |

### Tecnologias

- HTML;
- CSS;
- JavaScript;
- WebGL2;
- GLSL;
- GitHub Pages.

### Checklist dos itens obrigatórios

- [x] Torre que atira.
- [x] Condição de derrota com mensagem de *game over*.
- [x] Inimigos surgindo, andando, atacando a torre e sendo derrotados.
- [x] Clique "dedada" nos inimigos, representado pelo ferro de solda.
- [x] HUD com vida do PIC e pontuação.
- [x] Loop de reinício do jogo.
- [x] Uso de texturas.

## Criador

- **Nome:** Guilherme Lourenço Lopes
- **GitHub:** [Guili-Lopes](https://github.com/Guili-Lopes)
- **Contato:** guilhermellopes2004@gmail.com

## Screenshots


## Opcionais

Os itens abaixo foram escolhidos para o projeto. Aqueles marcados com `[x]` é aquilo que está funcionando na versão publicada.

- [ ] **Texturas animadas:** você pode criar animações de personagens ou cenário. Por exemplo, para inimigo andando, atacando... uma explosão, para os projéteis etc.

- [ ] **Efeitos de partículas** para simular explosão, faíscas etc.

- [ ] **Telas:** faça um jogo completo, ou seja, implemente telas de *splash screen*, menu inicial, créditos, opções, *game over*, etc.

- [ ] **Sons:** Colocar efeitos sonoros e música de fundo no seu jogo.

- [ ] **Tela cheia:** faça com que seja possível colocar em tela cheia e que a razão de aspecto do jogo seja sempre mantida, independente das dimensões da janela (*windowed* ou *full screen*), mas que o jogo ocupe a maior área possível da janela e ficando centralizado.

- [ ] **Trailer:** em vez de um vídeo simples, faça um vídeo mais rebuscado e chamativo, potencialmente um pouco maior, com um pouco de edição.

- [x] **Inimigos diferentes:** faça inimigos visual e mecanicamente diferentes, como com velocidades distintas, frequência de ataque, dano etc.

- [x] **Inimigos em ondas:** crie o conceito de ondas de inimigos (fases) para que o jogador possa conciliar momentos de maior tensão ou maior relaxamento (no intervalinho entre ondas). As ondas podem ser "fases curadas" e finitas, ou infinitas (com aumento de dificuldade).

- [x] **Progressão da torre:** permita ao jogador melhorar a(s) torre(s) eventualmente, por exemplo, aumentando sua cadência, ou seu alcance, ou seu dano etc. Uma estratégia interessante é a adotada por jogos "roguelike" ou "roguelite", que é a ideia de oferecer umas 3x opções de *upgrade* aleatórios ao jogador cada vez que ele tiver a oportunidade de melhorar uma torre.

- [x] **Moedas:** crie uma moeda que o jogador adquire, de alguma forma, e que pode ser usada para: (a) melhorias na(s) torre(s), ou (b) criar novas torres, ou (c) para melhorias do herói, ou para outro motivo interessante.

## Créditos

### Desenvolvimento

- Programação e design do jogo: Guilherme Lourenço Lopes.

### Recursos de terceiros

| Recurso | Autor | Link | Licença |
|---|---|---|---|
| Textura da placa, PIC, inimigos, chefe, ícones de melhoria, ferro de solda, moeda, efeitos e demais sprites | Gerados com ChatGPT (OpenAI) e processados manualmente por Guilherme Lopes | https://chatgpt.com | — |
| Sprites de explosão | CraftPix.net | https://craftpix.net/freebies/11-free-pixel-art-explosion-sprites/ | CraftPix Freebie License (uso livre em projetos pessoais e comerciais; atribuição não exigida, mas fornecida) |
| Música de fundo | A definir | A definir | A definir |
| Efeitos sonoros | A definir | A definir | A definir |
| Fonte tipográfica | A definir | A definir | A definir |
