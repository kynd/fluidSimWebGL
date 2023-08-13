const advectFrag = `
uniform vec2 res;
uniform float speed;
uniform sampler2D tex;
varying vec2 vUv;
varying vec3 vNormal;

vec2 wrap(vec2 v) {
    return vec2(fract(v.x), fract(v.y));
}

void main()
{
    vec2 vel = texture(tex, wrap(vUv)).xy;
    vec4 color = texture(tex, wrap(vUv + vel * speed / res));
    gl_FragColor = color;
}`