const express = require("express")
const bcrypt = require("bcrypt")
const {saveUser, getUserByEmail} = require("../database/users");
const jwt = require("jsonwebtoken")
const z = require("zod")
const router = express.Router()
const auth = require('../middleware/auth')
const {
    getUserById
}  = require("../database/users")
const {ZodError} = require("zod");

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
})

router.post("/register", async (req, res) => {
    try {
        const user = userSchema.parse(req.body)
        const hashedPassword = bcrypt.hashSync(req.body.password, 15)
        const hasEmail = await getUserByEmail(req.body.email)
        if(hasEmail) return res.status(400).json({message: "friend, you already have account with us"})
        user.password = hashedPassword
        const savedUser = await saveUser(user)
        delete savedUser.password
        res.status(201).json({
            user: savedUser
        })
    } catch(err) {
        if(err instanceof ZodError) {
            return res.status(422).json({
                message: err.errors
            })
        }
        return res.status(500).json({
            message: "server error"
        })
    }
})

router.post("/login", async (req, res) => {
    //not a comonn way / not a smart way
    if(!req.body.email || !req.body.password) return res.status(401).send()
    // in other way u need to a lib zod
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const userFromDb = await getUserByEmail(user.email)

    if(!userFromDb) {
        return res.status(401).json({message: "user or password incorrect"})
    }
    const hasPermission = bcrypt.compare(user.password, userFromDb.password)
    if(!hasPermission) {
        return res.status(401).json({message: "user or password incorrect"})
    }

    const token = jwt.sign({
        userId: userFromDb.id
    },process.env.SECRET)
    res.json({
        success: true,
        token
    })
})

router.get("/profile", auth, async (req, res, next) => {
    const user = await getUserById(req.permission.userId)
    res.json({
        user
    })
})

module.exports = {
    router,
}