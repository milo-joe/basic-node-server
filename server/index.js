const express = require('express');
const DataStore = require('nedb');
const cors = require('cors');

const app = express();
// allow post and get from web browsers.
app.use(cors());
//using the json format.
app.use(express.json());

//loading the database and creating one if it does not exist.
const database = new DataStore('database.db');
database.loadDatabase();

// takes pos and desc from the request
app.post("/api/mine/", (req, res)=>{
    console.log("new POST request!");

    const data = req.body;
    data.date = Date.now();

    database.insert(data);

    //send a response back in json format
    res.json({
        status:'success',
        date:data.date
    });

});

//return all the saved positions in the db
// used to load old data.
app.get("/api/mine", (req, res) =>{
    console.log("new GET request!");

    //find all the items in the db and return them if no err occurs
    database.find({}, (err, data)=>{
        if(err){
            console.log("ERROR: cannot find data in db!");
            return;
        }

        res.json(data);
    });
});

// https://stackoverflow.com/questions/33590114/update-a-row-in-nedb
app.put("/api/mine", (req, res)=>{
    console.log("new PUT request!");

    const data = req.body;
    database.update({date:data.date},{ $set: {pos:data.pos, desc: data.desc}},{}, (err, data)=>{
        if(err){
            console.log("ERROR:could not update db!");
            return;
        }

        console.log("items updated successfully!" + data);
    } );

    res.json({
        status:'success'
    });

    //cleaning the database otherwise the deleted items will be replaces by {id:"deleteditem"}
    database.persistence.compactDatafile();


});

app.delete("/api/mine", (req, res)=>{
    console.log("new DELETE request");
    const data = req.body;
    database.remove({pos:data.pos}, {}, (err, numRemoved)=>{
        if(err){
            console.log("ERROR: cannot delete item!");
            return;
        }
        res.json({
            status:"deleted"
        });

        //cleaning the database otherwise the deleted items will be replaces by {id:"deleteditem"}
        database.persistence.compactDatafile();


    });
});

app.listen(9000, ()=>{
    console.log("listening on port: 9000");
});


