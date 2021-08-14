import { fragmentShader } from "./shaders/fragmentShader";
import { vertexShader } from "./shaders/vertexShader";

export class Renderer {
    constructor(canvas, cells) {
        this.canvas = canvas;
        this.cells = cells;

        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        this.lastHeight = canvas.height;
        this.lastWidth = canvas.width;    
        
        this._init();
    }

	_init(){
		/*=========================Shaders========================*/

		// Create a vertex shader object
		const vertShader = gl.createShader(gl.VERTEX_SHADER);

		// Attach vertex shader source code
		gl.shaderSource(vertShader, vertexShader);

		// Compile the vertex shader
		gl.compileShader(vertShader);

		// Create fragment shader object
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		// Attach fragment shader source code
		gl.shaderSource(fragShader, fragmentShader);

		// Compile the fragmentt shader
		gl.compileShader(fragShader);

		// Create a shader program object to store
		// the combined shader program
		this.shaderProgram = gl.createProgram();

		// Attach a vertex shader
		gl.attachShader(this.shaderProgram, vertShader); 

		// Attach a fragment shader
		gl.attachShader(this.shaderProgram, fragShader);

		// Link both programs
		gl.linkProgram(this.shaderProgram);

		// Use the combined shader program object
		gl.useProgram(this.shaderProgram);

		if(gl.getShaderInfoLog(vertShader)){
			console.warn(gl.getShaderInfoLog(vertShader));
		}
		if(gl.getShaderInfoLog(fragShader)){
			console.warn(gl.getShaderInfoLog(fragShader));
		}
		if(gl.getProgramInfoLog(this.shaderProgram)){
			console.warn(gl.getProgramInfoLog(this.shaderProgram));
		}


		this.vertexBuffer = gl.createBuffer();

		/*==========Defining and storing the geometry=======*/

		const vertices = [
			-1.0, -1.0,
			 1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			 1.0, -1.0,
			 1.0,  1.0
		];

		this.size = ~~(vertices.length/2);
		const lastWidth = this.lastWidth;
        const lastHeight = this.lastHeight;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

		// Get the attribute location
		const coord = gl.getAttribLocation(shaderProgram, "coordinates");

		// Point an attribute to the currently bound VBO
		gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

		// Enable the attribute
		gl.enableVertexAttribArray(coord);
		
		this.onePixelAttr = gl.getUniformLocation(shaderProgram, "onePixel");
		this.doStepAttr = gl.getUniformLocation(shaderProgram, "doStep");

		this.worldTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, worldTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, world);

		// texture and framebuffer

		this.txa = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.txa);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		this.fba = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fba);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, txa, 0);

		// texture and framebuffer

		this.txb = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.txb);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		this.fbb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbb);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, txb, 0);
	}

	render() {
		
		gl.uniform2f(this.onePixelAttr, 1/this.lastWidth, 1/this.lastHeight);
		gl.uniform1f(this.doStepAttr, true);

		gl.bindTexture(gl.TEXTURE_2D, this.worldTexture);

		this._render(false);
	}

	_render(mode) {

		gl.uniform1f(this.doStepAttr, true);

		if(mode){

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbb);

			gl.drawArrays(gl.TRIANGLES, 0, this.size);

			gl.bindTexture(gl.TEXTURE_2D, this.txb);

		} else {
			
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fba);

			gl.drawArrays(gl.TRIANGLES, 0, this.size);

			gl.bindTexture(gl.TEXTURE_2D, this.txa);
			
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.uniform1f(this.doStepAttr, false);

		gl.drawArrays(gl.TRIANGLES, 0, this.size);

        // TODO: Check speed
		if(true){
			setTimeout(function(){this._render(!mode);}, 0);
		} else {
			window.requestAnimationFrame(function(){renderInternally(!mode);});
		}	
	}
}