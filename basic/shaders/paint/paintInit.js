const paintInitFrag = noise + `
uniform float seed;
uniform vec2 res;
varying vec2 vUv;
varying vec3 vNormal;

void main() {

	float n0 = seed + 12.3;
	float n1 = seed + 123.4;
	float n2 = seed + 1234.5;

	vec2 v0 = vUv * res / 1234.5;
	vec2 v1 = vUv * res / 2345.0;
	vec2 v2 = vUv * res / 3456.0;

	float nr = v3n1(vec3(v0, n0)) + v3n1(vec3(v1, n2)) + v3n1(vec3(v2, n1));
	float ng = v3n1(vec3(v1, n1)) + v3n1(vec3(v2, n0)) + v3n1(vec3(v0, n2));
	float nb = v3n1(vec3(v2, n2)) + v3n1(vec3(v0, n1)) + v3n1(vec3(v1, n0));
	vec4 color = vUv.x < 0.5 ? vec4(1.0, 0.2, 0.0, 1.0) : vec4(0.0, 0.5, 1.0, 1.0);
	color.rgb += vec3(nr, ng, nb);
	gl_FragColor = color;
}
`