import { readFileSync, writeFileSync, existsSync } from 'fs';
import { Utils } from './modules';
import { DefaultTnConfig } from './settings';

export declare type WhiteSpace = 'pre' | 'normal';

export interface CompilerOptions {
  rootBlockName?: string;
  blockIndentSize?: number;
  warnDuplicateConstraint?: boolean;
  warnUndefinedConstraint?: boolean;
  warnUnannotatedConstraint?: boolean;
}

export interface MarkupMapItem {
  tagName?: string;
  id?: string;
  className?: string;
  validate?: boolean;
  selfClosing?: boolean;
  whiteSpace?: WhiteSpace;
  content?: string;
  attributes?: {
    [attrKey: string]: string;
  };
}

export interface MarkupMap {
  [key: string]: MarkupMapItem;
}

export interface TnConfig {
  compilerOptions: CompilerOptions;
  markupMap?: MarkupMap;
}

export class Config {
  static initTnConfig() {
    const path = Utils.getPath('tnconfig.json');
    const json = JSON.stringify(DefaultTnConfig, null, '  ');
    writeFileSync(path, json, { encoding: 'utf8' });
  }

  static loadTnConfig(filename: string): TnConfig {
    const path = Utils.getPath(filename);
    if (!existsSync(path)) {
      return DefaultTnConfig;
    }
    try {
      const config = JSON.parse(readFileSync(path, 'utf8')) as TnConfig;
      // for backward compatibility(ver < 2.0.0)
      config.compilerOptions = config.compilerOptions || DefaultTnConfig.compilerOptions;
      return config;
    } catch (err) {
      console.error(`Failed to load config file(${filename}), so use default one.`);
      console.error(err);
      return DefaultTnConfig;
    }
  }
}

