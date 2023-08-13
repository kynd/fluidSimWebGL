class Paint {
    constructor(context) {
        this.context = context;
        this.speed = 2;
        this.initMaterial = this.createShaderMaterial(paintInitFrag);
        this.updateMaterial = this.createShaderMaterial(paintUpdateFrag);
        this.renderMaterial = this.createShaderMaterial(paintRenderFrag);
        this.paint = [this.createRenderTarget(), this.createRenderTarget()];

        // Main Scene
        this.mainScene = new THREE.Scene();
        this.mainMesh = this.createMesh(0, 0, this.context.width, this.context.height);
        this.mainScene.add(this.mainMesh);

        this.init();
    }

    init() {
        this.paintIndex = 0;
        this.context.renderer.setRenderTarget(this.paint[0]);
        this.mainMesh.material = this.initMaterial;
        this.initMaterial.uniforms.seed = { value: Math.random() * 100.0 }
        this.context.renderer.render(this.mainScene, this.context.camera);
        this.context.renderer.setRenderTarget(null);
    }

    createShaderMaterial(frag) {
        return new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: { tex: { value: null }, res: { value: [this.context.width, this.context.height] }, speed: { value: this.speed } }
        });
    }

    createRenderTarget() {
        return new THREE.WebGLRenderTarget(this.context.width, this.context.height, {
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        })
    }

    createMesh(cx, cy, w, h) {
        const geometry = new THREE.PlaneGeometry(w, h);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = cx;
        mesh.position.y = cy;
        return mesh;
    }

    update(velocity) {
        const i0 = this.paintIndex % 2;
        const i1 = (this.paintIndex + 1) % 2;
        const prevPaint = this.paint[i0];
        const nextPaint = this.paint[i1];
        this.paintIndex = i1;

        this.context.renderer.setRenderTarget(nextPaint);
        this.mainMesh.material = this.updateMaterial;
        this.updateMaterial.uniforms.tex = {value: prevPaint.texture };
        this.updateMaterial.uniforms.velocity = { value: velocity.texture };
        this.context.renderer.render(this.mainScene, this.context.camera);
        this.context.renderer.setRenderTarget(null);
    }

    draw() {
        this.mainMesh.material = this.renderMaterial;
        this.renderMaterial.uniforms.tex = {value: this.getPaint().texture}
        this.context.renderer.render(this.mainScene, this.context.camera);
    }

    getPaint() {
        return this.paint[this.paintIndex];
    }
}