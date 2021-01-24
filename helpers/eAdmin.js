module.exports = {
  eAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1) {
      return next();
    }

    req.flash("error_msg", "Somente administradores têm acesso a essa seção.");
    res.redirect("/");
  },
};
