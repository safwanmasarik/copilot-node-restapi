const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// create an Express REST API server that return JSON data i.e "Salam Malaysia Madani!!" when a user sends a GET request to the server's /api/ path.
app.get('/api/', (req, res) => {
    res.json({ message: "Salam Malaysia Madani!!" });
});


// create a route in the Express server that returns the JSON data from the "negeri.json" file when a user sends a GET request to the server's /api/negeri path.
app.get('/api/negeri', (req, res) => {
    fs.readFile('negeri.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
        res.json(JSON.parse(data));
    });
});


// create a POST request route in the Express server that add a new state as JSON object to the JSON data array from the "negeri.json" file and save the file.
app.post('/api/negeri', (req, res) => {
    fs.readFile('negeri.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
        const negeri = JSON.parse(data);
        negeri.push(req.body);
        fs.writeFile('negeri.json', JSON.stringify(negeri), (err) => {
            if (err) {
                res.status(500).json({ message: "Internal Server Error" });
                return;
            }
            res.json({ message: "State added successfully" });
        });
    });
});



// Create a PUT request route in the Express server that update name based on id from the "negeri.json" file and save the file.
app.put('/api/negeri/:id', (req, res) => {
    fs.readFile('negeri.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
        const negeri = JSON.parse(data);
        const index = negeri.findIndex(state => state.id === parseInt(req.params.id));
        if (index === -1) {
            res.status(404).json({ message: "State not found" });
            return;
        }
        negeri[index].name = req.body.name;
        fs.writeFile('negeri.json', JSON.stringify(negeri), (err) => {
            if (err) {
                res.status(500).json({ message: "Internal Server Error" });
                return;
            }
            res.json({ message: "State updated successfully" });
        });
    });
});



// create a DELETE request route in the Express server that delete data based on ID from the "negeri.json" file and save the file.
app.delete('/api/negeri/:id', (req, res) => {
    fs.readFile('negeri.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
        const negeri = JSON.parse(data);
        const index = negeri.findIndex(state => state.id === parseInt(req.params.id));
        if (index === -1) {
            res.status(404).json({ message: "State not found" });
            return;
        }
        negeri.splice(index, 1);
        fs.writeFile('negeri.json', JSON.stringify(negeri), (err) => {
            if (err) {
                res.status(500).json({ message: "Internal Server Error" });
                return;
            }
            res.json({ message: "State deleted successfully" });
        });
    });
});


module.exports = app;
