import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import Lenis from '@studio-freight/lenis'
const lenis = new Lenis()



function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const canvas = document.querySelector(".main-canvas");

const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 8);
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
ambientLight.position.set(0, 2, 0);
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

let sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};
// rendre la page responsive
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const aspect = sizes.width / sizes.height;
let zoom = 7;
const camera = new THREE.OrthographicCamera(
  - aspect * zoom / 2,
  aspect * zoom / 2,
  zoom / 2,
  -zoom / 2,
  1,
  1000
);
camera.position.z = 5;
camera.position.y = 1;
camera.position.x = 0;
scene.add(camera);
scene.add(hemisphereLight);
let test;
let mixer;
let startMixer;
document.addEventListener("DOMContentLoaded", () => {
  gltfLoader.load("/models/plant.glb", (gltf) => {
    gltf.scene.position.y -= 0.9;
    gltf.scene.position.x -= 0.07;
    gltf.scene.position.z = -3;
    gltf.scene.rotation.y = -1.94;
    gltf.scene.rotation.x -= 0.05;
    gltf.scene.rotation.y = lenis.progress * 20;

    lenis.on('scroll', () => {
      console.log(lenis.velocity)
      if (lenis.progress * 15 < 10){
        gltf.scene.rotation.y = lenis.progress * 20;
      }
      gltf.scene.rotation.x = lenis.progress * 0.5;

      if(lenis.progress * 15 > 3.5) {
        gltf.scene.position.x = - lenis.progress * 15 + 7;
        gltf.scene.rotation.z = lenis.progress * (- 0.05);
      } else {
        gltf.scene.position.x = lenis.progress * 15;
      }
      if(lenis.progress * 15 > 7.1){
        gltf.scene.position.x = 0;
        camera.zoom = lenis.progress * 15;
      }
      console.log(lenis.progress * 15)
    })
    mixer = new THREE.AnimationMixer(gltf.scene);
    startMixer = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, "Armature.004Action");
    const action = mixer.clipAction(clip);
    action.clampWhenFinished = true;
    action.timeScale = 0.5;
    action.crossFadeTo(action, 0.05, true);
    action.loop = THREE.LoopOnce;
    let start = THREE.AnimationUtils.subclip(clip, "Armature.004Action", 0, 100, 24);
    const startAction = startMixer.clipAction(start);
    startAction.clampWhenFinished = true;
    console.log(startAction);
    scene.add(gltf.scene);
    let animation = clip;
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 100) {
        // Déclencher la lecture de l'animation
        action.play(animation);
      } else {
        // Mettre l'animation en pause
        action.stop();
      }
    });
  });
});

const last = document.getElementById("last-section");
last.addEventListener("scroll", () => {
  console.log("scroll");
  canvas.style.transform = "scale(2)";
});

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
