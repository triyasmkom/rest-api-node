const Auth = require("./controllers/Auth");
const _routes = [
    ['', Auth],
];

const routes = (app)=>{
    _routes.forEach(router=>{
        const [url, controller] = router
        app.use(`/api${url}`, controller)
    });
}

module.exports= routes
