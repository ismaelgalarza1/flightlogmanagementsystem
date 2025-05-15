// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts = defaultConfig.resolver.sourceExts || [];
if (!defaultConfig.resolver.sourceExts.includes("cjs")) {
  defaultConfig.resolver.sourceExts.push("cjs");
}
defaultConfig.resolver.unstable_enablePackageExports = false;
module.exports = defaultConfig;
