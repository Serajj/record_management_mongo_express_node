const aboutModel = require("../model/aboutModel");
const userModel = require("../model/userModel");
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})




const indexView = (req, res, next) => {

    aboutModel.find().
        populate('user_id').
        exec(function (err, records) {
            if (err) return handleError(err);
            console.log('The author is %s', records[1]);
            res.render('home', { records });
            // prints "The author is Ian Fleming"
        });

}

const addView = (req, res, next) => {
    const error = req.session.error;
    req.session.error = "";
    res.render('add', { error: error });

}




const updateView = (req, res, next) => {


    const error = req.session.error;
    req.session.error = "";

    aboutModel.findOne({ _id: req.params.id }).
        populate('user_id').
        exec(function (err, record) {
            if (err) return handleError(err);
            console.log('The author is %s', record);
            res.render('update', { error: error, id: req.params.id, record });
            // prints "The author is Ian Fleming"
        });



}



const deleteView = (req, res, next) => {


    aboutModel.findOneAndDelete({ _id: req.body.id }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted User : ", docs);
            userModel.findOneAndDelete({ _id: docs.user_id }, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted User : ", docs);
                    res.redirect('/');
                }
            })
        }
    })

}

const testView = (req, res, next) => {

    res.render('test');

}



const addPostView = async (req, res, next) => {

    console.log(req.body);


    const body = req.body;
    // const salt = await .genSalt(10);

    // const passwordHash = await .hash(body.password, salt)
    // body.password = passwordHash;
    const { fullname, password, mobile, email, dob, gender, cpassword, qualification, skills, address, city, state, country } = body;
    if (!(password == cpassword)) {
        req.session.error = 'Confirm Password do not match';
        return res.redirect('/adduser');
    }


    if (city == '' || state == '' || country == '') {
        req.session.error = 'Please select city state and country respectively';
        return res.redirect('/adduser');
    }

    if (gender == '') {
        req.session.error = 'Please select city state and country respectively';
        return res.redirect('/adduser');
    }

    const checkUser = await userModel.findOne({ email });

    if (checkUser) {
        req.session.error = 'Email already exist !';
        return res.redirect('/adduser');
    }

    // var upload = multer({ storage: storage }).single('myimage');

    // upload(req, res, function (err) {
    //     if (err) {
    //         return console.log("Error uploading file " + err);
    //     }
    //     return console.log("File is uploaded successfully!");
    // });




    const image = req.file.filename;



    const newUser = new userModel({
        fullname, email, mobile, dob, password, image, gender
    })





    try {
        await newUser.save();
        const user_id = newUser._id;
        const aboutUser = new aboutModel({
            qualification, skills, address, dob, city, state, country, user_id
        });

        await aboutUser.save();
        //return res.status(200).json({ success: true, message: "Signup and logged In Successfully !!", token: "serajisbest", data: newUser, data2: aboutUser });
        return res.redirect('/');
    } catch (error) {
        error.status = 400;
        next(error);
    }

    //return res.send(req.body);

}



const updatePostView = async (req, res, next) => {

    //console.log(req.body);


    const body = req.body;
    // const salt = await .genSalt(10);

    // const passwordHash = await .hash(body.password, salt)
    // body.password = passwordHash;

    const { fullname, password, mobile, email, dob, gender, cpassword, qualification, skills, address, city, state, country } = body;
    if (!(password == cpassword)) {
        req.session.error = 'Confirm Password do not match';
        return res.redirect('/update');
    }

    if (city == '' || state == '' || country == '') {
        req.session.error = 'Please select city state and country respectively';
        return res.redirect('/update');
    }

    if (gender == '') {
        req.session.error = 'Please select city state and country respectively';
        return res.redirect('/update');
    }
    var id = req.body.id;
    const checkUser = await aboutModel.findOne({ _id: id });

    if (!checkUser) {
        req.session.error = 'Email already exist !';
        return res.redirect('/adduser');
    }





    let doc = await aboutModel.findOneAndUpdate({ _id: req.body.id }, body, {
        new: true
    });

    let udoc = await userModel.findOneAndUpdate({ _id: doc.user_id }, body, {
        new: true
    });




    return res.redirect('/');

}




module.exports = {
    indexView,
    addPostView,
    addView,
    testView,
    updatePostView,
    updateView,
    deleteView

}