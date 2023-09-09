"use strict";
exports.__esModule = true;
exports.splitBy = exports.trimPrefix = void 0;
// MIME types for web
var MimeTypes = {
    // application
    "application/javascript": ["js", "mjs"],
    "application/typescript": ["ts", "mts"],
    "application/wasm": ["wasm"],
    "application/json": ["json", "map"],
    "application/jsonc": ["jsonc"],
    "application/json5": ["json5"],
    "application/pdf": ["pdf"],
    "application/xml": ["xml", "plist", "tmLanguage", "tmTheme"],
    "application/zip": ["zip"],
    "application/gzip": ["gz"],
    "application/tar": ["tar"],
    "application/tar+gzip": ["tar.gz", "tgz"],
    // text
    "text/html": ["html", "htm"],
    "text/markdown": ["md", "markdown"],
    "text/mdx": ["mdx"],
    "text/jsx": ["jsx"],
    "text/tsx": ["tsx"],
    "text/vue": ["vue"],
    "text/svelte": ["svelte"],
    "text/css": ["css"],
    "text/less": ["less"],
    "text/sass": ["sass", "scss"],
    "text/stylus": ["stylus", "styl"],
    "text/csv": ["csv"],
    "text/yaml": ["yaml", "yml"],
    "text/plain": ["txt", "glsl"],
    // font
    "font/ttf": ["ttf"],
    "font/otf": ["otf"],
    "font/woff": ["woff"],
    "font/woff2": ["woff2"],
    "font/collection": ["ttc"],
    // image
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/apng": ["apng"],
    "image/gif": ["gif"],
    "image/webp": ["webp"],
    "image/avif": ["avif"],
    "image/svg+xml": ["svg", "svgz"],
    "image/x-icon": ["ico"],
    // audio
    "audio/mp4": ["m4a"],
    "audio/mpeg": ["mp3", "m3a"],
    "audio/ogg": ["ogg", "oga"],
    "audio/wav": ["wav"],
    "audio/webm": ["weba"],
    // video
    "video/mp4": ["mp4", "m4v"],
    "video/ogg": ["ogv"],
    "video/webm": ["webm"],
    "video/x-matroska": ["mkv"],
    // shader
    "x-shader/x-fragment": ["frag"],
    "x-shader/x-vertex": ["vert"]
};
var typesMap = Object.entries(MimeTypes).reduce(function (map, _a) {
    var contentType = _a[0], exts = _a[1];
    exts.forEach(function (ext) { return map.set(ext, contentType); });
    return map;
}, new Map());
/** register a new type */
function registerType(ext, contentType) {
    typesMap.set(trimPrefix(ext, "."), contentType);
}
exports["default"] = registerType;
/** get the content type by file name */
function getContentType(filename) {
    var _a;
    var _b = splitBy(filename, ".", true), prefix = _b[0], ext = _b[1];
    if (ext === "gz" && prefix.endsWith(".tar")) {
        ext = "tar.gz";
    }
    return (_a = typesMap.get(ext)) !== null && _a !== void 0 ? _a : "application/octet-stream";
}
exports["default"] = getContentType;
function trimPrefix(s, prefix) {
    if (prefix !== "" && s.startsWith(prefix)) {
        return s.slice(prefix.length);
    }
    return s;
}
exports.trimPrefix = trimPrefix;
function splitBy(s, searchString, fromLast) {
    if (fromLast === void 0) { fromLast = false; }
    var i = fromLast ? s.lastIndexOf(searchString) : s.indexOf(searchString);
    if (i >= 0) {
        return [s.slice(0, i), s.slice(i + searchString.length)];
    }
    return [s, ""];
}
exports.splitBy = splitBy;
