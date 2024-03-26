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
    db.serialize(()=>{
        db.run(`
CREATE TABLE IF NOT EXISTS TIPO_PAO (
    idTipoPao INTEGER PRIMARY KEY AUTOINCREMENT,
    nomePao VARCHAR(45),
    FK_RECEITA_id_receita INTEGER,
    FOREIGN KEY (FK_RECEITA_id_receita ) REFERENCES RECEITA (idReceita)
)
`);

// Criar a tabela RECEITA
db.run(`
CREATE TABLE IF NOT EXISTS RECEITA (
    id_receita INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_receita VARCHAR(45),
    modo_preparo VARCHAR(100)
)
`);

// Criar a tabela REGISTRO_PRODUCAO_DIARIA
db.run(`
CREATE TABLE IF NOT EXISTS REGISTRO_PRODUCAO_DIARIA (
    id_registroProducao INTEGER PRIMARY KEY AUTOINCREMENT,
    data_producao DATE,
    quantidade_produzida INTEGER,
    FK_TIPO_PAO_idTipoPao INTEGER,
    FOREIGN KEY (FK_TIPO_PAO_idTipoPao ) REFERENCES TIPO_PAO (idTipoPao)
)
`);

// Criar a tabela REGISTRO_DESPERDICIO_DIARIO
db.run(`
CREATE TABLE IF NOT EXISTS REGISTRO_DESPERDICIO_DIARIO (
    id_registroDesperdicio INTEGER PRIMARY KEY AUTOINCREMENT,
    data_desperdicio DATE,
    quantidade_desperdicada INTEGER,
    FK_TIPO_PAO_idTipoPao INTEGER,
    FOREIGN KEY (FK_TIPO_PAO_idTipoPao ) REFERENCES TIPO_PAO (idTipoPao)
)
`);

// Criar a tabela INGREDIENTE
db.run(`
CREATE TABLE IF NOT EXISTS INGREDIENTE (
    idIngrediente INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeIngrediente VARCHAR(45),
    dataValidade DATE
)
`);

// Criar a tabela MATERIAL_EQUIPAMENTO
db.run(`
CREATE TABLE IF NOT EXISTS MATERIAL_EQUIPAMENTO (
    id_materialEquipamento INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_materialEquipamento VARCHAR(45),
    tipo_materialEquipamento VARCHAR(45)
)
`);

// Criar a tabela REGISTRO_ENTRADA
db.run(`
CREATE TABLE IF NOT EXISTS REGISTRO_ENTRADA (
    id_entrada INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade_entrada INTEGER,
    data_entrada DATE,
    tipo_entrada TEXT CHECK (tipo_entrada IN ('Material', 'Equipamento', 'Ingrediente')),
    FK_ingrediente_stock INTEGER,
    FK_material_equipamento INTEGER,
    FOREIGN KEY (FK_material_equipamento) REFERENCES MATERIAL_EQUIPAMENTO (id_materialEquipamento)
)
`);

// Criar a tabela REGISTRO_SAIDA
db.run(`
CREATE TABLE IF NOT EXISTS REGISTRO_SAIDA (
    id_saida INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade_saida INTEGER,
    data_saida DATE,
    tipo_saida VARCHAR(45),
    FK_material_equipamento INTEGER,
    FOREIGN KEY (FK_material_equipamento) REFERENCES MATERIAL_EQUIPAMENTO (id_materialEquipamento)
)
`);

// Continuar criando outras tabelas...
// Continuação...

// Criar a tabela CLIENTE
db.run(`
    CREATE TABLE IF NOT EXISTS CLIENTE (
        id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente VARCHAR(45),
        tipo_cliente TEXT CHECK (tipo_cliente IN ('Singular', 'Empresa', 'Balcao'))
    )
`);

// Criar a tabela VENDA_BALCAO
db.run(`
    CREATE TABLE IF NOT EXISTS VENDA_BALCAO (
        id_balcao INTEGER PRIMARY KEY AUTOINCREMENT,
        quantidade INTEGER,
        FK_TIPO_PAO_idTipoPao INTEGER,
        FOREIGN KEY (FK_TIPO_PAO_idTipoPao ) REFERENCES TIPO_PAO (idTipoPao)
    )
`);

// Criar a tabela MAPA_ENCOMENDA 
db.run(`
    CREATE TABLE IF NOT EXISTS MAPA_ENCOMENDA (
        id_mapaEncomenda INTEGER PRIMARY KEY AUTOINCREMENT,
        quantidade_encomenda INTEGER,
        montante INTEGER,
        data_encomenda DATE,
        FK_TIPO_PAO_idTipoPao INTEGER,
        FOREIGN KEY (FK_TIPO_PAO_idTipoPao ) REFERENCES TIPO_PAO (idTipoPao)
    )
`);

// Criar a tabela VENDA_NAO_REALIZADA
db.run(`
    CREATE TABLE IF NOT EXISTS VENDA_NAO_REALIZADA (
        id_naoRealizadas INTEGER PRIMARY KEY AUTOINCREMENT,
        data DATE,
        FK_CLIENTE_id_cliente INTEGER,
        FOREIGN KEY (FK_CLIENTE_id_cliente ) REFERENCES CLIENTE (id_Cliente)
    )
`);

// Criar a tabela ENCOMENDA
db.run(`
    CREATE TABLE IF NOT EXISTS ENCOMENDA (
        id_encomenda INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_pagamento TEXT CHECK (tipo_pagamento IN ('Tranferencia', 'Deposito', 'Cartao')),
        data_pagamento DATE,
        data_entrega DATE,
        FK_MAPA_ENCOMENDA_id_mapaEncomenda INTEGER,
        FK_CLIENTE_id_cliente INTEGER,
        FOREIGN KEY (FK_CLIENTE_id_cliente ) REFERENCES CLIENTE (id_Cliente)
    )
`);

// Criar a tabela FUNCIONARIO
db.run(`
    CREATE TABLE IF NOT EXISTS FUNCIONARIO (
        id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_funcionario VARCHAR(45),
        endereco_funcionario VARCHAR(45),
        telefone_funcionario INTEGER,
        cargo INTEGER,
        horario_trabalho INTEGER,
        dias_trabalho INTEGER,
        salario INTEGER,
        FK_PAGAMENTO_SALARIAL_id_pagamentoSalarial INTEGER,
        FOREIGN KEY (FK_PAGAMENTO_SALARIAL_id_pagamentoSalarial ) REFERENCES PAGAMENTO_SALARIAL (id_pagamentoSalarial)
    )
`);

// Criar a tabela REGISTRO_DIAS_TRABALHO 
db.run(`
    CREATE TABLE IF NOT EXISTS REGISTRO_DIAS_TRABALHO (
        id_registoDiasTrabalho INTEGER PRIMARY KEY AUTOINCREMENT,
        data_registo DATE,
        FK_FUNCIONARIO_id_funcionario INTEGER,
        FOREIGN KEY (FK_FUNCIONARIO_id_funcionario ) REFERENCES FUNCIONARIO (id_Funcionario)
    )
`);

// Criar a tabela MAPA_ACTIVIDADE  
db.run(`
    CREATE TABLE IF NOT EXISTS MAPA_ACTIVIDADE (
        id_mapaActividade INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_actividade TEXT CHECK (tipo_actividade IN ('Diaria', 'Semanal', 'Mensal')),
        data_inicio DATE,
        data_fim DATE,
        FK_FUNCIONARIO_id_funcionario INTEGER,
        FOREIGN KEY (FK_FUNCIONARIO_id_funcionario ) REFERENCES FUNCIONARIO (id_Funcionario)
    )
`);

// Criar a tabela MAPA_PRODUTIVIDADE 
db.run(`
    CREATE TABLE IF NOT EXISTS MAPA_PRODUTIVIDADE (
        id_mapaProdutividade INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_actividade TEXT CHECK (tipo_actividade IN ('Diaria', 'Semanal', 'Mensal')),
        produtividade INTEGER,
        FK_FUNCIONARIO_id_funcionario INTEGER,
        FOREIGN KEY (FK_FUNCIONARIO_id_funcionario ) REFERENCES FUNCIONARIO (id_Funcionario)
    )
`);

// Continuar com a criação de outras tabelas e suas restrições de chave estrangeira...
// Continuação...

// Criar a tabela NOTAS_DESEMPENHO 
db.run(`
    CREATE TABLE IF NOT EXISTS NOTAS_DESEMPENHO (
        id_desempenho INTEGER PRIMARY KEY AUTOINCREMENT,
        nota INTEGER,
        data_nota DATE,
        FK_FUNCIONARIO_id_funcionario INTEGER,
        FOREIGN KEY (FK_FUNCIONARIO_id_funcionario ) REFERENCES FUNCIONARIO (id_Funcionario)

    )
`);

// Criar a tabela DESPESA
db.run(`
    CREATE TABLE IF NOT EXISTS DESPESA (
        id_despesa INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao VARCHAR(45),
        valor INTEGER,
        data_despesa DATE
    )
`);

// Criar a tabela PAGAMENTO_SALARIAL
db.run(`
    CREATE TABLE IF NOT EXISTS PAGAMENTO_SALARIAL (
        id_pagamentoSalarial INTEGER PRIMARY KEY AUTOINCREMENT,
        valor INTEGER,
        data_pagamento DATE
    )
`);

// Criar a tabela COMPRA_GERAL 
db.run(`
    CREATE TABLE IF NOT EXISTS COMPRA_GERAL (
        id_compraGeral INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao VARCHAR(45),
        valor INTEGER,
        data_compra DATE,
        FK_REGISTRO_ENTRADA_id_entrada INTEGER,
        FOREIGN KEY (FK_REGISTRO_ENTRADA_id_entrada ) REFERENCES REGISTRO_ENTRADA (id_entrada)

    )
`);

// Criar a tabela GANHO
db.run(`
    CREATE TABLE IF NOT EXISTS GANHO (
        id_ganhos INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao VARCHAR(45),
        valor INTEGER,
        data_ganho DATE
    )
`);

// Criar a tabela CAIXA 
db.run(`
    CREATE TABLE IF NOT EXISTS CAIXA (
        id_caixa INTEGER PRIMARY KEY AUTOINCREMENT,
        saldo_atual INTEGER,
        FK_VENDA_BALCAO_id_balcao INTEGER,
        FOREIGN KEY (FK_VENDA_BALCAO_id_balcao ) REFERENCES VENDA_BALCAO (id_balcao)

    )
`);

// Criar a tabela TIPO_PAO_INGREDIENTE
db.run(`
    CREATE TABLE IF NOT EXISTS TIPO_PAO_INGREDIENTE (
        FK_TIPO_PAO_idTipoPao INTEGER ,
        FK_INGREDIENTE_IdIngrediente INTEGER,
        FOREIGN KEY (FK_INGREDIENTE_IdIngrediente ) REFERENCES INGREDIENTE (IdIngrediente)
    )
`);

// Criar a tabela RECEITA_INGREDIENTE
db.run(`
    CREATE TABLE IF NOT EXISTS RECEITA_INGREDIENTE (
        FK_INGREDIENTE_idIngrediente INTEGER,
        FK_RECEITA_id_receita INTEGER
    )
`);

// Criar a tabela REGISTRO_VENDA_BALCAO
db.run(`
    CREATE TABLE IF NOT EXISTS REGISTRO_VENDA_BALCAO (
        idRegistroVendaBalcao INTEGER PRIMARY KEY AUTOINCREMENT,
        dataVenda DATE,
        FK_FUNCIONARIO_id_funcionario INTEGER,
        FK_VENDA_BALCAO_id_balcao INTEGER,
        FOREIGN KEY (FK_FUNCIONARIO_id_funcionario ) REFERENCES FUNCIONARIO (id_Funcionario),
        FOREIGN KEY (FK_VENDA_BALCAO_id_balcao ) REFERENCES VENDA_BALCAO (id_balcao)

    )
`);

// Criar a tabela INGREDIENTE_STOCK
db.run(`
    CREATE TABLE IF NOT EXISTS INGREDIENTE_STOCK (
        idIngredienteStock INTEGER PRIMARY KEY AUTOINCREMENT,
        idIngrediente INTEGER,
        quantidade INTEGER,
        data_validade DATE
    )
`);  
    });
  
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
// Rota para criar uma receita
app.post('/api/RECEITA', (req, res) => {
    const { nome_receita, modo_preparo } = req.body;
    db.run('INSERT INTO RECEITA (nome_receita, modo_preparo) VALUES (?, ?)', [nome_receita, modo_preparo], function(err) {
        if (err) {
            res.status(500).send({ error: 'Erro ao criar a receita.' });
            return;
        }
        res.json({ id: this.lastID });
    });
});
app.get('/api/RECEITA', (req, res) => {
    db.all('SELECT * FROM RECEITA', (err, rows) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao buscar itens.' });
            return;
        }
        res.json(rows);
    });
});

// Rota para adicionar um ingrediente
app.post('/api/INGREDIENTE', (req, res) => {
    const { nomeIngrediente, dataValidade } = req.body;
    db.run('INSERT INTO INGREDIENTE (nomeIngrediente, dataValidade) VALUES (?, ?)', [nomeIngrediente, dataValidade], function(err) {
        if (err) {
            res.status(500).send({ error: 'Erro ao adicionar o ingrediente.' });
            return;
        }
        res.json({ id: this.lastID });
    });
});
app.get('/api/INGREDIENTE', (req, res) => {
    db.all('SELECT * FROM INGREDIENTE', (err, rows) => {
        if (err) {
            res.status(500).send({ error: 'Erro ao buscar itens.' });
            return;
        }
        res.json(rows);
    });
});


app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
