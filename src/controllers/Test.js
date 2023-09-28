const express = require('express');
const response = require('./../helpers/response');
const middle = require('./../helpers/middleware.js')


const Test = express.Router();

Test.get('/test', middle.userSession, async (req, res, next)=>{
    const test = {
        status: true,
        code: 200,
        message: "private"
    };
    response.sendResponse(res, test)
});

Test.get('/public', async (req, res)=>{
    const test = {
        status: true,
        code: 200,
        message: "pubic API"
    };
    response.sendResponse(res, test)
});

module.exports = Test

