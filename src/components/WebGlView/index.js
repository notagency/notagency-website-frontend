/* eslint-disable */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Render from '../WebGlRender';

export default class WebGLView {
  constructor(domElement) {
    this.domElement = domElement;

    this.initThree();
    this.initScene();
    this.addListeners();
    this.resize();
    this.animate();
    // this.initControls();
  }

  initThree() {
    this.scene = new THREE.Scene();

    this.initCamera();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(1.7);
    this.domElement.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
  }

  initCamera() {
    // this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    // this.camera.position.z = 300;

    const aspect = window.innerWidth / window.innerHeight;
    const d = 400;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 10000);

    this.camera.position.set(d, d, d);
    this.camera.lookAt(this.scene.position); // or the origin
  }

  initScene() {
    this.render = new Render(this);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera);
  }

  addListeners() {
    this.handlerAnimate = this.animate.bind(this);

    window.addEventListener('resize', this.resize.bind(this));
    // window.addEventListener('keyup', this.keyup.bind(this));

    // const el = this.renderer.domElement;
    // el.addEventListener('click', this.onClick.bind(this));
  }

  animate() {
    this.update();
    this.draw();

    this.raf = requestAnimationFrame(this.handlerAnimate);
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    const delta = this.clock.getDelta();
    this.render.update(delta);
    if (this.controls) this.controls.update();
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (!this.renderer) return;
    this.initCamera();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  onInteractiveDown(e) {}
}
