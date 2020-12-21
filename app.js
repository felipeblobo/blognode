const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin.js');
const path = require('path');

// configurações
app.use(express.urlencoded({extended: true}));   //uso do body-parser
app.use(express.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blognode', { useNewUrlParser: true }).then(() => {
    console.log('Conectado ao Banco de Dados')
}).catch((err) => {
    console.log(`Erro ao conectar-se com o Banco de Dados: ${err}`)
});
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