const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const dbforms = path.join(__dirname, "data", "app.db");
const db = new sqlite3.Database(dbforms, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'apptest.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Notas (
    Notas_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Titulo VARCHAR(100) NOT NULL,
    Login VARCHAR(100),
    Password VARCHAR(100),
    Comments TEXT
  );`;
db.run(sql_create, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the table");

    const sql_insert = `INSERT INTO Notas (Notas_ID, Titulo, Login, Password, Comments) VALUES
    (1, 'Nota de teste', 'admin', '123', 'teste');`;
    db.run(sql_insert, err => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Successful creation of 3 Notas");
    });
});

app.get("/", (req, res) => {
    {
        res.render("index");
    }
});

app.post('/', (req, res) => {
    db.get("SELECT * from Notas where Login=? and Password=?", [req.body.Login, req.body.Password], function(err, row) {
        if (typeof row !== 'undefined' && row != null) {
            res.redirect('/notas')
        } else {
            res.write('usuário não existe');
            res.end()
        }
    });
});

app.get('/notas', (req, res) => {
    const sql = "SELECT Titulo, Comments FROM Notas;"
    db.all(sql, [], function(err, rows) {
        if (err) {
            throw err;
        }
        res.render("nota", { model: rows });
    });
});

app.get("/create", (req, res) => {
    res.render("create", { model: {} });
});

app.post("/create", (req, res) => {
    const sql = "INSERT INTO Notas (Titulo, Comments) VALUES (?, ?)";
    const book = [req.body.Titulo, req.body.Comments];
    db.run(sql, book, err => {
        if (err) {
            throw err;
        }
        res.redirect("/notas");
    });
});

app.listen(port, () => {
    {
        console.log("http://localhost:3000/");
    }
});