"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayReport = void 0;
var constants_1 = require("../../../constants");
var api_1 = require("../api");
var getDayReport = function (since, until) { return __awaiter(void 0, void 0, void 0, function () {
    var insights, link_clicks, cost_per_link_click, messages, cost_per_message, spend;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, api_1.facebookApi.getInsights({
                    since: since,
                    until: until,
                })];
            case 1:
                insights = _e.sent();
                link_clicks = (_a = insights[0].actions.find(function (action) { return action.action_type === constants_1.actions.LINK_CLICK; })) === null || _a === void 0 ? void 0 : _a.value;
                cost_per_link_click = (_b = insights[0].cost_per_action_type.find(function (action) { return action.action_type === constants_1.actions.LINK_CLICK; })) === null || _b === void 0 ? void 0 : _b.value;
                messages = (_c = insights[0].actions.find(function (action) { return action.action_type === constants_1.actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION; })) === null || _c === void 0 ? void 0 : _c.value;
                cost_per_message = (_d = insights[0].cost_per_action_type.find(function (action) { return action.action_type === constants_1.actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION; })) === null || _d === void 0 ? void 0 : _d.value;
                spend = insights[0].spend;
                return [2 /*return*/, "\n\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0437\u0430 ".concat(since, " - ").concat(until, ":\n\u041A\u043B\u0438\u043A\u0438 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435: ").concat(link_clicks, "\n\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043A\u043B\u0438\u043A\u0430 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435: ").concat(cost_per_link_click, "\n\u0417\u0430\u044F\u0432\u043A\u0438: ").concat(messages, "\n\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F: ").concat(cost_per_message, "\n\u0420\u0430\u0441\u0445\u043E\u0434: ").concat(spend, "\n  ")];
        }
    });
}); };
exports.getDayReport = getDayReport;
