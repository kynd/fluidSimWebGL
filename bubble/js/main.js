let fluid, paint, count = 0, canvas;
let saver, ready = false, saving = false;
function init() {
    if (saving) {
        saver = new ImageSequenceSaver();
        document.addEventListener('click', async ()=> {
            await saver.showDirectoryPicker();
            ready = true;
        });
    }
    // Basic setup
    const side = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    const renderer = new
        THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(side, side);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);

    const fov = 65;
    const hFovRadian = (fov / 2 / 180) * Math.PI;
    const cz = side / 2 / Math.tan(hFovRadian);
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, cz * 2);
    camera.position.z = cz;

    const context = { renderer, camera, width: side, height: side };
    fluid = new Fluid(context);
    paint = new Paint(context);

}

async function animate() {
    if (saving && !ready) {
        requestAnimationFrame(animate);
        return;
    }

    if (count % 480 == 0) {
        const seed = Math.random() * 100;
        fluid.seed = seed;
        paint.seed = seed;
        fluid.init();
        paint.init();
    }
    count ++;

    fluid.update();
    //fluid.draw();
    paint.update(fluid.getVelocity());
    paint.draw();

    if (saving) {
        await saver.saveCanvasImage(canvas);
    }

    requestAnimationFrame(animate);
}

init();
animate();