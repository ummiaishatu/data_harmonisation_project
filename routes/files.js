const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const router = express.Router();
const File = require('../models/file');
const path = require('path');
//const uploadPath = path.join('public', File.fileBasePath);
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const csv = require('csv-parser');
//const {isLoggedIn} = require('../middleware');

const storage =  multer.diskStorage({
    destination: (req, file, cb) =>{ 
        cb(null, 'uploads')
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
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb){
        checkFileType(file, cb);
    }
}).single('file');

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

router.post('/uploads', catchAsync(async (req,response) => {
    upload(req, response, async (error) =>{
        if(error){
            response.render('myProfile/myProfile', {
                msg: error
            });
        }else{
            const file = req.file.path;
            //console.log(file);
            if(file == undefined){
                response.render('myProfile/myProfile', {
                    msg: 'Error: No File Selected'
                });
            }else{
                const result = [];
                fs.createReadStream(file)
                    .pipe(csv())
                    .on('data', (data) => result.push(data))
                    .on('end' ,() => {
                        console.log(result);
                        //console.table(result);
                     }); 
                response.render('myProfile/myProfile', {
                    msg: 'File Uploaded Successfully',
                    //file= `uploads/${req.file.filename}`
                });
            }
        }
    });
}));

router.get('/uploads', catchAsync(async( req, res) => {
    res.render('myProfile/myProfile');
}));

router.get('/myProfile', catchAsync (async  (req, res) => {
    try {
        const files = await File.find();
        const user = await User.find();
        res.render('myProfile/myProfile', {
                    user: user,
                    file: files,
                });
    }catch{
        //res.redirect('/myProfile');
    }
}));

function displayHTMLTable(results){
    var table = "<table class='table'>";
    var data = results.data;

    for(i=0;i< data.length ;i++){
        table+="<tr>";
        var row = data[i];
        var cells = row.join(",").split(",");
        
        for(j=0; j< cells.length ;j++){
            table+= "<td>";
            table+= cells[j];
            table+= "</td>";    
        }
        table+= "</tr>";
    }
    table+= "</table>";
    $("#parsed_csv_list").html(table);
};

module.exports = router;