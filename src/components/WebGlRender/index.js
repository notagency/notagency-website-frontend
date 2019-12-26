/* eslint-disable */
import * as THREE from 'three';
import { curlNoise } from './utils/SimplexNoise3D';
/* eslint import/no-webpack-loader-syntax: off */
import vertexShader from '!raw-loader!glslify-loader!./shaders/default.vert';
import fragmentShader from '!raw-loader!glslify-loader!./shaders/default.frag';

const glslify = require('glslify');

export default class {
  constructor(app) {
    this.app = app;

    // camera parameters
    this.cameraFocalDistance = 49.19;
    this.bokehStrength = 0.095;
    this.exposure = 0.0019;
    // set to 1 to have non-linear increase in focal strength
    this.focalPowerFunction = 0;

    // how big lines should be on screen when they're in the focal plane
    this.minimumLineSize = 0.015;

    // how many render calls are made each frame
    this.drawCallsPerFrame = 5;

    // wether each line has assigned a quantity of points proportional to its length or a fixed number instead
    this.useLengthSampling = false;

    // if $useLengthSampling is false, every line will by rendered by default with $pointsPerLine points
    this.pointsPerLine = 25;

    // if $useLengthSampling is true, every line will be drawn with an amount of points that is proportional to the line's length,
    // use $pointsPerFrame to determine how many points will be drawn in a single drawcall. Keep in mind that each line is drawn with
    // at least one point
    this.pointsPerFrame = 1000000;

    this.initScene();
  }

  initScene() {
    const geometry = this.createLinesGeometry();

    const material = new THREE.ShaderMaterial({
      vertexShader: glslify(vertexShader),
      fragmentShader: glslify(fragmentShader),
      uniforms: {
        uTime: { value: 0 },
        uRandom: { value: 0 },
        uRandomVec4: new THREE.Uniform(new THREE.Vector4(0, 0, 0, 0)),
        uFocalDepth: { value: this.cameraFocalDistance },
        uBokehStrength: { value: this.bokehStrength },
        uMinimumLineSize: { value: this.minimumLineSize },
        uFocalPowerFunction: { value: this.focalPowerFunction }
      },

      side: THREE.DoubleSide,
      depthTest: false,

      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor
    });

    this.mesh = new THREE.Mesh(geometry, material);
    console.log(this.mesh);
    this.app.scene.add(this.mesh);
  }

  createLines() {
    let nrings = 150;
    const lines = [];

    for (let j = 0; j < nrings; j++) {
      let angle = (j / nrings) * Math.PI;
      let p = new THREE.Vector3(0, 0, 1);
      p.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle);

      let rad = p.y;
      let z = p.z;

      let trad = 5.75;

      let nsegments = 70 + Math.abs(Math.floor(rad * 360));

      for (let i = 0; i < nsegments; i++) {
        let a1 = (i / nsegments) * Math.PI * 2;
        let a2 = ((i + 1) / nsegments) * Math.PI * 2;

        let frad = trad;
        if (Math.random() > 0.92) frad = frad + 0.15;

        let x1 = Math.cos(a1) * rad * frad;
        let y1 = Math.sin(a1) * rad * frad;
        let z1 = z * frad;

        let x2 = Math.cos(a2) * rad * frad;
        let y2 = Math.sin(a2) * rad * frad;
        let z2 = z * frad;

        let noiseSpeed = 0.5;
        let noiseStrength1 =
          0.1 +
          curlNoise(
            new THREE.Vector3(x1 * noiseSpeed * 0.3, y1 * noiseSpeed * 0.3, z1 * noiseSpeed * 0.3)
          ).x *
            0.7;
        let noiseStrength2 =
          0.1 +
          curlNoise(
            new THREE.Vector3(x2 * noiseSpeed * 0.3, y2 * noiseSpeed * 0.3, z2 * noiseSpeed * 0.3)
          ).x *
            0.7;
        let v1 = curlNoise(
          new THREE.Vector3(x1 * noiseSpeed, y1 * noiseSpeed, z1 * noiseSpeed)
        ).multiplyScalar(noiseStrength1);
        let v2 = curlNoise(
          new THREE.Vector3(x2 * noiseSpeed, y2 * noiseSpeed, z2 * noiseSpeed)
        ).multiplyScalar(noiseStrength2);

        let colorMult = 0.1;
        let colorMult2 = 0.1;

        let ldir = new THREE.Vector3(-0.2, -0.35, -0.5);
        ldir.normalize();
        ldir.multiplyScalar(-1);

        let normal = new THREE.Vector3(x1, y1, z1);
        normal.normalize();

        let diffuse1 = Math.pow(Math.max(normal.dot(ldir), 0.0), 3.0);
        // let diffuse2 = Math.pow(Math.max(normal.dot(ldir), 0.0), 1.5);
        colorMult *= diffuse1;
        colorMult2 *= diffuse1;
        colorMult += 0.002;
        colorMult2 += 0.002;

        let t = 1;

        lines.push({
          x1: x1 + v1.x,
          y1: y1 + v1.y,
          z1: z1 + v1.z,

          x2: x2 + v2.x,
          y2: y2 + v2.y,
          z2: z2 + v2.z,

          c1r: 1 * colorMult,
          c1g: 1 * colorMult * t,
          c1b: 1 * colorMult * t,

          c2r: 1 * colorMult,
          c2g: 1 * colorMult * t,
          c2b: 1 * colorMult * t
        });

        if (Math.random() > 0.975) {
          let rc = 2;
          let rd1 = 0.1 + Math.random() * 0.3;
          let rd2 = rd1 + Math.pow(Math.random(), 2) * 0.25;
          if (Math.random() > 0.8) {
            rc = 6;
          }

          lines.push({
            x1: (x1 + v1.x) * rd1,
            y1: (y1 + v1.y) * rd1,
            z1: (z1 + v1.z) * rd1,

            x2: (x1 + v1.x) * rd2,
            y2: (y1 + v1.y) * rd2,
            z2: (z1 + v1.z) * rd2,

            c1r: rc * colorMult2,
            c1g: rc * colorMult2,
            c1b: rc * colorMult2,

            c2r: rc * colorMult2,
            c2g: rc * colorMult2,
            c2b: rc * colorMult2,

            weight: 100
          });
        }
      }
    }
    return lines;
  }

  createLinesGeometry() {
    const geometry = new THREE.BufferGeometry();
    const position1 = [];
    const position2 = [];
    const color1 = [];
    const color2 = [];
    const seed = [];
    const lines = this.createLines();

    let accumulatedLinesLength = 0;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      let lx1 = line.x1;
      let ly1 = line.y1;
      let lz1 = line.z1;

      let lx2 = line.x2;
      let ly2 = line.y2;
      let lz2 = line.z2;

      let weight = line.weight || 1;

      let dx = lx1 - lx2;
      let dy = ly1 - ly2;
      let dz = lz1 - lz2;
      let lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz) * weight;

      accumulatedLinesLength += lineLength;
    }
    let pointsPerUnit = this.pointsPerFrame / accumulatedLinesLength;

    for (let j = 0; j < lines.length; j++) {
      let line = lines[j];

      let lx1 = line.x1;
      let ly1 = line.y1;
      let lz1 = line.z1;

      let lx2 = line.x2;
      let ly2 = line.y2;
      let lz2 = line.z2;

      let weight = line.weight || 1;

      // how many points per line?
      let points = this.pointsPerLine;
      let invPointsPerLine = 1 / points;

      if (this.useLengthSampling) {
        let dx = lx1 - lx2;
        let dy = ly1 - ly2;
        let dz = lz1 - lz2;
        let lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz);

        points = Math.max(Math.floor(pointsPerUnit * lineLength * weight), 1);
        invPointsPerLine = 1 / points;
      }

      for (let ppr = 0; ppr < points; ppr++) {
        position1.push(lx1, ly1, lz1);
        position2.push(lx2, ly2, lz2);
        color1.push(
          line.c1r * invPointsPerLine,
          line.c1g * invPointsPerLine,
          line.c1b * invPointsPerLine
        );
        color2.push(
          line.c2r * invPointsPerLine,
          line.c2g * invPointsPerLine,
          line.c2b * invPointsPerLine
        );

        seed.push(
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        );
      }
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(position1), 3));
    geometry.addAttribute('position1', new THREE.BufferAttribute(new Float32Array(position2), 3));
    geometry.addAttribute('color1', new THREE.BufferAttribute(new Float32Array(color1), 3));
    geometry.addAttribute('color2', new THREE.BufferAttribute(new Float32Array(color2), 3));
    geometry.addAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(seed), 4));

    return geometry;
  }

  update() {
    this.mesh.material.uniforms.uBokehStrength.value = this.bokehStrength;
    this.mesh.material.uniforms.uFocalDepth.value = this.cameraFocalDistance;
    this.mesh.material.uniforms.uFocalPowerFunction.value = this.focalPowerFunction;
    this.mesh.material.uniforms.uMinimumLineSize.value = this.minimumLineSize;
    this.mesh.material.uniforms.uRandom.value = Math.random() * 1000;
    this.mesh.material.uniforms.uTime.value = (this.app.clock.elapsedTime * 0.001) % 100; // modulating time by 100 since it appears hash12 suffers with higher time values
    this.mesh.material.uniforms.uRandomVec4.value = new THREE.Vector4(
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100
    );
    // this.app.scene.position.z += 0.1;
  }
}

/*
window.addEventListener("load", init);

var scene;
var postProcScene;
var camera;
var postProcCamera;
var controls;
var renderer;
var canvas;

var postProcQuadMaterial;
var linesMaterial;

var capturerStarted = false;

let lines = [ ];
let linesGeometry;

let samples = 0;

var offscreenRT;



// The threejs version used in this repo was modified at line: 23060  to disable frustum culling



var controls = { };

function init() {
  renderer = new THREE.WebGLRenderer( {  } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( innerWidth, innerHeight );
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);
  canvas = renderer.domElement;


  scene            = new THREE.Scene();
  postProcScene    = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 20, innerWidth / innerHeight, 2, 200 );
  let dirVec = new THREE.Vector3(-5, -5, 10).normalize().multiplyScalar(49);
  camera.position.set( dirVec.x, dirVec.y, dirVec.z );


  postProcCamera = new THREE.PerspectiveCamera( 20, innerWidth / innerHeight, 2, 200 );
  postProcCamera.position.set(0, 0, 10);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed     = 1;
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = +Infinity;
  controls.minPolarAngle   = 0.85;
  controls.maxPolarAngle   = Math.PI - 0.85;

  controls.addEventListener("change", function() {
    resetCanvas();
  });



  offscreenRT = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
    stencilBuffer: false,
    depthBuffer: false,
    type: THREE.FloatType,
  });

  var postProcQuadGeo = new THREE.PlaneBufferGeometry(2,2);
  postProcQuadMaterial = new THREE.ShaderMaterial({
    vertexShader: postprocv,
    fragmentShader: postprocf,
    uniforms: {
      texture: { type: "t", value: offscreenRT.texture },
      uSamples: { value: samples },
      uExposure: { value: exposure },
      uBackgroundColor: new THREE.Uniform(new THREE.Vector3(21/255, 16/255, 16/255)),
    },
    side: THREE.DoubleSide,
  });
  postProcScene.add(new THREE.Mesh(postProcQuadGeo, postProcQuadMaterial));



  linesMaterial = new THREE.ShaderMaterial({
    vertexShader: linev,
    fragmentShader: linef,
    uniforms: {
      uTime: { value: 0 },
      uRandom: { value: 0 },
      uRandomVec4: new THREE.Uniform(new THREE.Vector4(0, 0, 0, 0)),
      uFocalDepth: { value: cameraFocalDistance },
      uBokehStrength: { value: bokehStrength },
      uMinimumLineSize: { value: minimumLineSize },
      uFocalPowerFunction: { value: focalPowerFunction },
    },

    side:           THREE.DoubleSide,
    depthTest:      false,

    blending:      THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc:      THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDst:      THREE.OneFactor,
    blendDstAlpha: THREE.OneFactor,
  });


  createLinesWrapper(0);


  buildControls();
  render();
}


let frames = 0;
let lastFrameDate = 0;
function render(now) {
  requestAnimationFrame(render);

  checkControls();



  if(!capturerStarted) {
    capturerStarted = true;
  }

  controls.update();

  for(let i = 0; i < drawCallsPerFrame; i++) {
    samples++;
    linesMaterial.uniforms.uBokehStrength.value = bokehStrength;
    linesMaterial.uniforms.uFocalDepth.value = cameraFocalDistance;
    linesMaterial.uniforms.uFocalPowerFunction.value = focalPowerFunction;
    linesMaterial.uniforms.uMinimumLineSize.value = minimumLineSize;
    linesMaterial.uniforms.uRandom.value = Math.random() * 1000;
    linesMaterial.uniforms.uTime.value = (now * 0.001) % 100;   // modulating time by 100 since it appears hash12 suffers with higher time values
    linesMaterial.uniforms.uRandomVec4.value = new THREE.Vector4(Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100);
    renderer.render(scene, camera, offscreenRT);
  }

  postProcQuadMaterial.uniforms.uSamples.value = samples;
  postProcQuadMaterial.uniforms.uExposure.value = exposure;
  renderer.render(postProcScene, postProcCamera);


  // used to make GIF animations
  // if(lastFrameDate + 3000 < Date.now()) {
  //     frames++;
  //     createLinesWrapper(frames);
  //     resetCanvas();

  //     lastFrameDate = Date.now();

  //     var photo = canvas.toDataURL('image/jpeg');
  //     $.ajax({
  //         method: 'POST',
  //         url: 'photo_upload.php',
  //         data: {
  //             photo: photo
  //         }
  //     });

  //     if(frames === 200) {
  //         lastFrameDate = Infinity;

  //     }
  // }
}


function resetCanvas() {
  scene.background = new THREE.Color(0x000000);
  renderer.render(scene, camera, offscreenRT);
  samples = 0;
  scene.background = null;
}

function createLinesWrapper(frames) {
  lines = [];
  scene.remove(scene.getObjectByName("points"));

  createLines(frames);

  createLinesGeometry();
  let mesh = new THREE.Points(linesGeometry, linesMaterial);
  mesh.name = "points";

  scene.add(mesh);
}

function buildControls() {
  window.addEventListener("keydown", function(e) {
    controls[e.key] = true;
  });

  window.addEventListener("keyup", function(e) {
    controls[e.key] = false;
  });


  window.addEventListener("keypress", function(e) {
    if(e.key == "h" || e.key == "H") {
      document.querySelector(".controls").classList.toggle("active");
    }
    if(e.key == "m" || e.key == "M") {
      if(focalPowerFunction === 0) focalPowerFunction = 1;
      else                         focalPowerFunction = 0;

      resetCanvas();
    }
  });
}

function checkControls() {
  if(controls["o"]) {
    cameraFocalDistance -= 0.2;
    console.log("cfd: " + cameraFocalDistance);
    resetCanvas();
  }
  if(controls["p"]) {
    cameraFocalDistance += 0.2;
    console.log("cfd: " + cameraFocalDistance);
    resetCanvas();
  }

  if(controls["k"]) {
    bokehStrength += 0.0025;
    console.log("bs: " + bokehStrength);
    resetCanvas();
  }
  if(controls["l"]) {
    bokehStrength -= 0.0025;
    bokehStrength = Math.max(bokehStrength, 0);
    console.log("bs: " + bokehStrength);
    resetCanvas();
  }

  if(controls["n"]) {
    bokehFalloff += 3.5;
    console.log("bf: " + bokehFalloff);
  }
  if(controls["m"]) {
    bokehFalloff -= 3.5;
    console.log("bf: " + bokehFalloff);
  }

  if(controls["v"]) {
    exposure += 0.0001;
    console.log("exp: " + exposure);
  }
  if(controls["b"]) {
    exposure -= 0.0001;
    exposure = Math.max(exposure, 0.0001);
    console.log("exp: " + exposure);
  }
}


 */
