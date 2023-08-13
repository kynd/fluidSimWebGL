const divergeFrag = `
uniform vec2 res;
uniform float speed;
uniform sampler2D tex;
varying vec2 vUv;
varying vec3 vNormal;

vec2 wrap(vec2 v) {
    return vec2(fract(v.x), fract(v.y));
}

vec2 u(vec2 coord) {
    return texture(tex, wrap(coord)).xy;
}

void main()
{
    float rho = 1.0;
    float deltaT = 1.0 / 60.0;
    vec3 px = vec3(1.0 / res.x, 1.0 / res.y, 0.0) * speed;

    float divergent = 
        (-px.x * rho / deltaT) * 
        (u(vUv + px.xz).x -
         u(vUv - px.xz).x)
        +
        (-px.y * rho / deltaT) * 
        (u(vUv + px.zy).y -
         u(vUv - px.zy).y);

    gl_FragColor = vec4(divergent + 0.5 , 0.0, 0.0, 1.0);
}`
