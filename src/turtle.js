import { JsonDB, Config } from "node-json-db";

/*

    Deals with saving the world data to a file

*/

export default {
    saveTurtleData: async function(turtle) {
        var db = new JsonDB(new Config("./public/turtleInfo", true, true, "/"));
        
        // Store using ('/{x}/{y}/{z}', {data})
        var rawTurtleData = ("%s",turtle)
        var turtleJson = JSON.parse(rawTurtleData);
        console.log(turtleJson)
        db.push(`/${turtleJson.turtleID}`, {
            x: turtleJson.x,
            y: turtleJson.y,
            z: turtleJson.z,
            direction: turtleJson.direction,
            tunnelsComplete: turtleJson.tunnelsComplete,
        });
    },
}