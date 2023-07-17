import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mainVS, mainFS } from "./mainShader.js";
import { fuzeVS, fuzeFS } from "./fuzeShader.js";
import './style.css';
//-----------------------------THREE 
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.001, 1000);
const renderer = new THREE.WebGLRenderer({alpha: true});
const controls = new OrbitControls(camera, renderer.domElement);
const bomb = {group: new THREE.Group()};
const alight = new THREE.AmbientLight(0x888888, 0.1);
const dlight01 = new THREE.DirectionalLight(0xcccccc, 0.8);
//-----------------------------MATERIALS
const mainMat = new THREE.ShaderMaterial({
  lights: true,
  uniforms: {
    ...THREE.UniformsLib.lights, 
    uColor: {value: new THREE.Color(0x554c9e)}},
  vertexShader: mainVS,
  fragmentShader: mainFS
})
const fuzeMat = new THREE.ShaderMaterial({
  lights: true,
  uniforms: {
    ...THREE.UniformsLib.lights, 
    uColor: {value: new THREE.Color(0xAA9060)},
    uState: {type: "f", value: 0.8},},
  vertexShader: fuzeVS,
  fragmentShader: fuzeFS
})
//-----------------------------GLTF
loader.loadAsync("assets/bomb.glb")
  .catch(err => console.error(err))
  .then(gltf => {
    bomb.body = gltf.scene.getObjectByName("bomb");
    bomb.fuze = gltf.scene.getObjectByName("fuze");
    bomb.cap = gltf.scene.getObjectByName("cap");
    bomb.group.add(bomb.body,bomb.fuze,bomb.cap);
    //bomb.body.material = new THREE.MeshToonMaterial({color: 0x554c9e});
    bomb.body.material = mainMat;
    bomb.fuze.material = fuzeMat;
    bomb.cap.material = new THREE.MeshToonMaterial({color: 0xA8A8A8});
})
//-----------------------------INIT
document.body.appendChild(renderer.domElement); 
renderer.setAnimationLoop(animate);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(4,2,0);
camera.lookAt(0,0,0);
dlight01.position.set(4,2,4);
dlight01.lookAt(0,0,0);
scene.add(bomb.group, alight, dlight01);
//-----------------------------LOOP
function animate () {
  fuzeMat.uniforms.uState.value < 0
    ? fuzeMat.uniforms.uState.value = 1
    : fuzeMat.uniforms.uState.value -= 0.002;
  controls.update(); 
  renderer.render(scene, camera); 
}
//------------------------------RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
})