# falill

https://github.com/kostik1337/CHOCH
https://github.com/deathraygames/404-js13k-2020/blob/master/webpack.config.cjs
https://github.com/ElementalSystems/js13kinit/blob/master/Gruntfile.js

https://github.com/RolandR/webglife











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
		float sum = 0.0;

		sum += texture2D(u_image, getCoords(texCoord, vec2(-1.0, -1.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(0.0, -1.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(1.0, -1.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(-1.0, 1.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(0.0, 1.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(1.0, 1.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(-1.0, 0.0))).a;
		sum += texture2D(u_image, getCoords(texCoord, vec2(1.0, 0.0))).a;		

		if(a != 0.0 && (sum < 2.0 || sum > 3.0)){
			a = 0.0;
		} else if(a == 0.0 && sum == 3.0){
			a = 1.0;
		}

		gl_FragColor = vec4(r, g, b, 1.0);
	} else {
		gl_FragColor = texture2D(u_image, texCoord).rgba;
	}
}

`;








































