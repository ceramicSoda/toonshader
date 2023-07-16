import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import './style.css';
//-----------------------------THREE 
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.001, 1000);
let renderer = new THREE.WebGLRenderer({alpha: true});
let controls = new OrbitControls(camera, renderer.domElement);
//-----------------------------INIT
document.body.appendChild(renderer.domElement); 
renderer.setAnimationLoop(animate);
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