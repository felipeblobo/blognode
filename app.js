const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const app = express();
const admin = require("./routes/admin.js");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport);
require('dotenv').config();

// configurações
app.use(
  session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static(__dirname + '/public'));

//config passport
app.use(passport.initialize()); 
app.use(passport.session());

app.use(flash());

//middleware
app.use((req, res, next) => {  
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//uso do body-parser
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

//view engine
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main"
    }
  )
);
app.set("view engine", "handlebars");

//bd
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@blognode-cluster.wm5bj.mongodb.net/blognode-cluster?retryWrites=true&w=majority`
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("Conectado ao Banco de Dados");
  })
  .catch((err) => {
    console.log(`Erro ao conectar-se com o Banco de Dados: ${err}`);
  });

// rotas

app.get("/", (req, res) => {
  Postagem.find().lean()
    .populate("categoria")
    .sort({ date  : "desc" })
    .then((postagens) => {
      res.render("index", { postagens: postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno.");
      res.redirect("/404");
    });
});

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug }).lean()
    .then((postagem) => {
      if (postagem) {
        res.render("postagem/index", { postagem: postagem });
      } else {
        req.flash("error_msg", "Esta postagem não existe.");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao verificar postagem.");
      res.redirect("/");
    });
});

app.get("/categorias", (req, res) => {
  Categoria.find().lean()
    .then((categorias) => {
      res.render("categorias/index", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao listar as categorias.");
      res.redirect("/");
    });
});

app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({ slug: req.params.slug }).lean()
    .then((categoria) => {
      if (categoria) {
        Postagem.find({ categoria: categoria._id }).lean()
          .then((postagens) => {
            res.render("categorias/postagens", {
              postagens: postagens,
              categoria: categoria,
            });
          })
          .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar os posts");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "Esta categoria não existe.");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "Houve um erro interno ao carregar a página desta categoria."
      );
      res.redirect("/");
    });
});

app.get("/404", (req, res) => {
  res.send("Erro 404");
});

app.use("/admin", admin);

app.use("/usuarios", usuarios);



// outros
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});
