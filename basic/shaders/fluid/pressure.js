
const pressureFrag = noise + `
uniform vec2 res;
uniform float speed;
uniform sampler2D tex;
uniform sampler2D divergence;

varying vec2 vUv;
varying vec3 vNormal;

vec2 wrap(vec2 v) {
    return vec2(fract(v.x), fract(v.y));
}

float d(vec2 coord) {
    return texture(divergence, wrap(coord)).x;
}

float p(vec2 coord) {
    return texture(tex, wrap(coord)).x;
}

void main() {
    vec3 px = vec3(1.0 / res.x, 1.0 / res.y, 0.0) * speed;

    float pressure = 0.25 * (d(vUv)
    + p(vUv + px.xz)
    + p(vUv - px.xz)
    + p(vUv + px.zy)
    + p(vUv - px.zy)
    );

    gl_FragColor = vec4(vec3(pressure), 1.0);
}
`

