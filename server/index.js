// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Criar banco de dados SQLite e tabela
let db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
    db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)');
});

// Rotas
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao buscar itens.' });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/items', (req, res) => {
    const { name, description } = req.body;
    db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], function(err) {
        if (err) {
            res.status(500).send({ error: 'Erro ao adicionar item.' });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.put('/api/items/:id', (req, res) => {
    const { name, description } = req.body;
    const id = req.params.id;
    db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], function(err) {
        if (err) {
            res.status(500).send({ error: 'Erro ao atualizar item.' });
            return;
        }
        res.json({ message: 'Item atualizado com sucesso.' });
    });
});

app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM items WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).send({ error: 'Erro ao excluir item.' });
            return;
        }
        res.json({ message: 'Item excluído com sucesso.' });
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
