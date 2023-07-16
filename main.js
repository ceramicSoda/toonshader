import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { bombVert, bombFrag } from "./bombToon.js";
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
    bomb.body.material = new THREE.MeshToonMaterial({color: 0x554c9e});
    bomb.fuze.material = new THREE.MeshToonMaterial({color: 0xCA9040});
    bomb.cap.material = new THREE.MeshToonMaterial({color: 0xA8A8A8});
})
//-----------------------------INIT
document.body.appendChild(renderer.domElement); 
renderer.setAnimationLoop(animate);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(4,2,0);
camera.lookAt(0,0,0);
let alight = new THREE.AmbientLight(0x888888, 0.1);
let dlight01 = new THREE.DirectionalLight(0xcccccc, 0.8);
dlight01.position.set(4,2,4);
dlight01.lookAt(0,0,0);
scene.add(bomb.group, alight, dlight01);
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