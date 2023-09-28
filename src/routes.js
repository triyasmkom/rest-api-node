const Auth = require("./controllers/Auth");
const Test = require("./controllers/Test");
const _routes = [
    ['', Auth],
    ['', Test],
];

const routes = (app)=>{
    _routes.forEach(router=>{
        const [url, controller] = router
        app.use(`/api${url}`, controller)
    });
}

module.exports= routes
