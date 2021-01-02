const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias')

router.get('/', (req,res) => {
    res.render('admin/index')
});
router.get('/posts', (req,res) => {
    res.send('Página de postagens')
});
router.get('/categorias', (req,res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/categorias', {categorias:categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve erro ao listar as categorias.')
        res.redirect('/admin') 
    })
});
router.get('/categorias/add', (req,res) => {
    res.render('admin/addcategorias')   
});

router.post('/categorias/nova', (req,res) => {
    let erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Insira um nome com no mínimo 3 caracteres."})
    }

    if (erros.length > 0) {
        res.render('admin/addcategorias', {erros: erros})    
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria (novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao salvar a categoria./n Tente novamente')
            res.redirect('/admin')
        })

    }});

    router.get('/categorias/edit/:id', (req,res) => {

    })
    
    

module.exports = router