const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const router = express.Router();
const File = require('../models/file');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filePath = `files/${id}${ext}`;
        File.create({filePath})
            .then(() => {
                 cb(null, filePath);
            })
    }
})

const upload = multer ({
    storage: storage,
    limits: {fieSize: 10000000000},
    fileFilter: function (req, file, cb){
        checkFileType(file, cb);
    }
}).array('file-upload');



function checkFileType(file, cb) {
    const filetypes = /csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: CSV Files only');
    }
};

router.get('/files', (req, res) => {
    File.findOne({})
        .then((files) => {
            fs.createReadStream(files.filePath)
                .on(files, (row) => {
                    console.log(row);
                })
                .pipe(csv())
                .on('end', () => {
                    console.log('CSV file sucessfully processed');
                });
            res.render('myProfile/myProfile', {files: files});
        })
});

/**
 * router.get('/uploads:id', (req, res) => {
    let id = req.params._id;
    File.findById(id)
        .then((files) => {
            res.render('myProfile/myProfile', {files: files});
        });
});
 */

router.post('/uploads',(req, response) => {
    upload(req, response, (error) => {
        if(error){
            response.render('myProfile/myProfile', {
                msg: error
            });
        }else{
            console.log(req.files);
            if(req.files === undefined){
                response.render('myProfile/myProfile', {
                    msg: 'Error: No File Selected'
                });
            }else{
                response.render('myProfile/myProfile', {
                    msg: 'File Uploaded Successfully',
                    //file= `uploads/${req.file.filename}`
                });
            }
        }
    })
});






/**
 * function checkFileType(file, callback){
    const filetypes = /csv|json/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return callback(null, true);
    }else{
        callback('Error: CSV or JSON files Only!');
    }
}
 */

/**
 * //downloading the file after harmoniszing
const input = document.getElementById('file');
const button = document.getElementById('share');
let objectURL;

input.addEventListener('change', function(){
    if(objectURL){
        URL.revokeObjectURL(objectURL);
    }

    const file = this.files[0];
    objectURL = URL.createObjectURL(file);

    button.download = file.name;
    button.href = objectURL;
});

 */

module.exports = router;