// Linking the noteBody in db to this routes.
var noteBody = require("../db/noteBody")

//Create promise-based versions of functions using node style callbacks
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

// Create a route
module.exports = function(app) {

    //Display all notes
    app.get("/api/notes", function(req, res) {
        res.json(noteBody);
    });

    //Create new posts
    app.post("/api/notes", function(req, res) {

        let newNote = req.body;

        // check to find last id in our notes json file, and assign the note to one greater than that id
        let lastId = noteBody[noteBody.length - 1];
        let newId = lastId.id + 1;
        newNote["id"] = newId;
        
        console.log("Req.body:", req.body);
        noteBody.push(newNote);

        // write to the noteBody.json file as well
        writeFileAsync("./db/noteBody.json", JSON.stringify(noteBody)).then(function() {
            console.log("noteBody.json has been updated!");
        });

        res.json(newNote);
    });

    // Delete a post
    app.delete("/api/notes/:id", function(req, res) {

        console.log("Req.params:", req.params);
        let chosenId = parseInt(req.params.id);
        console.log(chosenId);


        for (let i = 0; i < noteBody.length; i++) {
            if (chosenId === noteBody[i].id) {
                // delete noteBody[i];
                noteBody.splice(i,1);
                
                let noteJSON = JSON.stringify(noteBody, null, 2);

                writeFileAsync("./db/noteBody.json", noteJSON).then(function() {
                console.log ("Chosen note has been deleted!");
            });                 
            }
        }
        res.json(noteBody);
    });
        
};