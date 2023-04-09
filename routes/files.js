/**
 * @filename files.js
 * @creationdate 30-03-21
 * @lastModifiied 28-04-21
 * @author Ummi Aishatu Ibrahim 
 * @version 1.0 
 * @purpose  * This is where the uploading and harmonisation of the files take place 
 */
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const router = express.Router();
const File = require('../models/file');
const path = require('path');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const CsvFile = require('../models/csvFile');
const CsvParent = require('../models/csvParent');
const {isLoggedIn} = require('../middleware');
const CSVtoJSON = require('csvtojson')

//this is the where all the file paths 
//are temporary stored in the multer diskstorage
// it then uploads to the server and the database. 
// there is an upload folder, for every upload the file is sent there 
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
//this is the upload function for uploading files 
//it uses multer and we will be taking in files one at a time
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb){
        // this function is to chcek whether 
        //the file inputted is a csv file or not 
        checkFileType(file, cb);
    }
}).single('file');

//  this function that checks whether the file uploaded is a CSV file. 
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

// this is the get method for the upload function, it just gets the profile page after 
// the file as been uploaded.
// @Get method 
router.get('/uploads', isLoggedIn,catchAsync(async (req, res) => {
    res.redirect('/myProfile');
}))

/**
 * this is the post method for the upload function
 * when the user uploads a file, the file is being read immediately
 * then as it reads to goes through the file for any row that has been 
 * duplicated twice if yes remove the row and then continues until 
 * it reaches the end of the csv file. 
 * @POST method 
 */
router.post('/uploads', isLoggedIn,catchAsync( async (req,response) => {
    upload(req, response, (error) =>{
        if(error){
            response.render('myProfile/myProfile', {
                msg: error
            });
        }else{
            const file = req.file.path;
            if(file == undefined){
                req.flash('error', 'No, File selected');
                response.render('myProfile/myProfile');
            }else{ 
                //reading of file 
                CSVtoJSON().fromFile(file)
                .then(async files => {
                    let newCsvParent = new CsvParent(
                        {
                            user: req.user._id,
                            file_path: file
                        }
                    )
                    let savedParent = await newCsvParent.save()
                    // harmonisation process 
                    var mapMgt = new Map();
                    files.forEach(function(item){
                        mapMgt.set(JSON.stringify(item), item)
                        //console.log(item, 'item[]');
                    })
                    const uniqueUsers = [...mapMgt.values()];
                    // looping through all the contents 
                    for(var i=0; i<uniqueUsers.length; i++){
                        let newCsvFile = new CsvFile({
                            csvId:uniqueUsers[i].id,
                            first_name:uniqueUsers[i].first_name,
                            last_name: uniqueUsers[i].last_name,
                            email: uniqueUsers[i].email,
                            gender: uniqueUsers[i].gender,
                            ip_address: uniqueUsers[i].ip_address,
                            parent: savedParent._id
                        })
                        let saved = await newCsvFile.save()
                    }
                req.flash('success', 'HARMONISATION COMPLETE!!!');
                response.redirect('myProfile');
                })
                .catch(err=>{
                    req.flash('error', 'There has been an error!!!');
                    console.log(err)
                })
                
            }
        }
    });
}));

/**
 * @GET method 
 * this is where all the content from one file is being displayed for manual viewing 
 * 
 */
router.get('/showdata/:id', isLoggedIn,catchAsync(async( req, res) => {
    // if not a user go back to login page 
    if(Boolean(req.user)==false){
        res.redirect('/login')
    }
    else {
    let currentFile = req.params.id;
    let result = await CsvFile.find({parent:currentFile})
    console.log(result,"displaying the data content")
    res.render('showdata', {result: result});
    }
}));


/**
 * @GET method 
 * this is where all the files that have been uploaded will be displayed on my profile 
 * page. 
 */
router.get('/myProfile', isLoggedIn,catchAsync (async  (req, res) => {
    // if not a user go back to login page 
    if(Boolean(req.user)==false){
        res.redirect('/login')
    }
    else {
        try {
            const files = await CsvParent.find({user:req.user._id});
            const user = await User.find();
            console.log(files,"file list")
            res.render('myProfile/myProfile', {
                    user: user,
                    files: files,
                });
        }catch(e){
            req.flash('error', e.message);
            //res.redirect('myProfile');
        } 
    }
   
}));

// export it because its a route
module.exports = router;