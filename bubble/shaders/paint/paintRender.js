const paintRenderFrag = `
varying vec2 vUv;
varying vec3 vNormal;
uniform vec2 res;
uniform sampler2D tex;
uniform sampler2D velocity;

vec2 wrap(vec2 v) {
  return vec2(fract(v.x), fract(v.y));
}

void main( void ) {
  vec3 px = vec3(1.0 / res.x, 1.0 / res.y, 0.0);
  vec4 pu = texture(tex, wrap(vUv + px.yz));
  vec4 p = texture(tex, vUv);
  vec4 vu = texture(velocity, wrap(vUv + px.yz));
  vec4 v = texture(velocity, vUv);
  float d0 = (v.r + v.g + v.b) - (vu.r + vu.g + vu.b);
  float d1 = (v.r + v.g + v.b);// - (vu.r + vu.g + vu.b);

  vec4 color = p;
  /*
  color.r += p.r - pu.r;
  color.g += p.g - pu.g;
  color.b += p.b - pu.b;
  */
  color.rgb += d0 * 1.0;
  color.rgb *= (1.0 + d1 * 1.0);
  //color.rgb *= color.rgb;
  gl_FragColor = color;
}`;
