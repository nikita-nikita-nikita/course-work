const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT||3000;
async function start() {
    try {
        app.listen(port, ()=>{
            console.log("server running port: " + port)
        });
    }catch (e) {
        console.log(e);
    }
}
const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));
app.use(bodyParser.json());

app.get("/highscores", async (req, res) => {
    fs.readFile('highscores.json', (err, buffer) => {
        let data = JSON.parse(buffer.toString());
        res.send({highscores:data});
    });
});

app.post("/gethighsores",async ({body:{highscores}}) => {
    console.log(highscores);
    fs.writeFileSync("highscores.json", JSON.stringify(highscores));
});
start();