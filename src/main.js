import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
// add an environment light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 8);
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
// const mesh = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );

ambientLight.position.set(0, 1.2, 0);
// mesh.position.set(0, 1.2, 0);
scene.add(ambientLight);

// exr
/*// Load HDR environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.setDataType(THREE.FloatType); // or THREE.FloatType
rgbeLoader.load("/textures/studio_photo.hdr", (texture) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.background = envMap;
  scene.environment = envMap;
  texture.dispose();
  pmremGenerator.dispose();
});*/

scene.add(hemisphereLight);
let mixer;
gltfLoader.load("/models/plant.glb", (gltf) => {
  console.log(gltf);
  gltf.scene.position.y -= 2;
  scene.add(gltf.scene);
  console.log("test");
  mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  console.log(clips);
  console.log("child", gltf.scene.children[0]);
  const clip = THREE.AnimationClip.findByName(clips, "Armature.004Action");
  console.log(clip);
  const action = mixer.clipAction(clip);
  action.play();
});
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

let sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};
// rendre la page responsive
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
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

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
const clock = new THREE.Clock();
const animate = () => {
  controls.update();

  mixer?.update(clock.getDelta());
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
