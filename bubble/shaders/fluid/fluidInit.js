// Based on CellularNoise by @patriciogv
// https://thebookofshaders.com/12/

const fluidInitFrag = noise + `
uniform vec2 res;
uniform float seed;
varying vec2 vUv;
varying vec3 vNormal;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
	float n0 = seed + 12.3;
	float n1 = seed + 123.4;
	float n2 = seed + 1234.5;

	vec2 v0 = vUv * res / 1234.5;
	vec2 v1 = vUv * res / 2345.0;
	vec2 v2 = vUv * res / 3456.0;

	float nr = v3n1(vec3(v0, n0)) + v3n1(vec3(v1, n2)) + v3n1(vec3(v2, n1));
	float ng = v3n1(vec3(v1, n1)) + v3n1(vec3(v2, n0)) + v3n1(vec3(v0, n2));


    vec2 st = vUv;
    st.x *= res.x/res.y;

    st *= 3.;

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float mi_dist = 1.;
	vec2 dir;

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x),float(y));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(seed + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
			if (dist < mi_dist) {
				mi_dist = dist;
				dir = normalize(diff) * (1.0 - smoothstep(0.0, 0.5, dist)) * v3n1(vec3(point, 0.0)) * 10.0;
			}
        }
    }

	vec3 color = vec3(dir, 0.0) + vec3(nr, ng, 0.0) * 0.1;

    gl_FragColor = vec4(color,1.0);
}
`

