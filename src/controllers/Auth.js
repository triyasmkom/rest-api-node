const express = require('express');
const response = require('./../helpers/response');
const m$auth = require('./../modules/auth.module.js')


const Auth = express.Router();

Auth.get('/register', async (req, res)=>{
    const register = m$auth.register(req.body);
    response.sendResponse(res, register)
});

Auth.get('/login', async (req, res)=>{
    const login = m$auth.login(req.body);
    response.sendResponse(res, login)
});

module.exports = Auth

