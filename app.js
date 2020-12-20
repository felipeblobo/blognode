const express = require('express');
const handlebars = require('express-handlebars');
// const mongoose = require('mongoose')
const app = express();
const admin = require('./routes/admin.js');
const path = require('path');

// configurações
app.use(express.urlencoded());   //uso do body-parser
app.use(express.json());

app.engine('handlebars', handlebars({defaultLayout: "main"}));  
app.set('view engine', 'handlebars');

// app.use(express.static(path.join(__dirname, 'public')));
// rotas

app.use('/admin', admin);


// outros
const port = 8081;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`)
})