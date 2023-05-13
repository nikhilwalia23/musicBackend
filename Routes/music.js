const express = require("express");
const music = require("../Controllers/Music/music")
const router = express.Router();

//Stream Music From Files
router.get("/discover",music.dicoverSongs);
router.get("/getSingers",music.getSinger);
router.get("/:musicId",music.streamMusic);
module.exports = router;