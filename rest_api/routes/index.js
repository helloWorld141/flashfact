var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');

function fetchData(callback, deck) {
    let db = new sqlite.Database('../data/words.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        else console.log('Connected to words database.');
    });
    db.serialize(() => {
        db.all(`SELECT * FROM word where deck='${deck}'`, (err, rows) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Successfuly read data.")
                callback(rows);
            }
        });
    });
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    return db;
}
/* GET home page. */
router.get('/deck/:deckName', function (req, res, next) {
    console.log(req.params);
    const deck = req.params['deckName'];
    if (deck) {
        console.log(deck);
        callback = function(rows) {
            res.send(rows);
        };
        fetchData(callback, deck);
    }
    else res.send(null);
});

module.exports = router;
