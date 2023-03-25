const {createReadStream,stat} = require("fs");
const {promisify} = require("util");
const {pipeline} = require("stream");
const express = require("express");
const e = require("express");
async function streamMusic(req,res) 
{
    const {musicId} = req.params;
    const tempSong = `${process.env.MUSIC_ROOT}/${musicId}.mp3`;
    //Check if Music Id is Valid or not Based on MusicId
    if(true)
    {
        //Stream Music to FrontEnd With Given Range (Get range start and end value from range header of request)
        const fileInfo = promisify(stat);
        const {size} = await fileInfo(tempSong);
        console.log("Size fo Given File "+size)
        let songStream = createReadStream(tempSong,{start:0,end:500000});
        res.set({
            "Content-Range": `bytes ${0}-${500000}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": 500000 - 0 + 1,
            "Content-Type": "audio/mp3"
          });
        pipeline(songStream,res,err => 
            {
                console.log(err);
            })
       return res.status(206);
    }
    else
    {
        return res.status(404).json({"msg":"Music Not Found"});
    }
}
module.exports = {streamMusic};