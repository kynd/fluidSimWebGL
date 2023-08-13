const paintRenderFrag = `
varying vec2 vUv;
varying vec3 vNormal;
uniform vec2 res;
uniform sampler2D tex;

vec2 wrap(vec2 v) {
  return vec2(fract(v.x), fract(v.y));
}

void main( void ) {
  vec3 px = vec3(1.0 / res.x, 1.0 / res.y, 0.0);
  vec4 pu = texture(tex, vUv);
  vec4 p = texture(tex, wrap(vUv + px.yz));
  //float d = (p.r + p.g + p.b) - (pu.r + pu.g + pu.b);

  vec4 color = p;
  color.r += p.r - pu.r;
  color.g += p.g - pu.g;
  color.b += p.b - pu.b;

  gl_FragColor = color;
}`;
