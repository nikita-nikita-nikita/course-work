const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const {Schema, model} = require("mongoose");
const app = express();
const urlMDB = "mongodb+srv://Nikita:fx98gu90@highscores-lxbtb.mongodb.net/highscores";
const port = process.env.PORT||3000;
async function start() {
    try {
        await mongoose.connect(urlMDB, {useNewUrlParser:true,  useUnifiedTopology: true});
        app.listen(port, ()=>{
            console.log("server running port: " + port)
        });
    }catch (e) {
        console.log(e);
    }
}
const highscores = new Schema({
    name:String,
    score:Number
});
const HighScores = model("Highscores", highscores);
const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));
app.use(bodyParser.json());

app.get("/highscores", async (req, res) => {
    const result = await HighScores.find({});
    res.send({highscores:result});
});

app.post("/gethighsores",async ({body:{highscores}}) => {
    const result = await HighScores.find({});
    for (let i = 0; i < result.length; i++) {
        await HighScores.remove({_id: result[i]._id}, (error)=>{
            if(error){
                console.log(error);
            }
        });
    }
    console.log(highscores);
    try {
        for (let i = 0; i < highscores.length; i++) {
            const record = new HighScores({
                name:highscores[i].name,
                score: highscores[i].score
            });
            await record.save();
        }

    }catch (error) {
        console.log(error)
    }

});
start();