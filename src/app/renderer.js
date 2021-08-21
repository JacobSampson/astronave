import { fragmentShader } from "./shaders/fragmentShader";
import { vertexShader } from "./shaders/vertexShader";

class GLManager {
	constructor(gl) {
		this._gl = gl;
		this.attributes = {};

		this.shaders = [];
		this.textures = [];
	}

	get gl() {
		return this._gl;
	}

	addShader(type, source) {
		const gl = this.gl;
		const shader = gl.createShader(type);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		this.shaders.push(shader);

		return shader;
	}

	createProgram() {
		const gl = this.gl;
		const program = gl.createProgram();

		for (const shader of this.shaders) {
			gl.attachShader(program, shader); 
		}

		gl.linkProgram(program);
		gl.useProgram(program);
	
		return program;
	}

	addBuffer() {
		const gl = this.gl;
		const buffer = gl.createBuffer();

		const vertices = [
			-1.0, -1.0,
			 1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			 1.0, -1.0,
			 1.0,  1.0
		];

		this.size = Math.floor(vertices.length / 2);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		return buffer;
	}

	createTexture(width, height, world) {
		const gl = this.gl;
		const texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.gl.UNSIGNED_BYTE, world);

		return texture;
	}

	addTexture(width, height) {
		const texture = this.createTexture(width, height, null);
		const framebuffer = this.createFramebuffer(texture);

		this.textures.push({
			texture,
			framebuffer
		});

		return texture;
	}

	createFramebuffer(texture) {
		const gl = this.gl;
		const framebuffer = gl.createFramebuffer();

		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		return framebuffer;
	}
}

export class Renderer {
    constructor(canvas, world, size) {
        this.canvas = canvas;
        this.world = world;

		// Create manager
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		this.manager = new GLManager(gl);

		// Size
		const { width, height } = size;
        this.lastWidth = width;
        this.lastHeight = height;

        this._init();
    }

	_init(){
		this.bufferIndex = 0;
		this.pause = false;

		// GL setup
		const manager = this.manager;
		const gl = manager.gl;

		manager.addBuffer();
		manager.addShader(gl.VERTEX_SHADER, vertexShader);
		manager.addShader(gl.FRAGMENT_SHADER, fragmentShader);

		const program = manager.createProgram();

		// Attributes
		const coord = gl.getAttribLocation(program, "coordinates");
		gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(coord);

		manager.attributes = {
			onePixel: gl.getUniformLocation(program, "onePixel"),
			doStep: gl.getUniformLocation(program, "doStep")
		}

		// Textures
		const lastWidth = this.lastWidth;
		const lastHeight = this.lastHeight;

		this.worldTexture = manager.createTexture(lastWidth, lastHeight, this.world);
		manager.addTexture(lastWidth, lastHeight);
		manager.addTexture(lastWidth, lastHeight);
	}

	togglePause() {
		if (this.pause) {
			this.pause = false;
			this._render();
			return;
		}

		this.pause = true;
	}

	render() {
		const manager = this.manager;
		const { gl, attributes } = manager;
		
		// Initial
		gl.uniform2f(attributes.onePixel, 1 / this.lastWidth, 1 / this.lastHeight);
		gl.uniform1f(attributes.doStep, true);

		gl.bindTexture(gl.TEXTURE_2D, this.worldTexture);

		this._render();
	}

	_render(timeout) {
		if (this.pause) return;

		const { gl, attributes, size, textures } = this.manager;

		gl.uniform1f(attributes.doStep, true);

		const { texture, framebuffer } = textures[this.bufferIndex];
		this.bufferIndex = (this.bufferIndex + 1) % 2;

		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.drawArrays(gl.TRIANGLES, 0, size);
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.uniform1f(attributes.doStep, false);
		gl.drawArrays(gl.TRIANGLES, 0, size);

		// if(timeout) {
			// return setTimeout(() => this._render(), 50);
		// }

		window.requestAnimationFrame(() => this._render());
	}
}
