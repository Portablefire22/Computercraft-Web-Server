
import * as THREE from "https://unpkg.com/three@0.154.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.154.0/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer();

const controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(1,1,1);



//db = new JsonDB(new jsonDB.Config("World", true, true, "/"));
//var worldData = await db.getData("/");
//console.log(worldData);

camera.position.set( 0, 20, 100 );
controls.update();
/*
const xhr = new XMLHttpRequest();
    xhr.open("GET", "worldData");
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const data = xhr.response;
          console.log(data);
        } else {
          console.log(`Error: ${xhr.status}`);
        }
      };
*/
updateWorld();
var tick = 0
function animate() {
    tick ++;
    //console.log(tick);
    if (tick == 500) {
      tick = 0
      updateWorld();
    }
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function addVoxels(worldJson) {
    //console.log(Object.keys(worldJson).length);
    //console.log(worldJson);
    
    for (var block in worldJson.world) {
      if ((worldJson.world[block]) != "minecraft:air") {
        var coords = block.split(",")
        //console.log(coords);
        if (worldJson.world[block].includes("ore")) {
          var material = new THREE.MeshBasicMaterial( {color: 0xFFD700 })
        } else {
          var material = new THREE.MeshBasicMaterial( {color: 0x808080});
        }
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = coords[0];
        cube.position.y = coords[1];
        cube.position.z = coords[2];
        
        scene.add(cube);
        //console.log(worldJson.world[block]); // Gets block name
      }
      
    }
    
}


function updateWorld() {
  console.log("Updating Mesh");
  for (var childMesh in scene.children) {
    scene.remove(childMesh);
  }
  var currentUrl = window.location.href + '/World.json';
  fetch(currentUrl)
    .then((response) => response.json())
    .then((json) => addVoxels(json));
}

var blockColours = {

}



animate();