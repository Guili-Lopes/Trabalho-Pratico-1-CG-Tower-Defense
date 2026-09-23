const musica = new Audio("assets/audio/musica-fundo.ogg");

const sons = {
  tiro: new Audio("assets/audio/pic-atirando.ogg"),
  solda: new Audio("assets/audio/ferro-de-solda-clique.ogg"),
  morte: new Audio("assets/audio/inimigo-morrendo.ogg"),
  danoPic: new Audio("assets/audio/dano-no-pic.ogg"),
  descarga: new Audio("assets/audio/descarga.ogg"),
  compra: new Audio("assets/audio/compra-melhoria.ogg"),
  onda: new Audio("assets/audio/inicio-onda.ogg"),
  derrota: new Audio("assets/audio/game-over.ogg"),
  vitoria: new Audio("assets/audio/vitoria.ogg")
};

sons.tiro.volume = 0.30;
sons.morte.volume = 0.40;
sons.solda.volume = 0.50;
sons.danoPic.volume = 0.65;
sons.descarga.volume = 1.0;
sons.compra.volume = 0.60;
sons.onda.volume = 0.70;
sons.derrota.volume = 1.0;
sons.vitoria.volume = 1.0;

musica.loop = true;
musica.volume = 1.0;

let mudo = false;
let musicaLiberada = false;

export function tocaSom(nome) {
  if (mudo) {
    return;
  }

  const som = sons[nome];

  if (!som) {
    return;
  }

  som.currentTime = 0;

  som.play().catch(() => {});
}

export function iniciaMusica() {
  musicaLiberada = true;

  if (mudo) {
    return;
  }

  musica.play().catch(() => {});
}

export function alternaMudo() {
  mudo = !mudo;

  if (mudo) {
    musica.pause();
  } else if (musicaLiberada) {
    musica.play().catch(() => {});
  }

  return mudo;
}

export function estaMudo() {
  return mudo;
}