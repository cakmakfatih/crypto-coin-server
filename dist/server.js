"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const json = require("koa-json");
const cors = require("@koa/cors");
const axios_1 = require("axios");
const app = new Koa();
const router = new Router();
app.use(cors());
app.use(json());
const sendError = (ctx, status) => {
    ctx.status = status;
    ctx.body = {
        status: "error"
    };
};
router.get('/coin', async (ctx) => {
    let search = ctx.request.query.search;
    if (typeof search !== 'undefined') {
        let result = await axios_1.default({
            method: "GET",
            url: "https://api.coinmarketcap.com/v1/ticker/"
        })
            .then(res => res.data.filter((i) => i.symbol === search.toUpperCase())[0]);
        if (result) {
            ctx.body = Object.assign({ status: "success" }, result);
        }
        else {
            sendError(ctx, 404);
        }
    }
    else {
        sendError(ctx, 404);
    }
});
app.use(router.routes());
app.listen(process.env.PORT || 3000, () => console.log(`Listening at port ${process.env.PORT || 3000}`));
//# sourceMappingURL=server.js.map