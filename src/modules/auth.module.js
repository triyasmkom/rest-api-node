const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('./../config/app.config.json');
const mysql = require('./../helpers/database.js');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs')
class _auth{
    register = async (body)=>{
        try{
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            }).options({
                abortEarly: false
            });

            const validation = schema.validate(body);
            if(validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            // hash password
            body.password = bcrypt.hashSync(body.password, 10)

            // add user
            const add = await mysql.query(
                'INSERT INTO auth_user ( name, email, password) VALUES (?, ?, ?)',
                [body.name, body.email, body.password]
            ).then(data=>{
                return {
                    status: true,
                    data
                }
            }).catch(error=>{
                return{
                    status: false,
                    error
                }
            })

            return {
                status: true,
                code: 201,
                data: add.data
            }

        } catch(error){
            if (config.debug){
                console.error('register auth module Error: ', error)
            }

            if(error.code==='ER_DUP_ENTRY'){
                return {
                    status: false,
                    code: 409,
                    error: 'Sorry, user already exists'
                }
            }

            return {
                status: false,
                error
            }
        }
    }

    login = async (body) => {
        try {
            const schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            }).options({ abortEarly: false })

            const validation = schema.validate(body)

            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            const { expired, secret, secretRefresh } = config.jwt

            const check = await mysql.query(
                `SELECT 
                        au.id, 
                        au.name, 
                        au.email, 
                        au.password
            FROM auth_user au
            WHERE au.email = ?`,
                [body.email]
            )

            if (check.code === 'EMPTY_RESULT') {
                return {
                    status: false,
                    code: 404,
                    error: 'Sorry, user not found'
                }
            }

            if (!bcrypt.compareSync(body.password, check[0].password)) {
                return {
                    status: false,
                    code: 401,
                    error: 'Sorry, wrong password'
                }
            }

            const payload = {
                i: check[0].id,
                e: check[0].email,
                n: check[0].name,
            }

            const expiresAt = dayjs(new Date(Date.now() + expired)).format('YYYY-MM-DD HH:mm:ss')

            const token = jwt.sign(payload, secret, { expiresIn: String(expired) })
            const refreshToken = jwt.sign({ i: payload.i }, secretRefresh, { expiresIn: '30d' })

            return {
                status: true,
                code:200,
                data: {
                    token,
                    refresh_token: refreshToken,
                    expiresAt
                }
            }
        } catch (error) {
            if(config.debug){
                console.error('login auth module Error: ', error)
            }

            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _auth()
