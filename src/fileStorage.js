import { JsonDB, Config } from "node-json-db";
import 'fs';
import { readFileSync } from "fs";
import { argv0 } from "process";

/*

    Deals with saving the world data to a file

*/


/* 

    TODO

        
    > Map the chest room
        > Store chest positions
    > Store the chest contents in a json file
    > Take items and put them into an available chest
        > Write code that checks for available space in a chest, and fills that space
        with the given item.
    > Withdraw requested items
        > Withdraws items required for crafting
            > Autocrafting with turtles?
    > Central depot for deposit and withdrawing items
    > Allow the turtles to automatically expand the chest storage
    > If using map viewer, allow for contents to be seen from the viewer
*/ 

export default {
    // Save the data from a chest using the chest coordinates
    saveInventoryData: async function(data) {
        var db = new JsonDB(new Config("./public/itemStorage", true, true, "/"));
        try {
            var rawStorageData = data.toString();
            var storageJson = JSON.parse(rawStorageData);
            
            for (var i in Object.keys(storageJson.contents)) {
                storageJson.contents[i].slot = parseInt(i);
            } 
            var filtered = storageJson.contents.filter(function (el) {
                return el != null;
            });

            var storageInformation = {
                freeSlots: 54 - filtered.length,
                contents: storageJson.contents,
            }
            db.push((`/ChestSystem/${storageJson.x},${storageJson.y},${storageJson.z}/`), storageInformation);
        } catch(error) {
            console.log(data);
            console.error(error);
        }
    },

      // Locates the chest that contains the given item
      // Syntax: 
      // ${ITEM}.${AMOUNT}
    locateItem: async function(data) {
        var rawChestData = readFileSync('./public/itemStorage.json');
        var chestJson = JSON.parse(rawChestData); 
        var chestCoords = {x:0,y:0,z:0};
        //var pathFinderArgs = { coords: chestCoords, wantedItem: data[0], itemAmount: data[1]  };
        var pathFinderArgs = { chestInfo: [], wantedItem: data[0]}
        var requiredAmount = data[1];
        Object.entries(chestJson.ChestSystem).forEach((entry) => {
            const [currentChestCoord, value] = entry;
            if (requiredAmount > 0) {
                Object.entries(value.contents).forEach((tmp) => {
                    const [_freeSlots, slotContent] = tmp;
                    //console.log(`${slotContent.name} == ${data[0]} ${slotContent.name == data[0]}`)
                    if (slotContent.name == data[0] && requiredAmount > 0) {
                        let coords = currentChestCoord.split(",");
                        chestCoords = {x: coords[0], y: coords[1], z: coords[2]}
                        var temp = requiredAmount - slotContent.count;
                        console.log(`required: ${requiredAmount}`)
                        var itemsToTake;
                        // If the slot has more than needed.
                        if (temp <= 0) {
                            itemsToTake = requiredAmount;
                            requiredAmount = 0;
                        } else { // If the slot has less than needed.
                            itemsToTake = slotContent.count;
                            requiredAmount = temp;
                        }
                        var itemInfo = [chestCoords,slotContent.slot, itemsToTake];
                        pathFinderArgs.chestInfo.push(itemInfo);
                    }
                });
            }
        });
        return pathFinderArgs;
    },
      
    // Determines the path for the turtle to take to get to the chest 
    // Syntax:
    // ${CHEST_COORDS}.${WANTED_ITEM}.${ITEM_AMOUNTS}
    pathFind: async function(data) {
        console.log(data);
    },

    // Handles the commands for storage
    // Syntax:
    // ${TURTLE_LABEL}.${TYPE}$.{COMMAND}.${DATA}
    commandHandler: async function(command, data) {
        data = data.filter(function( element ) {
            return element !== undefined;
        });
        try{
            switch (command) {
                case "SAVE":
                    this.saveInventoryData(data);
                    return true;
                case "FIND":
                    break;
                case "RETRIEVE":
                    console.log(data);
                    this.pathFind(await this.locateItem(data));
                    break;
                case "STORE":
                    break;
                default:
                    console.log(`Unable to determine ${data[2]} from ${data}`);
                    break;
            }
        } catch (error) {
            console.log(data);
            console.error(error);
        }
    }
}
