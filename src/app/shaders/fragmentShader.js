export const fragmentShader = `
precision mediump float;
uniform sampler2D u_image;
varying vec2 texCoord;
uniform vec2 onePixel;
uniform bool doStep;

vec2 getCoords(vec2 coord, vec2 offset){
	return mod(coord + onePixel * offset, 1.0);
}

float a = 0.0;
float sum = 0.0;

void main(void){
	if(doStep){
		float r = texture2D(u_image, texCoord).r;
		float g = texture2D(u_image, texCoord).g;
		float b = texture2D(u_image, texCoord).b;
		float a = texture2D(u_image, texCoord).a;
		float sum = r + g + b;

		float bR = texture2D(u_image, getCoords(texCoord, vec2(0.0, -1.0))).r;
		float bG = texture2D(u_image, getCoords(texCoord, vec2(0.0, -1.0))).g;
		float bB = texture2D(u_image, getCoords(texCoord, vec2(0.0, -1.0))).b;
		float bSum = bR + bG + bB;

		float lR = texture2D(u_image, getCoords(texCoord, vec2(-1.0, 0.0))).r;
		float lG = texture2D(u_image, getCoords(texCoord, vec2(-1.0, 0.0))).g;
		float lB = texture2D(u_image, getCoords(texCoord, vec2(-1.0, 0.0))).b;
		float lSum = lR + lG + lB;

		float rR = texture2D(u_image, getCoords(texCoord, vec2(1.0, 0.0))).r;
		float rG = texture2D(u_image, getCoords(texCoord, vec2(1.0, 0.0))).g;
		float rB = texture2D(u_image, getCoords(texCoord, vec2(1.0, 0.0))).b;
		float rSum = rR + rG + rB;

		float tR = texture2D(u_image, getCoords(texCoord, vec2(0.0, 1.0))).r;
		float tG = texture2D(u_image, getCoords(texCoord, vec2(0.0, 1.0))).g;
		float tB = texture2D(u_image, getCoords(texCoord, vec2(0.0, 1.0))).b;
		float tSum = tR + tG + tB;

		if ((3.0 - bSum) < 0.001) { // White below
			if (sum < 0.001) { // Go white
				gl_FragColor = vec4(255.0, 255.0, 255.0, 1.0);
			} else { // Combine
				float newR = (r + bR) / 2.;
				float newG = (g + bG) / 2.;
				float newB = (b + bB) / 2.;
				gl_FragColor = vec4(newR, newG, 255.0, 1.0);
			}
		} else if ((3.0 - sum) < 0.001) { // Go black fom white
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		} else {
			float newR = r;
			float newG = g;
			float newB = b;

			float diffLB = 1.0 - lB;
			if ((diffLB > 0.001) && (diffLB < 0.45)) { // Blue goes left
				newB = (lB + b) / 2.;
			}
			float diffRR = 1.0 - rR;
			if ((diffRR > 0.001) && (diffRR < 0.45)) { // Red goes left
				newR = (rR + r) / 2.;
			}
			float diffTG = 1.0 - tG;
			if ((diffTG > 0.001) && (diffTG < 0.45)) { // Red goes left
				newG = (tG + g) / 2.;
			}
			gl_FragColor = vec4(newR, newG, newB, 1.0);
		}
	} else {
		gl_FragColor = texture2D(u_image, texCoord).rgba;
	}
}
`;
