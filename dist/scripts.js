const app = (container, canvas) => {
    const context = canvas.getContext("2d");
    let store;
    const {
        clientWidth: width,
        clientHeight: height
    } = canvas;
    console.log(`[log] Starting ${width}, ${height}, ${!!context}`), console.clear();
    var resize = event => {
        var {
            clientWidth: width,
            clientHeight: height
        } = container;
        console.log("[log] Resized", width, height), canvas.width = ~~width, canvas.width = ~~height;
    };
    const update = () => {
        console.log("here"), requestAnimationFrame(update);
    };
    window.addEventListener("resize", resize, !1), resize(), (() => {
        const cells = new Uint8Array(height * width * 4);
        for (let i = 0; i < cells.length; i += 4) cells[i] = 255 * Math.round(Math.random());
        var state = {
            ticks: 0,
            cells: cells
        };
        const renderer = new Renderer(canvas, cells);
        renderer.render(), store = {
            state: state,
            renderer: renderer
        };
    })(), requestAnimationFrame(update);
};

app(document.querySelector("main"), document.querySelector("canvas"));

import {
    fragmentShader
} from "./shaders/fragmentShader";

import {
    vertexShader
} from "./shaders/vertexShader";

class Renderer {
    constructor(canvas, cells) {
        this.canvas = canvas, this.cells = cells, this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl"), 
        this.lastHeight = canvas.height, this.lastWidth = canvas.width, this._init();
    }
    _init() {
        var lastWidth = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(lastWidth, vertexShader), gl.compileShader(lastWidth);
        var lastHeight = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(lastHeight, fragmentShader), gl.compileShader(lastHeight), this.shaderProgram = gl.createProgram(), 
        gl.attachShader(this.shaderProgram, lastWidth), gl.attachShader(this.shaderProgram, lastHeight), 
        gl.linkProgram(this.shaderProgram), gl.useProgram(this.shaderProgram), gl.getShaderInfoLog(lastWidth) && console.warn(gl.getShaderInfoLog(lastWidth)), 
        gl.getShaderInfoLog(lastHeight) && console.warn(gl.getShaderInfoLog(lastHeight)), 
        gl.getProgramInfoLog(this.shaderProgram) && console.warn(gl.getProgramInfoLog(this.shaderProgram)), 
        this.vertexBuffer = gl.createBuffer();
        var coord = [ -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1 ];
        this.size = ~~(coord.length / 2);
        lastWidth = this.lastWidth, lastHeight = this.lastHeight;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer), gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coord), gl.STATIC_DRAW), 
        gl.bindBuffer(gl.ARRAY_BUFFER, null), gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, !1, 0, 0), gl.enableVertexAttribArray(coord), 
        this.onePixelAttr = gl.getUniformLocation(shaderProgram, "onePixel"), this.doStepAttr = gl.getUniformLocation(shaderProgram, "doStep"), 
        this.worldTexture = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, worldTexture), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, world), 
        this.txa = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, this.txa), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), 
        this.fba = gl.createFramebuffer(), gl.bindFramebuffer(gl.FRAMEBUFFER, this.fba), 
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, txa, 0), 
        this.txb = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, this.txb), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lastWidth, lastHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), 
        this.fbb = gl.createFramebuffer(), gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbb), 
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, txb, 0);
    }
    render() {
        gl.uniform2f(this.onePixelAttr, 1 / this.lastWidth, 1 / this.lastHeight), gl.uniform1f(this.doStepAttr, !0), 
        gl.bindTexture(gl.TEXTURE_2D, this.worldTexture), this._render(!1);
    }
    _render(mode) {
        gl.uniform1f(this.doStepAttr, !0), mode ? (gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbb), 
        gl.drawArrays(gl.TRIANGLES, 0, this.size), gl.bindTexture(gl.TEXTURE_2D, this.txb)) : (gl.bindFramebuffer(gl.FRAMEBUFFER, this.fba), 
        gl.drawArrays(gl.TRIANGLES, 0, this.size), gl.bindTexture(gl.TEXTURE_2D, this.txa)), 
        gl.bindFramebuffer(gl.FRAMEBUFFER, null), gl.uniform1f(this.doStepAttr, !1), gl.drawArrays(gl.TRIANGLES, 0, this.size), 
        setTimeout(function() {
            this._render(!mode);
        }, 0);
    }
}

export {
    Renderer
};
//# sourceMappingURL=scripts.js.map