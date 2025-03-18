const express = require('express');
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 4000;

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/:mode', (req, res) => {
    res.send(`Hello ${req.params.mode}!`);
}
);

app.use('/api/scoreboard', router);
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);