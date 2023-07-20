
/*const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";

ctx.fillRect(10,10,1000,2000);
ctx.fillStyle = "white";

ctx.fillRect(11,11,50,50);*/

// For now lets just get the information needed 

var evtSource = new EventSource("/subscribe");
evtSource.onmessage = function () { pageRefresh() };


var storageJson = {};
var currentUrl = '/itemStorage.json';
  fetch(currentUrl)
    .then((response) => response.json())
    .then((json) => displayItems(json));


function test(storageJson) {
  console.log(JSON.stringify(storageJson.ChestSystem));
}

function displayItems(storageJson) {
  document.getElementById("Storage System Header").innerHTML = `${Object.keys(storageJson)[0]}`;
  const slotSpace = document.getElementById("slotSpace");
  slotSpace.innerHTML = "";
  var slotnum = 0;
  for (var key in storageJson.ChestSystem) {
    //console.log(storageJson.ChestSystem[key].contents);
    for (var item of storageJson.ChestSystem[key].contents){
      //console.log(item.name)
      slotSpace.innerHTML += `<div id="${slotnum}" class="slot"></div>`
      var itemName = item.name.replace('minecraft:','');
      console.log(itemName);
      var imagesrc = "textures/block/barrier.png";
      var http = new XMLHttpRequest();
      http.open('HEAD', `textures/item/${itemName}.png`, false);
      http.send();

      if (http.status != 404) {
        imagesrc = `"textures/item/${itemName}.png"`
      } else {
        imagesrc = `"textures/block/${itemName}.png"`
      }
      document.getElementById(slotnum).innerHTML += `
      <div class="item"> 
        <img src=${imagesrc}/>
        <div class="number">${item.count}</div>
      </div>`
      slotnum++;
    }
  }
}

function pageRefresh() {  
  var currentUrl = '/itemStorage.json';
  fetch(currentUrl)
    .then((response) => response.json())
    .then((json) => displayItems(json));
}
//<div id="0" class="slot"></div> 