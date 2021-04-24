const express = require("express");
const router = express.Router();
const catchAynsc = require('../utils/catchAsync');
const File = require('../models/file');

router.post('/myProfile', catchAynsc(async (req, res) => {
    saveFile(file, req.body.cover);
}));


function saveFile(file, coverEncoded){
    if(coverencoded == null) return 
    const cover = JSON.parse(coverEncoded);
    if(cover != null && fileMimeTypes.includes(cover.type)){
        file.file = new Buffer.from(cover.data, 'base64');
        file.fileType = cover.type
    }
};

module.exports = router;