import { JsonDB, Config } from "node-json-db";

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
    // Save the data from a chest using a numerical chest ID
    saveInventoryData: async function(data) {
        var db = new JsonDB(new Config("./public/itemStorage", true, true, "/"));
        
        var rawStorageData = data.toString();
        var storageJson = JSON.parse(rawStorageData);
        console.log(storageJson)
        db.push((`/ChestSystem/${chestId}/`), );
    },

    // Handles the commands for storage
    // Syntax:
    // ${TURTLE_LABEL}:${TYPE}:${COMMAND}:${DATA}
    commandHandler: async function(data) {
        try{
            switch (data[2]) {
                case "SAVE":
                    this.saveInventoryData(data);
                    break;
                case "FIND":
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