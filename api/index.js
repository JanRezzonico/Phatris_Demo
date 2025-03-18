const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Scoreboard = require('../Models/Scoreboard');
dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

connect();

router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const query = Scoreboard.findOne({ username: req.body.username, mode: req.body.mode })
            .select('username points mode');

        const obj = await query.exec();
        if (obj && obj.points < req.body.points) {
            await Scoreboard.updateOne({ username: obj.username, mode: obj.mode }, { points: req.body.points });
            console.log(`Updated value ${obj.username}`);
        } else if (!obj) {
            const newValue = new Scoreboard({ username: req.body.username, points: req.body.points, mode: req.body.mode });
            const savedValue = await newValue.save();
            console.log(`${savedValue.username} saved in MongoDB`);
        }
        res.status(200).send('Success');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:mode', async (req, res) => {
    try {
        const values = [];
        const query = Scoreboard.find({ mode: req.params.mode })
            .select('username points')
            .limit(20)
            .sort({ points: "desc" });

        const results = await query.exec();
        results.forEach(element => {
            console.log(`${element.username} has scored ${element.points} points`);
            values.push({ username: element.username, points: element.points });
        });
        res.send(JSON.stringify(values));
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.use('/api/scoreboard', router);

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
