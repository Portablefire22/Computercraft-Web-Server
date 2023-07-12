//import { readFile } from 'fs/promises';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { JsonDB } from 'node-json-db';
//import { readFile } from 'node:fs';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer();

const controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
const cube = new THREE.Mesh ( geometry, material );
const cube2 = new THREE.Mesh ( geometry, material );
cube2.position.x = 1;

scene.add(cube);
scene.add(cube2); 

camera.position.z = 5;

//db = new JsonDB(new jsonDB.Config("World", true, true, "/"));
//var worldData = await db.getData("/");
//console.log(worldData);

camera.position.set( 0, 20, 100 );
controls.update();

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();