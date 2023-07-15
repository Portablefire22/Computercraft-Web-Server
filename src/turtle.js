import { JsonDB, Config } from "node-json-db";

/*

    Deals with saving the world data to a file

*/

export default {
    saveTurtleData: async function(turtle,turtleID) {
        var db = new JsonDB(new Config("./public/turtleInfo", true, true, "/"));
        
        // Store using ('/{x}/{y}/{z}', {data})
        var rawTurtleData = ("%s",turtle)
        var turtleJson = JSON.parse(rawTurtleData);
        console.log(turtleJson)
        db.push(`/${turtleID}`, {
            x: turtleJson.x,
            y: turtleJson.y,
            z: turtleJson.z,
            direction: turtleJson.direction,
            tunnelsComplete: turtleJson.tunnelsComplete,
        });
    },

    getTurtleData: async function(turtle) {
        var db = new JsonDB(new Config("./public/turtleInfo", true, true, "/"));
        var turtleName = turtle.toString();
        try{
            var data = await db.getData(`/${turtleName}/`);
            return JSON.stringify(data);
        } catch(error) {
            console.error(error);
            var data = {
                x: 0,
                y: 0,
                z: 0,
                direction: 0,
            }
            return data;
        }
    },    
}