#version 300 es

precision mediump float;

in vec2 v_texCoord;

uniform sampler2D u_textura;
uniform float u_alpha;
uniform float u_flash;

out vec4 fragColor;

void main() {
  vec4 corTextura = texture(u_textura, v_texCoord);

  vec3 corFinal = mix(
    corTextura.rgb,
    vec3(1.0),
    u_flash
  );

  fragColor = vec4(
    corFinal,
    corTextura.a * u_alpha
  );
}