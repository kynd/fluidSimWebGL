const fluidRenderFrag = `
varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D tex;

void main( void ) {
  gl_FragColor = texture(tex, vUv);
}`;
