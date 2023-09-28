const jwt = require('jsonwebtoken');
const mysql = require('./database.js')
const config = require('./../config/app.config.json')

class _middleware{
    userSession = async (req, res, next) => {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1]

                const decoded = jwt.verify(token, config.jwt.secret)

                const user = await mysql.query(
                    `SELECT 
                        au.id, 
                        au.name, 
                        au.email, 
                        au.password
                FROM auth_user au
                WHERE au.id = ?`,
                    [decoded.i]
                )

                if (user) {
                    req.user = {
                        i: user[0].id,
                        email: user[0].email,
                        n: user[0].name,
                    }

                    next()
                } else {
                    res.status(401).send({ message: 'Not authorized' })
                }
            } catch (error) {
                // console.error('Middleware user not authorized Error: ', error)
                res.status(401).send({ message: 'Not authorized Error. Token Expired.' })
            }
        }

        if (!token) {
            res.status(401).send({
                message: 'Not authenticated, no token'
            })
        }
    }
}

module.exports = new _middleware()
