const { isLogin } = require("../Controllers/auth");
const { createGroup, fetchGroups, addMebmerToGroup } = require("../Controllers/group");
let router = require("express").Router();
router.post("/create",isLogin,createGroup);
router.post("/get",isLogin,fetchGroups);
router.post("/addMember",isLogin,addMebmerToGroup);
module.exports = router;