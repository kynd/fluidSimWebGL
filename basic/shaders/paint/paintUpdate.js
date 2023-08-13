const paintUpdateFrag = `
uniform vec2 res;
uniform float speed;
uniform sampler2D tex;
uniform sampler2D velocity;

varying vec2 vUv;
varying vec3 vNormal;

vec2 wrap(vec2 v) {
    return vec2(fract(v.x), fract(v.y));
}

void main()
{
    vec3 px = vec3(1.0 / res.x, 1.0 / res.y, 0.0) * speed;
    vec4 v = texture(velocity, vUv);
    vec4 p = texture(tex, wrap(vUv + px.xy * v.xy));

    gl_FragColor = p;
}
`
