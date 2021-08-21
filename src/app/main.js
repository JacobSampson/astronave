import { Renderer } from "./renderer";

const WIDTH = 35;
const HEIGHT = 35;

const levels = [
    ['Intro', 'Description for the first level', [], [
        [Math.round(WIDTH / 2), Math.round(HEIGHT / 3 * 1.5), 7, [0, 0, 255, 255]],
        [Math.round(WIDTH / 3), Math.round(HEIGHT / 3 * 2), 5, [0, 0, 255, 255]]
    ]],
    ['Second', 'Description for the next level', [], [
        [Math.round(WIDTH / 2), Math.round(HEIGHT / 3 * 1.5), 7, [255, 0, 0, 255]],
    ]]
];

const app = (container, canvas) => {
    console.log(`[log] Starting`);
    const width = WIDTH;
    const height = HEIGHT;
    let currentLevel = 0;

    const resize = () => {
        console.log('[log] Resized', width, height);
        canvas.width = ~~width;
        canvas.height = ~~height;
    }

    const getIndex = (x, y, width) => y * width * 4 + x * 4;

    const drawCircle = (world, planet) => {
        const [x, y, radius, color] = planet;
        const [r,g,b,a] = color;
        for (let i = 0; i < 2 * radius; i++) {
            for (let j = 0; j < 2 * radius; j++) {
                const offsetX = i - radius;
                const offsetY = j - radius;
                console.log(offsetX, offsetY, radius)
                if (((offsetX * offsetX) + (offsetY * offsetY)) >= (radius * radius)) continue;

                const index = getIndex(x + offsetX, y + offsetY, width);

                world[index] = r;
                world[index + 1] = g;
                world[index + 2] = b;
                world[index + 3] = 255;        
            }
        }
    }

    const setup = (station, level) => {
        resize();

        // Create world
        const world = new Uint8Array(width * height * 4);
        const areaHeight = Math.floor(height / 4);

        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                if (station && (i <= areaHeight)) {
                    const index = getIndex(j, i, width);
                    const stationIndex = getIndex(j, areaHeight - i - 1, width);
                    world[index] = station[stationIndex];
                    world[index + 1] = station[stationIndex + 1];
                    world[index + 2] = station[stationIndex + 2];
                    world[index + 3] = station[stationIndex + 3];
                    continue;
                }

                if (i > areaHeight) continue;

                const index = getIndex(j, i, width);
                world[index] = !!((j + i) % 2) ? 0 : 50;
                world[index + 1] = !!((j + i) % 2) ? 0 : 50;
                world[index + 2] = !!((j + i) % 2) ? 0 : 50;
                world[index + 3] = 5;
            }
        }
        for (const planet of level[3]) drawCircle(world, planet)

        const state = {
            ticks: 0,
            world,
            station: station || new Uint8Array(width * Math.floor(height / 4) * 4)
        };

        const renderer = new Renderer(canvas, world, { width, height });

        return { state, renderer };
    }

    // Setup
    let renderer, state;
    const title = document.querySelector('h1');
    const description = document.querySelector('p');

    const loadLevel = (level, clearStation) => {
        if (clearStation && state && state.station) delete state.station;
        const { renderer: newRenderer, state: newState } = setup(state ? state.station : state, level);
        title.innerHTML = `Level ${level[0]}`;
        description.innerHTML = level[1];
        renderer = newRenderer;
        state = newState;
        renderer.render();
    };

    loadLevel(levels[0], true);

    const reset = () => {
        document.querySelectorAll('.pixel.enabled').forEach(pixel => pixel.classList.remove('enabled'));
        loadLevel(levels[currentLevel], true);
    }

    // Observers
    const buttons = [1, 2, 3, 4].map(num => document.getElementById(`btn-${num}`));
    buttons[0].addEventListener('click', () => reset());
    buttons[1].addEventListener('click', () => { buttons[1].innerHTML = renderer.pause ? 'Pause' : 'Play'; renderer.togglePause() });
    buttons[2].addEventListener('click', () => loadLevel(levels[currentLevel], false));
    buttons[3].addEventListener('click', () => { currentLevel = currentLevel === 1 ? 0 : 1; loadLevel(levels[currentLevel], true) });
    window.addEventListener('resize', resize, false)

    // Pixell area
    const pixels = document.querySelector('.pixels');
    const areaHeight = Math.floor(height / 4);
    pixels.style.gridTemplateColumns = `repeat(${height}, 1fr)`;
    pixels.style.gridTemplateRows = `repeat(${areaHeight}, 1fr)`;
    const trigger = (event, i, j, width) => {
        const { target } = event;
        target.classList.contains('enabled') ? target.classList.remove('enabled') : target.classList.add('enabled');
        const index = getIndex(i, j, width);
        state.station[index] = 255;
        state.station[index + 1] = 255;
        state.station[index + 2] = 255;
        state.station[index + 3] = 255;
    }
    for (let j = 0; j < areaHeight; j++) {
        for (let i = 0; i < width; i++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.addEventListener('mouseover', event => {
                if (event.buttons !== 1 && event.buttons !== 3) return;
                trigger(event, i, j, width);
            });
            pixel.addEventListener('click', event => {
                trigger(event, i, j, width);
            });
            pixels.appendChild(pixel);
        }
    }
}

app(document.querySelector('main'), document.querySelector('canvas'));
