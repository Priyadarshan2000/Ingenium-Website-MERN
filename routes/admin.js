const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require("../conig");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const Admin = require("../models/admin.model");

router.route("/:username").get(middleware.checkToken, (req, res) => {
    Admin.findOne({ username: req.params.username },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            res.json({
                data: result,
                username: req.params.username
            })
        });
});

router.route('/checkusername/:username').get((req, res) => {
    Admin.findOne({ username: req.params.username },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            if (result !== null) {
                return res.json({
                    Status: true,
                })
            } else return res.json({
                Status: false,
            })
        });
});

router.route("/login").post((req, res) => {
    Admin.findOne({ username: req.body.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if (result === null) {
            return res.status(403).json("Username incorrect")
        }
        if (result.password != req.body.password) {
            let token = jwt.sign({ username: req.body.username }, config.key, { expiresIn: "24h", });
            res.json({
                token: token,
                msg: "Success",
            })
        } else {
            res.status(403).json("password incorrect")
        }
    })
})
router.route("/register").post((req, res) => {
    console.log("Inside the register");
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new Admin({
        username: req.body.username,
        password: hashedPassword,
        // password: req.body.password,
        email: req.body.email,
    });
    user
        .save()
        .then(() => {
            console.log("user registered");
            res.status(200).json("Ok...")
        }).catch((err) => {
            res.status(403).json({ msg: err });
        });
})


router.route("/update/:username").patch(middleware.checkToken, (req, res) => {
    Admin.findOneAndUpdate({ username: req.params.username }, { $set: { password: req.body.password } },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            const msg = {
                msg: "password successfully updated",
                username: req.params.username,
            };
            return res.json(msg);
        }
    )
})

router.route("/delete/:username").delete((req, res) => {
    Admin.findOneAndDelete({ username: req.params.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        const msg = {
            msg: "username deleted",
            username: req.params.username
        };
        return res.json(msg);
    })
})

module.exports = router;