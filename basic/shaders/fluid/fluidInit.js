const fluidInitFrag = noise + `

uniform float seed;
uniform vec2 res;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
	float n0 = seed + 12.3;
	float n1 = seed + 123.4;
	float n2 = seed + 1234.5;

	vec2 v0 = vUv * res / 1111.5;
	vec2 v1 = vUv * res / 1124.0;
	vec2 v2 = vUv * res / 1136.0;

	float nr = (v3n1(vec3(v0, n0)) + v3n1(vec3(v1, n1)) + v3n1(vec3(v2, n2)));
	float ng = (v3n1(vec3(v0, n1)) + v3n1(vec3(v1, n2)) + v3n1(vec3(v2, n0)));

	gl_FragColor = vec4(nr, ng, 0.0, 1.0);
}
`