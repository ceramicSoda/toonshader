import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
//-----------------------------THREE 
let scene = new THREE.Scene();
let loader = new GLTFLoader();
let camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.001, 1000);
let renderer = new THREE.WebGLRenderer({alpha: true});
let controls = new OrbitControls(camera, renderer.domElement);
let bomb = {group: new THREE.Group()};
//-----------------------------GLTF
loader.loadAsync("assets/bomb.glb")
    .catch(err => console.error(err))
    .then(gltf => {
      bomb.body = gltf.scene.getObjectByName("bomb");
      bomb.fuze = gltf.scene.getObjectByName("fuze");
      bomb.cap = gltf.scene.getObjectByName("cap");
      bomb.group.add(bomb.body,bomb.fuze,bomb.cap);
  })
//-----------------------------INIT
document.body.appendChild(renderer.domElement); 
renderer.setAnimationLoop(animate);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(4,2,0);
camera.lookAt(0,0,0);
let alight = new THREE.AmbientLight(0x888888);
scene.add(bomb.group, alight);
//-----------------------------LOOP
function animate () {
  controls.update(); 
  renderer.render(scene, camera); 
}
//------------------------------RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
})