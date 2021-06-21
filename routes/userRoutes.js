const express = require("express");
const { indexView, addPostView, addView, testView, updateView, updatePostView, deleteView } = require("../controller/userController");

const multer = require('multer');
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });



const router = express.Router();


router.get('/', indexView);
router.get('/test', testView);
router.get('/adduser', addView);
router.get('/update/:id', updateView);
router.post('/delete', deleteView);
router.post('/update', updatePostView);
router.post('/adduser', upload.single('myimage'), addPostView);



module.exports = router;