
import * as THREE from "https://unpkg.com/three@0.154.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.154.0/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer();

const controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);




var light = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);
scene.add(light);


/* TODO

  - USE A RENDER QUEUE TO STOP RENDERING A MESH WHILST IT IS ON THE SCREEN
  - SHOW BLOCK NAME ON HOVER
  - ALLOW INSPECTION OF INVENTORIES
  
*/

camera.position.set( 0, 20, 100 );
controls.update();


var material = new THREE.MeshBasicMaterial( {color: 0xFFD700 })
var turtleGeometry = new THREE.BoxGeometry(0.5,0.5,0.5);
var turtle = new THREE.Mesh(turtleGeometry, material);
scene.add(turtle);

updateWorld();
var tick = 0
function animate() {
    tick ++;
    //console.log(tick);
    if (tick == 500) {
      tick = 0
      updateWorld();
    } else if (scene.children.length >= 8000){
      clearScene();
    }
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function addVoxels(worldJson) {
    //console.log(Object.keys(worldJson).length);
    //console.log(worldJson);
    const geometry = new THREE.BoxGeometry(1,1,1);
    for (var block in worldJson.world) {
      if ((worldJson.world[block]) != "minecraft:air") {
        var coords = block.split(",")
        //console.log(coords);
        
        if (worldJson.world[block].includes("NULL")) {
          var material = new THREE.MeshBasicMaterial( {color: 0xFFD700 })
        } else {
          var blockName = worldJson.world[block].replace('minecraft:','');
          const texture = new THREE.TextureLoader().load(`/textures/block/${blockName}.png`)
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( 1, 1 );
          var material = new THREE.MeshLambertMaterial( {map: texture});
          material.transparent = true;
          material.opacity = 0.5;
        }
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = coords[0];
        cube.position.y = coords[1];
        cube.position.z = coords[2];
        
        scene.add(cube);
        objects.push(cube);
        //console.log(worldJson.world[block]); // Gets block name
      }
      
    }
    
}

function moveTurtle(turtleJson){
  turtle.position.x = turtleJson["Tester"].x;
  turtle.position.y = turtleJson["Tester"].y;
  turtle.position.z = turtleJson["Tester"].z;
}

function clearScene() {
  for (var children of objects){
    console.log(children);
    children.removeFromParent();
  }
}

function updateWorld() {
  
  console.log("Updating Mesh");
  //console.log(scene.children);
    
  
  var currentUrlTurtle = window.location.href + '/turtleInfo.json';
  fetch(currentUrlTurtle)
    .then((responseTurtle) => responseTurtle.json())
    .then((turtleJson) => moveTurtle(turtleJson));

  var currentUrl = window.location.href + '/World.json';
  fetch(currentUrl)
    .then((response) => response.json())
    .then((json) => addVoxels(json));
    
}

var blockColours = {

}

var objects = [ ];

animate();