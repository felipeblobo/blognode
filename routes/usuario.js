const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const bcrypt = require('bcryptjs')

const Usuario = mongoose.model('usuarios');

router.get('/registro', (req,res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req,res) => {
    let erros = [];
    

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Nome inválido'})
        console.log('oi')
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'Email inválido'})
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: 'Senha inválida'})
    }

    if (req.body.senha.length < 4) {
        erros.push({texto: 'Digite uma senha com mais de 4 caracteres.'})
    }

    if (req.body.senha != req.body.senha2) {    
        erros.push({texto: 'Digite senhas iguais nos campos requeridos'})
    }

    if (erros.length > 0) {

        res.render('usuarios/registro', {erros: erros})
 
    } else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash('error_msg', 'Esse email já foi cadastrado no sistema.')
                res.redirect('/usuarios/registro')
            } else {
                const novoUsuario = new Usuario ({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash(error_msg, 'Houve um erro durante o salvamento do usuário')
                            req.redirect('/')
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Usuário criado com sucesso')
                            res.redirect('/')
                        }).catch(err => {
                            req.flash('error_msg', 'Houve um erro ao criar o usuário')
                            res.redirect('/usuarios/registro')
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno.')
            res.redirect('/')
        })

    }
})


module.exports = router