const jsonDB = require('node-json-db');

/*

    Deals with saving the world data to a file

*/

module.exports = {
    saveWorldData: async function(blocks) {
        db = new jsonDB.JsonDB(new jsonDB.Config("World", true, true, "/"));
        
        // Store using ('/{x}/{y}/{z}', {data})
        var rawBlocksData = ("%s",blocks)
        var blockJson = JSON.parse(rawBlocksData);
        db.push((`/${blockJson.positionData.x}/${blockJson.positionData.y}/${blockJson.positionData.z}`), "Dirt");
    }
}