const passport = require("./auth");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        let { name, password, email, isPublic } = req.body;
        let userExist = await userModel.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ msg: "User already exist", status: false })
        }
        password = bcrypt.hashSync(password, 10)
        const user = await userModel.create({ name, password, email, isPublic, isAdmin: false })
        console.log("user >_", user);
        return res.status(200).json({ msg: "User created" })
    } catch (error) {
        console.log("error :", error);
        return res.status(500).json({ msg: "something went wrong" })
    }
}
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let userExist = await userModel.findOne({ email: email });
        if (!userExist) {
            return res.status(404).json({ msg: "User not exist", status: false })
        }
        let passportMatch = bcrypt.compareSync(password, userExist.password);
        if (!passportMatch) {
            return res.status(400).json({ msg: "Password does not match", status: false })
        }
        let token = jwt.sign({ _id: userExist._id, email: userExist.email, isAdmin: userExist.isAdmin, isPublic: userExist.isPublic }, process.env.JWT_SECRET);
        return res.status(200).json({ token: token });
    } catch (error) {
        console.log("error ::", error);
        return res.status(500).json({ status: false, msg: "Something went wrong" })
    }
}
exports.login_google = async (req, res) => {

    passport.authenticate("google", { scope: ["email", "profile"] })
}
exports.update_photo = async (req, res) => {
    try {
        if (!(req.file || req.photo)) {
            return res.status(400).json({ msg: "file or url is required" })
        }
        let path = ""
        if (req.file && req.file.path) {
            path = req.file.path
        }
        if (req.body.photo) {
            path = req.body.photo
        }
        let updatedUser = await userModel.updateOne({ email: req.user.email }, { photo: path });
        return res.status(200).json({ msg: "photo updated" })
    } catch (error) {
        console.log("error >_", error);
        return res.status(500).json({ status: false, msg: "Something went wrong" })
    }
}
exports.update_user = async (req, res) => {
    let { userid } = req.params;
    let body = req.body;
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
    }
    let updatedUser = await userModel({ _id: userid }, body);
    return res.status(200).json({ msg: "user updated", status: false })
}
exports.profile = async (req, res) => {
    try {
        let { profileid } = req.params;
        let profile = await userModel.findOne({ _id: profileid });
        console.log(":: <profile> ::", profile);
        let { user } = req;
        let DBuser = await userModel.findById({ _id: user._id });
        console.log("profile.isAdmin ", profile.isAdmin);
        console.log("profile.isPublic ", profile.isPublic);
        console.log("profile.id === DBuser.id ", profile._id == DBuser._id);
        if (DBuser.isAdmin || profile.isPublic || profile._id == DBuser._id) {
            return res.status(200).json({ profile: profile })
        } else {
            return res.status(400).json({ msg: "user not not allowed" });
        }
    } catch (error) {
        console.log("error >_", error);
        return res.status(500).json({ msg: "Something went wrong" })
    }
}