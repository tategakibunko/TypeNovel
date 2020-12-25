"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const modules_1 = require("./modules");
const settings_1 = require("./settings");
class Config {
    static initTnConfig() {
        const path = modules_1.Utils.getPath('tnconfig.json');
        const json = JSON.stringify(settings_1.DefaultTnConfig, null, '  ');
        fs_1.writeFileSync(path, json, { encoding: 'utf8' });
    }
    static loadTnConfig(filename) {
        const path = modules_1.Utils.getPath(filename);
        if (!fs_1.existsSync(path)) {
            return settings_1.DefaultTnConfig;
        }
        try {
            const config = JSON.parse(fs_1.readFileSync(path, 'utf8'));
            // for backward compatibility(ver < 2.0.0)
            config.compilerOptions = config.compilerOptions || settings_1.DefaultTnConfig.compilerOptions;
            return config;
        }
        catch (err) {
            console.error(`Failed to load config file(${filename}), so use default one.`);
            console.error(err);
            return settings_1.DefaultTnConfig;
        }
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map