#version 300 es

in vec2 a_posicao;
in vec2 a_texCoord;

uniform mat4 u_projecao;
uniform mat4 u_modelo;

out vec2 v_texCoord;

void main() {
  v_texCoord = a_texCoord;

  gl_Position = u_projecao * u_modelo * vec4(a_posicao, 0.0, 1.0);
}