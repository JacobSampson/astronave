const app = (container, canvas) => {
    const context = canvas.getContext('2d');
    let store = {};
    const { clientWidth: width, clientHeight: height } = canvas;
    console.log(`[log] Starting ${width}, ${height}, ${!!context}`);
    console.clear();

    const fillPixel = (x, y, { r, g, b, a }) => {
        // Normalize
        const [normX, normY] = [Math.floor((100 / width) * x), Math.floor((100 / height) * y)];
        context.fillStyle = `rgba(${r},${g},${b},${a})`;
        context.fillRect(normX, normY, 1, 1);    
    }

    const resize = (event) => {
        const { clientWidth: width, clientHeight: height } = container;

        console.log('[log] Resized', width, height);
        canvas.width = ~~width;
        canvas.width = ~~height;
    }

    const setup = () => {
        const cells = new Uint8Array(height * width * 4);
        for (let i = 0; i < cells.length; i += 4) {
            cells[i] = Math.round(Math.random()) * 255;
        }
        const state = {
            ticks: 0,
            cells
        };

        debugger;
        const renderer = new Renderer(canvas, cells);
        renderer.render();

        store = {
            state,
            renderer
        };
    }

    const update = () => {
        console.log('here')
        requestAnimationFrame(update);
    }

    // Observers
    window.addEventListener('resize', resize, false);

    // Setup
    resize();
    setup();

    // Run
    requestAnimationFrame(update);
}

app(document.querySelector('main'), document.querySelector('canvas'));
