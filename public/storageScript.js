
/*const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";

ctx.fillRect(10,10,1000,2000);
ctx.fillStyle = "white";

ctx.fillRect(11,11,50,50);*/

// For now lets just get the information needed 


var storageJson = {};
var currentUrl = '/itemStorage.json';
  fetch(currentUrl)
    .then((response) => response.json())
    .then((json) => test(json));


function test(storageJson) {
  console.log(JSON.stringify(storageJson.ChestSystem));
}
