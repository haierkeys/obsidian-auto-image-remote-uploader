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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.RemoteUploader = exports.handleApiResponseError = void 0;
var obsidian_1 = require("obsidian");
var ApiError_1 = require("./ApiError");
var es_mime_types_1 = require("es-mime-types");
function handleApiResponseError(resp) {
    return __awaiter(this, void 0, Promise, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(resp.headers.get("Content-Type") === "application/json")) return [3 /*break*/, 2];
                    _a = ApiError_1["default"].bind;
                    return [4 /*yield*/, resp.json()];
                case 1: throw new (_a.apply(ApiError_1["default"], [void 0, (_c.sent()).msg]))();
                case 2:
                    _b = Error.bind;
                    return [4 /*yield*/, resp.text()];
                case 3: throw new (_b.apply(Error, [void 0, _c.sent()]))();
            }
        });
    });
}
exports.handleApiResponseError = handleApiResponseError;
var RemoteUploader = /** @class */ (function () {
    function RemoteUploader(settings, plugin) {
        this.settings = settings;
        this.plugin = plugin;
    }
    RemoteUploader.prototype.uploadUrlFile = function (filename) {
        return __awaiter(this, void 0, Promise, function () {
            var formData, response, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        formData.append("name", filename.format());
                        return [4 /*yield*/, fetch(this.settings.imageApi, {
                                method: "POST",
                                headers: { "Content-Type": "multipart/form-data" },
                                body: formData
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, handleApiResponseError(response)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        res = (_a.sent());
                        console.log("uploadFile response", res);
                        res.success = true;
                        this.settings.uploadedImages = __spreadArrays((this.settings.uploadedImages || []), [
                            res.data.imageurl,
                        ]);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RemoteUploader.prototype.uploadFileByBlob = function (content, ufile) {
        return __awaiter(this, void 0, Promise, function () {
            var requestData, blob, file, response, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(ufile, es_mime_types_1.lookup(ufile));
                        requestData = new FormData();
                        blob = new Blob([content], { type: es_mime_types_1.lookup(ufile) });
                        file = new File([blob], ufile.originalPath);
                        requestData.append("imagefile", file);
                        return [4 /*yield*/, fetch(this.settings.imageApi, {
                                method: "POST",
                                headers: new Headers({ Authorization: "Client-ID" }),
                                body: requestData
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, handleApiResponseError(response)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        res = (_a.sent());
                        console.log("uploadFileByClipboard response", res);
                        res.success = true;
                        this.settings.uploadedImages = __spreadArrays((this.settings.uploadedImages || []), [
                            res.data.imageurl,
                        ]);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RemoteUploader.prototype.uploadFile = function (image) {
        return __awaiter(this, void 0, Promise, function () {
            var requestData, response, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestData = new FormData();
                        requestData.append("imagefile", image);
                        return [4 /*yield*/, fetch(this.settings.imageApi, {
                                method: "POST",
                                headers: new Headers({ Authorization: "Client-ID" }),
                                body: requestData
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, handleApiResponseError(response)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        res = (_a.sent());
                        console.log("uploadFileByClipboard response", res);
                        res.success = true;
                        this.settings.uploadedImages = __spreadArrays((this.settings.uploadedImages || []), [
                            res.data.imageurl,
                        ]);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RemoteUploader.prototype.deleteImage = function (configMap) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, obsidian_1.requestUrl({
                            url: this.plugin.settings.imageApi,
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                list: configMap
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        data = response.json;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return RemoteUploader;
}());
exports.RemoteUploader = RemoteUploader;
