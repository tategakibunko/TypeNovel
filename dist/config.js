"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var modules_1 = require("./modules");
var settings_1 = require("./settings");
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.initTnConfig = function () {
        var path = modules_1.Utils.getPath('tnconfig.json');
        var json = JSON.stringify(settings_1.DefaultTnConfig, null, '  ');
        fs_1.writeFileSync(path, json, { encoding: 'utf8' });
    };
    Config.loadTnConfig = function (filename) {
        var path = modules_1.Utils.getPath(filename);
        if (!fs_1.existsSync(path)) {
            return settings_1.DefaultTnConfig;
        }
        try {
            var config = JSON.parse(fs_1.readFileSync(path, 'utf8'));
            // for backward compatibility(ver < 2.0.0)
            config.compilerOptions = config.compilerOptions || settings_1.DefaultTnConfig.compilerOptions;
            return config;
        }
        catch (err) {
            console.error("Failed to load config file(" + filename + "), so use default one.");
            console.error(err);
            return settings_1.DefaultTnConfig;
        }
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map