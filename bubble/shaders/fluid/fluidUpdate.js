const fluidUpdateFrag = `
uniform vec2 res;
uniform float speed;
uniform sampler2D pressure;
uniform sampler2D advection;

varying vec2 vUv;
varying vec3 vNormal;

vec2 wrap(vec2 v) {
    return vec2(fract(v.x), fract(v.y));
}

float p(vec2 coord) {
    return texture(pressure, wrap(coord)).x;
}

void main()
{
    float deltaT = 1.0 / 60.0;
    float rho = 1.0;
    vec3 px = vec3(1.0 / res.x, 1.0 / res.y, 0.0) * speed;
    vec4 u_a = texture(advection, vUv);
    
    float diff_p_x = (p(vUv + px.xz) - p(vUv - px.xz));
    float u_x = u_a.x - deltaT / (2.0 * rho * px.x) * diff_p_x;
    float diff_p_y = (p(vUv + px.zy) - p(vUv - px.zy));
    float u_y = u_a.y - deltaT / (2.0 * rho * px.y) * diff_p_y;
    u_a = vec4(vec2(u_x, u_y) * 1.0, 0.0, 1.0);

    //u_a.x -= (1.0 - smoothstep(0.0, 0.01, abs(vUv.y - 0.5))) * 0.01;

    gl_FragColor = u_a;
}
`
