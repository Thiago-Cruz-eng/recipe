const jwt = require('jsonwebtoken')
const auth = (req, res, next) => {
    try {
        if(!req.headers.authorization) return res.status(401).send()
        const token = req.headers.authorization.split(" ")[1]
        const hasPermission = jwt.verify(token, process.env.SECRET)
        req.permission = hasPermission
        next()
    } catch(err) {
        return res.status(401).send()
    }
}

module.exports = auth