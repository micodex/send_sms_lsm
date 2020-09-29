"use strict"

const http = require("http");
const url = require("url");
const got = require("got");
// const log4js = require('log4js');

// log4js.configure({
//   appenders:  { send_sms: { type: "file", filename: "./send_sms.log" } },
//   categories: { default: { appenders: ["send_sms"], level: "info" } }
// });
// var logger = log4js.getLogger();

const APP_HOST = process.env.APP_HOST || "0.0.0.0";
const APP_PORT = process.env.APP_PORT || 3000;
const SMS_URL = process.env.SMS_URL || "http://sms-api.luosimao.com/v1/send.json";
const SMS_KEY = process.env.SMS_KEY || "";

const processor = (req, resp) => {
    let query_params = url.parse(req.url, true).query;

    let message = "";
    if (query_params.usage === 'modify_mobile') {
        message = `您正在绑定手机，您的验证码是${query_params.code}，如非本人操作，请忽略本短信【米宝】`;
    }
    else if (query_params.usage === 'login_by_mobile') {
        message = `您正在登录，您的验证码是${query_params.code}。如非本人操作，请忽略本短信【米宝】`;
    }
    else if (query_params.usage === 'modify_safecode') {
        message = `您的验证码是${query_params.code}。如非本人操作，请忽略本短信【米宝】`;
    }
    else {
        // logger.info('param usage['+query_params.usage+'] error');
        console.log('param usage['+query_params.usage+'] error');
        return;
    }

    // logger.info(query_params.code+' '+query_params.mobile+' '+query_params.usage);
    console.log(query_params.code+' '+query_params.mobile+' '+query_params.usage);

    (async () => {
        try {
            const response = await got.post(SMS_URL, {
                form: {mobile: query_params.mobile, message: message},
                username: "api",
                password: "key-"+SMS_KEY,
                timeout: 5000,
            });
            // logger.info(query_params.code+' '+JSON.stringify(response.body));
            console.log(query_params.code+' '+JSON.stringify(response.body));
            resp.writeHead(200, {'Content-Type': 'text/plain'});
            resp.end();
        } catch (error) {
            // logger.info(query_params.code+' '+error.response.body);
            console.log(query_params.code+' '+error.response.body);
            resp.writeHead(400, {'Content-Type': 'text/plain'});
            resp.end();
	}})();
}

http.createServer(processor).listen(APP_PORT, APP_HOST);
