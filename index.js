const express = require('express');
const bodyParser = require('body-parser');
let fetch;

(async () => {
    const nodeFetch = await import('node-fetch');
    fetch = nodeFetch.default;
})();

const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/first.html');
});

const indexfile = fs.readFileSync('index.html', 'utf-8');

const replaceVal = (tempval, orval) => {
    let temp = tempval.replace("{%tempval%}", orval.main.temp);
    temp = temp.replace("{%tempmin%}", orval.main.temp_min);
    temp = temp.replace("{%tempmax%}", orval.main.temp_max);
    temp = temp.replace("{%location%}", orval.name);
    temp = temp.replace("{%country%}", orval.sys.country);
    return temp;
};

app.post('/', function(req, res) {
    const city = req.body.city_name;

    if (!fetch) {
        res.status(500).send('Error loading fetch module');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=374cb2352e308a68fb4eaa4d5a6f3d61&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data from API');
            }
            return response.json();
        })
        .then(data => {
            const arr = [data];
            const realtime = arr.map(val =>
                replaceVal(indexfile, val)
            ).join("");
            res.send(realtime);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data from API');
        });
});

const port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});
