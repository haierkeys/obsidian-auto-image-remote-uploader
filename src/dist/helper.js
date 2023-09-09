"use strict";
exports.__esModule = true;
var obsidian_1 = require("obsidian");
var path_1 = require("path");
// ![](./dsa/aa.png) local image should has ext
// ![](https://dasdasda) internet image should not has ext
var REGEX_FILE = /\!\[(.*?)\]\((\S+\.\w+)\)|\!\[(.*?)\]\((https?:\/\/.*?)\)/g;
var REGEX_WIKI_FILE = /\!\[\[(.*?)(\s*?\|.*?)?\]\]/g;
var Helper = /** @class */ (function () {
    function Helper(app) {
        this.app = app;
    }
    Helper.prototype.getFrontmatterValue = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        var file = this.app.workspace.getActiveFile();
        if (!file) {
            return undefined;
        }
        var path = file.path;
        var cache = this.app.metadataCache.getCache(path);
        var value = defaultValue;
        if ((cache === null || cache === void 0 ? void 0 : cache.frontmatter) && cache.frontmatter.hasOwnProperty(key)) {
            value = cache.frontmatter[key];
        }
        return value;
    };
    Helper.prototype.getEditor = function () {
        var mdView = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
        if (mdView != null) {
            return mdView.editor;
        }
        else {
            return null;
        }
    };
    Helper.prototype.getValue = function () {
        var editor = this.getEditor();
        return editor.getValue();
    };
    Helper.prototype.setValue = function (value) {
        var editor = this.getEditor();
        var _a = editor.getScrollInfo(), left = _a.left, top = _a.top;
        var position = editor.getCursor();
        editor.setValue(value);
        editor.scrollTo(left, top);
        editor.setCursor(position);
    };
    // get all file urls, include local and internet
    Helper.prototype.getAllFiles = function () {
        var editor = this.getEditor();
        var value = editor.getValue();
        return this.getImageLink(value);
    };
    Helper.prototype.getImageLink = function (value) {
        var matches = value.matchAll(REGEX_FILE);
        var WikiMatches = value.matchAll(REGEX_WIKI_FILE);
        var fileArray = [];
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            var source = match[0];
            var name = match[1];
            var path = match[2];
            if (name === undefined) {
                name = match[3];
            }
            if (path === undefined) {
                path = match[4];
            }
            fileArray.push({
                path: path,
                originalPath: path,
                name: name,
                source: source
            });
        }
        for (var _a = 0, WikiMatches_1 = WikiMatches; _a < WikiMatches_1.length; _a++) {
            var match = WikiMatches_1[_a];
            var name = path_1.parse(match[1]).name;
            var path = match[1];
            var source = match[0];
            if (match[2]) {
                name = "" + name + match[2];
            }
            fileArray.push({
                path: path,
                originalPath: path,
                name: name,
                source: source
            });
        }
        return fileArray;
    };
    Helper.prototype.hasBlackDomain = function (src, blackDomains) {
        if (blackDomains.trim() === "") {
            return false;
        }
        var blackDomainList = blackDomains.split(",").filter(function (item) { return item !== ""; });
        var url = new URL(src);
        var domain = url.hostname;
        return blackDomainList.some(function (blackDomain) { return domain.includes(blackDomain); });
    };
    return Helper;
}());
exports["default"] = Helper;
