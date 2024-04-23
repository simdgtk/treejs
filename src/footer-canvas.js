import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import {Pane} from 'tweakpane';
const canvas = document.querySelector(".footer-canvas");

const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 8);


scene.add(hemisphereLight);
let mixer;
gltfLoader.load("/models/plant.glb", (gltf) => {
  console.log(gltf);
  gltf.scene.position.y -= 2.5;
  gltf.scene.rotation.y -= 1.25;
  scene.add(gltf.scene);
  /*const PARAMS = {
    positionY: gltf.scene.position.y,
    positionX: gltf.scene.position.x,
    positionZ: gltf.scene.position.z,
    rotationY: gltf.scene.rotation.y,
    rotationX: gltf.scene.rotation.x,
    rotationZ: gltf.scene.rotation.z,
  };
  const pane = new Pane();
  pane.addBinding(PARAMS, "factor");
  pane.addBinding(PARAMS, "title");
  pane.addBinding(PARAMS, "positionY", { min: -3, max: 3 }).on("change", (ev) => {
    gltf.scene.position.y = ev.value;
  });
  pane.addBinding(PARAMS, "positionX", { min: -3, max: 3 }).on("change", (ev) => {
    gltf.scene.position.x = ev.value;
  });
  pane.addBinding(PARAMS, "positionZ", { min: -3, max: 3 }).on("change", (ev) => {
    gltf.scene.position.z = ev.value;
  });
  pane.addBinding(PARAMS, "rotationY", { min: -3, max: 3 }).on("change", (ev) => {
    gltf.scene.rotation.y = ev.value;
  });
  pane.addBinding(PARAMS, "rotationX", { min: -3, max: 3 }).on("change", (ev) => {
    gltf.scene.rotation.x = ev.value;
  });
  pane.addBinding(PARAMS, "rotationZ", { min: -3, max: 3 }).on("change", (ev) => {
    gltf.scene.rotation.z = ev.value;
  });*/
  
});

let sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};
// rendre la page responsive
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 3;
camera.position.y = 1;
camera.position.x = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 4;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
const clock = new THREE.Clock();
const animate = () => {
  mixer?.update(clock.getDelta());
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
