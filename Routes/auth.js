let express = require("express");
let router = express.Router();
let {singUp,login, isLogin, checkLogin} = require("../Controllers/auth");
router.post("/createAccount",singUp);
router.post("/login",login);
router.post("/checkLogin",isLogin,checkLogin);
module.exports = router;