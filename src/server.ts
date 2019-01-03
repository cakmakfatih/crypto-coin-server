import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as json from "koa-json";
import * as cors from '@koa/cors';
import axios from 'axios';

import { Currency } from './models/currency.model';

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(json());

const sendError = (ctx: Router.IRouterContext, status: number) => {
    ctx.status = status;
    ctx.body = {
        status: "error"
    };
};

router.get('/coin', async (ctx) => {
    let search: string = ctx.request.query.search;

    if(typeof search !== 'undefined') {
        let result: Currency = await axios({
            method: "GET",
            url: "https://api.coinmarketcap.com/v1/ticker/"
        })
        .then(res => res.data.filter((i: Currency) => i.symbol === search.toUpperCase())[0]);
    
        if(result) {
            ctx.body = {
                status: "success",
                ...result
            };
        } else {
            sendError(ctx, 404);
        }
    } else {
        sendError(ctx, 404);
    }
});

app.use(router.routes());

app.listen(process.env.PORT || 3000, () => console.log(`Listening to port ${process.env.PORT || 3000}`));