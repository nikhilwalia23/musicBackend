const {createReadStream,stat} = require("fs");
const {promisify} = require("util");
const {pipeline} = require("stream");
const { Song } = require("../../Models/song");
async function streamMusic(req,res) 
{
    const {musicId} = req.params;
    const tempSong = `${process.env.MUSIC_ROOT}/${musicId}.mp3`;
    const range = req.headers.range;
    //Check if Music Id is Valid or not Based on MusicId
    if(range)
    {
        const fileInfo = promisify(stat);
        const {size} = await fileInfo(tempSong);
        //Stream Music to FrontEnd With Given Range (Get range start and end value from range header of request)
        let [start,end] = range.replace(/bytes=/,"").split("-");
        start = parseInt(start,10);
        end = end ? parseInt(end) : size - 1 ;
        if(!isNaN(start) && isNaN(end))
        {
            start = start;
            end = size - 1;
        }
        if(isNaN(start) && !isNaN(end))
        {
            start = size - end;
            end = size - 1;
        }
        console.log(start + " " + end);
        if(start>=size || end>=size)
        {
            //Fix This Issue Later (Does not returning responce)
            // res.set({"Content-Range":`bytes */${size}`})
            console.log("here to")
            return res.status(416).json({"error":"Invalid Range for Requested Document"});
        }
        await res.set({
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "audio/mp3"
          });
        let songStream = createReadStream(tempSong,{start:start,end:end});
        pipeline(songStream,res,err => 
            {
                if(err)
                {
                    return res.status(200).json({"error":"Internal Server Error"});
                }
            })
    //    return res.status(206);
    }
    else
    {
        return res.status(404).json({"error":"Invalid Range"});
    }
}
async function dicoverSongs (req,res)
{
    let songCount = req.body.songCount;
    Song.find().limit(songCount).then((songs)=> 
    {
        return res.status(200).json(songs);
    }).catch((err)=> 
    {
        if(err)
        {
            return res.status(400).json({"error":"Something Wrong Check music.js(69)"});
        }
    });
}
async function getSinger(req,res)
{
    let artistCount = req.body.artistCount;
    let artists = new Set();
    Song.find().limit(artistCount).then((songs)=> 
    {
        for(let song of songs)
        {
            artists.add(song.singer);
            console.log(song.singer);
        }
        let arr = Array.from(artists);
        return res.status(200).json({"singers":arr});
    }).catch((err)=> 
    {
        return res.status(400).json({"error":"Something Wrong Check music.js(82)"});

    });
}
module.exports = {streamMusic,dicoverSongs,getSinger};