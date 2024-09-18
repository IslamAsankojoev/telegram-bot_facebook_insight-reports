"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
var axios_1 = require("axios");
var constants_1 = require("../constants");
exports.api = axios_1.default.create({
    baseURL: "https://graph.facebook.com/v20.0/".concat(constants_1.AD_OBJECT_ID),
});
exports.api.interceptors.request.use(function (config) {
    config.params = config.params || {};
    config.params.access_token = constants_1.accessToken;
    return config;
}, function (error) {
    return Promise.reject(error);
});
