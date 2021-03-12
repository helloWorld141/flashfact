var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');

function fetchData(callback) {
    let db = new sqlite.Database('../data/words.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        else console.log('Connected to words database.');
    });
    db.serialize(() => {
        db.all(`SELECT * FROM word`, (err, rows) => {
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
router.get('/', function (req, res, next) {
    callback = function(rows) {
        res.send(rows);
    };
    fetchData(callback);
});

module.exports = router;
