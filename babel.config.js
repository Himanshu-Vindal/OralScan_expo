module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      // Required for react-native-reanimated (must be last)
      "react-native-reanimated/plugin",
    ],
  };
};
