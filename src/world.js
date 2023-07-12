import { JsonDB, Config } from "node-json-db";

/*

    Deals with saving the world data to a file

*/

export default {
    saveWorldData: async function(blocks) {
        var db = new JsonDB(new Config("./public/World", true, true, "/"));
        
        // Store using ('/{x}/{y}/{z}', {data})
        var rawBlocksData = ("%s",blocks)
        var blockJson = JSON.parse(rawBlocksData);
        console.log(blockJson)
        db.push((`/world/${blockJson.x},${blockJson.y},${blockJson.z}`), blockJson.blockName);
    },
}