class Fluid {
    constructor(context) {
        this.context = context;
        this.speed = 4;
        this.fluidInitMaterial = this.createShaderMaterial(fluidInitFrag);
        this.divergeMaterial = this.createShaderMaterial(divergeFrag);
        this.advectMaterial = this.createShaderMaterial(advectFrag);
        this.pressureMaterial = this.createShaderMaterial(pressureFrag);
        this.updateMaterial = this.createShaderMaterial(fluidUpdateFrag);
        this.renderMaterial = this.createShaderMaterial(fluidRenderFrag);
        this.velocity = [this.createRenderTarget(), this.createRenderTarget()];
        this.pressure = [this.createRenderTarget(), this.createRenderTarget()];
        this.divergence = this.createRenderTarget();
        this.advection = this.createRenderTarget();
        this.blank = this.createRenderTarget();

        // Main Scene
        this.mainScene = new THREE.Scene();
        this.mainMesh = this.createMesh(0, 0, this.context.width, this.context.height);
        this.mainScene.add(this.mainMesh);

        this.seed = 0;
        this.init();
    }

    init() {
        this.velocityIndex = 0;
        this.context.renderer.setRenderTarget(this.velocity[0]);
        this.mainMesh.material = this.fluidInitMaterial;
        this.fluidInitMaterial.uniforms.seed = { value: this.seed }
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

    update() {
        this.updateAdvection();
        this.updateDivergence();
        this.updatepPressure();
        this.updateVelocity();
    }

    updateAdvection() {
        this.context.renderer.setRenderTarget(this.advection);
        this.mainMesh.material = this.advectMaterial;
        this.advectMaterial.uniforms.tex = {value: this.velocity[this.velocityIndex].texture};
        this.context.renderer.render(this.mainScene, this.context.camera);
        this.context.renderer.setRenderTarget(null);
    }
    
    updateDivergence() {
        this.context.renderer.setRenderTarget(this.divergence);
        this.mainMesh.material = this.divergeMaterial;
        this.divergeMaterial.uniforms.tex = {value: this.advection.texture};
        this.context.renderer.render(this.mainScene, this.context.camera);
        this.context.renderer.setRenderTarget(null);
    }

    updatepPressure() {
        this.context.renderer.setRenderTarget(this.pressure[0]);
        this.context.renderer.clear();
        this.context.renderer.setRenderTarget(null);

        for (let i = 0; i < 4; i++) {
            let i0 = i % 2;
            let i1 = (i + 1) % 2;
            const prevPressure = this.pressure[i0];
            const nextPressure = this.pressure[i1];

            this.context.renderer.setRenderTarget(nextPressure);
            this.mainMesh.material = this.pressureMaterial;
            this.pressureMaterial.uniforms.tex = {value: prevPressure.texture};
            this.pressureMaterial.uniforms.divergence = { value: this.divergence.texture };
            this.context.renderer.render(this.mainScene, this.context.camera);
            this.context.renderer.setRenderTarget(null);
        }
    }

    updateVelocity() {
        const i1 = (this.velocityIndex + 1) % 2;
        const nextVelocity = this.velocity[i1];
        this.velocityIndex = i1;

        this.context.renderer.setRenderTarget(nextVelocity);
        this.mainMesh.material = this.updateMaterial;
        this.updateMaterial.uniforms.pressure = {value: this.pressure[1].texture };
        this.updateMaterial.uniforms.advection = { value: this.advection.texture };
        this.context.renderer.render(this.mainScene, this.context.camera);
        this.context.renderer.setRenderTarget(null);
    }

    draw() {
        this.mainMesh.material = this.renderMaterial;
        this.renderMaterial.uniforms.tex = {value: this.getVelocity().texture}
        this.context.renderer.render(this.mainScene, this.context.camera);
    }

    getVelocity() {
        return this.velocity[this.velocityIndex];
    }
}
