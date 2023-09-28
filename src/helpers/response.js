const config = require('./../config/app.config.json')
class _response{
    sendResponse = (res, data)=>{
        try {
            if(data.code){
                res.status(data.code);
                delete data.code;
                res.send(data);
                return true;
            }

            res.status(data && data.status? 200 : 400);
            res.send(data);
            return true;

        } catch (error){
            if(config.debug){
                console.error('sendResponse helper Error: ', error);
            }

            res.status(400).send({
                status: false,
                error
            });
            return false;
        }
    }

    errorHandling = (err, req, res, next)=>{
        if (err.code === 'permission_denied') {
            return res.status(403).send('Forbidden');
        }

        if (err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(401).json({ status: false, error: 'Invalid Token' });
        }

        // default to 500 server error
        return res.status(500).json({ status: false, error: err.message });
    }
}

module.exports = new _response()
