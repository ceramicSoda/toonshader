import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mainVS, mainFS } from "./mainShader.js";
import { fuzeVS, fuzeFS } from "./fuzeShader.js";
import './style.css';
// three
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.001, 1000);
const renderer = new THREE.WebGLRenderer({alpha: true});
const controls = new OrbitControls(camera, renderer.domElement);
const bomb = {group: new THREE.Group()};
const alight = new THREE.AmbientLight(0x888888, 0.1);
const dlight01 = new THREE.DirectionalLight(0xcccccc, 0.8);
const plight01 = new THREE.PointLight(0xd07040, 0.8, 1.2);
const mplight01 = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({color: 0xd07040}));
// Materials
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
// Asset loading
loader.loadAsync("assets/bomb.glb")
  .catch(err => console.error(err))
  .then(gltf => {
    bomb.body = gltf.scene.getObjectByName("bomb");
    bomb.fuze = gltf.scene.getObjectByName("fuze");
    bomb.cap = gltf.scene.getObjectByName("cap");
    bomb.group.add(bomb.body,bomb.fuze,bomb.cap);
    bomb.body.material = new THREE.MeshToonMaterial({color: 0x554c9e});
    bomb.body.material = fuzeMat;
    bomb.fuze.material = fuzeMat;
    bomb.cap.material = new THREE.MeshToonMaterial({color: 0xA8A8A8});
    bomb.cap.material = fuzeMat;
})
// Init
document.body.appendChild(renderer.domElement); 
renderer.setAnimationLoop(animate);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(4,2,0);
camera.lookAt(0,0,0);
dlight01.position.set(4,2,4);
dlight01.lookAt(0,0,0);
plight01.position.set(1, 1, 0);
scene.add(bomb.group, alight, dlight01, plight01, mplight01);
// Loop
function animate () {
  plight01.position.set(Math.sin(Date.now()/500), 1, Math.cos(Date.now()/500))
  mplight01.position.copy(plight01.position);
  fuzeMat.uniforms.uState.value < 0
    ? fuzeMat.uniforms.uState.value = 1
    : fuzeMat.uniforms.uState.value -= 0.002;
  
  controls.update(); 
  renderer.render(scene, camera); 
}
// Events
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
})