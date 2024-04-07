const session = require("express-session");
let express = require("express");
let passport = require("./controllers/auth.js");
let router = require("./routes/users.js");
const { default: mongoose } = require("mongoose");
const app = express();

mongoose.connect(process.env.DB).then(() => console.log("DB connect")).catch((e) => console.log("DB connection error >_", e))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/", router);

app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authentication with Google</a>')
})

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session());

app.get("/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
)

app.use("/auth/logout", (req, res, next) => {
    console.log(":: req.session ::", req.session);
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({ status: true, msg: "logout success" });
    });
})

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure"
}))

app.get("/auth/google/success", (req, res) => {
    // let user = req.user.displayName;
    return res.status(200).json({ msg: `Hello !!!` })
})
app.get("/auth/google/failure", (req, res) => {
    return res.status(400).json({ msg: "Something went wrong !!" })
})

const port = process.env.PORT || 3333;

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})