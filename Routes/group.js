const { isLogin } = require("../Controllers/auth");
const { createGroup, fetchGroups, addMebmerToGroup, groupDetails, isOwner } = require("../Controllers/group");
let router = require("express").Router();
router.post("/create",isLogin,createGroup);
router.post("/get",isLogin,fetchGroups);
router.post("/addMember",isLogin,addMebmerToGroup);
router.post("/groupDetails",isLogin,isOwner,groupDetails);
module.exports = router;