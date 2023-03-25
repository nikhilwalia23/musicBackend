const express = require("express");
const music = require("../Controllers/Music/music")
const router = express.Router();

//Stream Music From Files
router.get("/:musicId",music.streamMusic);
module.exports = router;