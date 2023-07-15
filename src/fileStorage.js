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
    saveInventoryData: async function() {
        var db = new JsonDB(new Config("./public/itemStorage", true, true, "/"));
        
        // Store using ('/{x}/{y}/{z}', {data})
        var rawBlocksData = ("%s",blocks)
        var blockJson = JSON.parse(rawBlocksData);
        console.log(blockJson)
        db.push((`/Chest/${chestId}`), );
    },
}