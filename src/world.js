import { JsonDB } from "node_modules/node-json-db";

/*

    Deals with saving the world data to a file

*/

export default {
    saveWorldData: async function(blocks) {
        db = new jsonDBJsonDB(new jsonDB.Config("World", true, true, "/"));
        
        // Store using ('/{x}/{y}/{z}', {data})
        var rawBlocksData = ("%s",blocks)
        var blockJson = JSON.parse(rawBlocksData);
        console.log(blockJson)
        db.push((`/${blockJson.x}/${blockJson.y}/${blockJson.z}`), blockJson.blockName);
    }
}