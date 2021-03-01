module.exports = {
  //checkAuthenticated
  checkAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  },
  //checkNotAuthenticated
  checkNotAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  },
};
