const Router = require("express").Router();
const { signup, update_photo, login, profile, update_user } = require("../controllers/users");
const { authenticate } = require("../middleware/authentication");
const passport = require("../controllers/auth");

let multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "photos")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

let upload = multer({ storage: storage });

Router.post("/signup", signup);
Router.post("/login", login);
Router.post("/upload_photo", authenticate, upload.single("photo"), update_photo)
Router.get("/login/google", passport.authenticate("google", { scope: ["email", "profile"] }))
Router.post('/profile/:profileid', authenticate, profile);
Router.post("/update/user/:userid", update_user);

module.exports = Router;