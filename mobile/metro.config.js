const path = require('path');
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, '../src')];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '../node_modules')];

module.exports = withNativeWind(config, { input: './global.css', projectRoot: __dirname });
