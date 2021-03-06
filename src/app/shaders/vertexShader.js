export const vertexShader = `
attribute vec2 coordinates;
varying vec2 texCoord;

void main(void){
	texCoord = (coordinates/2.0 + 0.5);
	gl_Position = vec4(coordinates, 1.0, 1.0);
}
`;